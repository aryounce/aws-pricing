import { EC2PlatformType, EC2Platform } from "./models/ec2_platform";
import { InstancePrice } from "./models/instance_price";
import { EC2Instance } from "./models/ec2_instance";
import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";
import { SettingKeys } from "./settings/setting_keys";

export class EC2Price {
    private readonly instance: EC2Instance

    constructor(private readonly settings: any, instType: string) {
        this.instance = new EC2Instance(instType)
    }

    get(duration: PriceDuration): number {
        if (this.setting(SettingKeys.PurchaseType) !== "ondemand") {
            throw "Only supports `ondemand` currently."
        }

        let instPrice = this.ec2GetPrice(this.instance, this.setting(SettingKeys.Region),
            this.setting(SettingKeys.PurchaseType), this.platformType())

        return instPrice.unitPrice()
    }

    private platformType(): EC2PlatformType {
        let platform = this.setting(SettingKeys.Platform)

        let osType = EC2Platform.nameToType(platform)
        if (osType == null) {
            throw `Unknown EC2 platform: ${platform}`
        }

        return osType
    }

    private ec2PrevGenPriceDataPath(region: string, purchaseType: string, platform: EC2PlatformType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/previous-generation/%s/%s/index.json',
            region, purchaseType, EC2Platform.typeToUriPath(platform))
    }

    private ec2PriceDataPath(region: string, purchaseType: string, platform: EC2PlatformType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/%s/%s/index.json',
            region, purchaseType, EC2Platform.typeToUriPath(platform))
    }

    private ec2GetPrice(instance: EC2Instance, region: string, purchaseType: string, platform: EC2PlatformType): InstancePrice {
        let pricePath = null
    
        if (instance.isPreviousGeneration()) {
            pricePath = this.ec2PrevGenPriceDataPath(region, purchaseType, platform)
        } else {
            pricePath = this.ec2PriceDataPath(region, purchaseType, platform)
        }

        let prices = this.loadPriceData(pricePath);
    
        let insts = prices.filter(price => price.attributes['aws:ec2:instanceType'] == instance.getInstanceType());
    
        if (insts.length > 1) {
            Logger.log(`found more than one matching instance: ${insts}`)
            throw "too many matches"
        }
        if (insts.length == 0) {
            throw `Can not find instance type ${instance.getInstanceType()} of ${EC2OperatingSystem.typeToString(os)} in ${region}`
        }
        
        return new InstancePrice(insts[0])
    }

    private loadPriceData(pricePath: string) {
        let body = ctxt().awsDataLoader.loadPath(pricePath)

        let resp = JSON.parse(body)
        return resp.prices
    }

    private setting(name: SettingKeys): string {
        return this.settings.get(name)
    }
}
