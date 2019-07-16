import { EC2PlatformType, EC2Platform } from "./models/ec2_platform";
import { InstancePrice } from "./models/instance_price";
import { EC2Instance } from "./models/ec2_instance";
import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";
import { SettingKeys } from "./settings/setting_keys";
import { Utils } from "./_utils";

export class EC2Price {
    private readonly instance: EC2Instance

    constructor(private readonly settings: any, instType: string) {
        this.instance = new EC2Instance(instType)
    }

    get(duration: PriceDuration): number {
        let instPrice = this.ec2GetPrice(this.instance, this.setting(SettingKeys.Region),
            this.setting(SettingKeys.PurchaseType), this.platformType())

        return instPrice.unitPrice()
    }

    private platformType(): EC2PlatformType {
        let platform = this.setting(SettingKeys.Platform)

        let pType = EC2Platform.nameToType(platform)
        if (pType == null) {
            throw `Unknown EC2 platform: ${platform}`
        }

        return pType
    }

    private ec2PrevGenPriceDataPath(region: string, purchaseType: string, platform: EC2PlatformType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/previous-generation/%s/%s/index.json',
            region, this.purchaseTypeToUri(purchaseType), EC2Platform.typeToUriPath(platform))
    }

    private ec2PriceDataPath(region: string, purchaseType: string, platform: EC2PlatformType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/%s/%s/index.json',
            region, this.purchaseTypeToUri(purchaseType), EC2Platform.typeToUriPath(platform))
    }

    private ec2GetPrice(instance: EC2Instance, region: string, purchaseType: string, platform: EC2PlatformType): InstancePrice {
        let pricePath = null
    
        if (instance.isPreviousGeneration()) {
            pricePath = this.ec2PrevGenPriceDataPath(region, purchaseType, platform)
        } else {
            pricePath = this.ec2PriceDataPath(region, purchaseType, platform)
        }

        let prices = this.loadPriceData(pricePath);
    
        let insts = null
        if (this.isReserved()) {
            insts = this.filterReserved(prices)
        } else {
            insts = this.filterOnDemand(prices)
        }

        if (insts.length > 1) {
            throw `Found too many instances that matched ${this.instance.getInstanceType()}`
        }
        if (insts.length == 0) {
            throw `Can not find instance type ${instance.getInstanceType()} of ${EC2Platform.typeToString(platform)} in ${region}`
        }
        
        return new InstancePrice(insts[0], this.isReserved())
    }

    private loadPriceData(pricePath: string) {
        let body: string
        
        if (this.isReserved()) {
            body = ctxt().awsDataLoader.loadPath(pricePath, this.tranformReserved)
        } else {
            body = ctxt().awsDataLoader.loadPath(pricePath)
        }

        let resp = JSON.parse(body)
        return resp.prices
    }

    private isReserved(): boolean {
        return this.setting(SettingKeys.PurchaseType) === "reserved"
    }

    private setting(name: SettingKeys): string {
        return this.settings.get(name)
    }

    private purchaseTypeToUri(purchaseType: string): string {
        return purchaseType === "ondemand" ? "ondemand" : "reserved-instance"
    }

    private filterReserved(prices) {
        return prices.filter(price => {
            return price.attributes['aws:ec2:instanceType'] === this.instance.getInstanceType() &&
                price.attributes['aws:offerTermOfferingClass'] === this.setting(SettingKeys.OfferingClass) &&
                price.attributes['aws:offerTermPurchaseOption'] === this.paymentOptionAttr() &&
                price.attributes['aws:offerTermLeaseLength'] === this.purchaseTermAttr()
        })
    }

    private filterOnDemand(prices) {
        return prices.filter(price => {
            return price.attributes['aws:ec2:instanceType'] === this.instance.getInstanceType()
        })
    }

    // The full RI payload is too large to cache, so reduce to only required attributes
    private tranformReserved(data: string): string {
        let ret: any = {}

        let json = JSON.parse(data)

        ret.metadata = json.metadata
        ret.prices = []

        for (let price of json.prices) {
            let n: any = {}

            n.id = price.id
            n.price = price.price
            n.unit = price.unit

            n.attributes = Utils.slice(price.attributes,
                ["aws:ec2:instanceType", "aws:offerTermLeaseLength",
                "aws:offerTermOfferingClass", "aws:offerTermPurchaseOption"])
            n.calculatedPrice = Utils.slice(price.calculatedPrice, 
                ["effectiveHourlyRate", "upfrontRate"])

            ret.prices.push(n)
        }

        return JSON.stringify(ret)
    }

    private paymentOptionAttr(): string {
        switch(this.setting(SettingKeys.PaymentOption)) {
            case 'all_upfront': {
                return 'All Upfront'
            }
            case 'no_upfront': {
                return 'No Upfront'
            }
            case 'partial_upfront': {
                return 'Partial Upfront'
            }
        }
    }

    private purchaseTermAttr(): string {
        return Utilities.formatString('%syr', this.setting(SettingKeys.PurchaseTerm))
    }
}
