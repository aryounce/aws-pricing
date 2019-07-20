import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";
import { EBSVolumePrice } from "./models/ebs_volume_price";
import { Utils } from "./_utils";

export enum EBSStorageType {Storage, Iops}

export class EBSPrice {
    private static storageTypes = ['storage', 'iops']

    private static volumeTypeMap = {
        'magnetic': 'Magnetic',
        'gp2': 'General Purpose',
        'st1': 'Throughput Optimized HDD',
        'sc1': 'Cold HDD',
        'io1': 'Provisioned IOPS',
    }

    constructor(private readonly settings: any, private storageType: EBSStorageType, private volumeType: string,
        private volumeUnits: string) {

    }

    get(duration: PriceDuration): number {
        let priceData = this.loadPriceData()

        return priceData.totalPrice(duration)
    }

    private loadPriceData(): EBSVolumePrice {
        if (!EBSPrice.volumeTypeMap[this.volumeType]) {
            throw `Invalid EBS volume type '${this.volumeType}'`
        }

        if (this.storageType === EBSStorageType.Iops && this.volumeType !== "io1") {
            throw `IOPS pricing is only valid for io1 volumes`
        }

        let pricePath = Utilities.formatString("/pricing/1.0/ec2/region/%s/ebs/index.json",
            this.settings.get('region'))

        let body = ctxt().awsDataLoader.loadPath(pricePath)

        let resp = JSON.parse(body)

        let prices = null
        
        if (this.storageType == EBSStorageType.Storage) {
            prices = this.filterPricesVolumeUsage(resp.prices)
        } else {
            prices = this.filterPricesVolumeIops(resp.prices)
        }

        if (prices.length == 0) {
            throw `Unable to find matching EBS price for ${this.volumeType} in ${this.settings.get('region')}`
        }

        if (prices.length > 1) {
            throw `Too many matches for EBS volume type ${this.volumeType}`
        }

        let volumeUnitsNum = parseFloat(this.volumeUnits)
        if (!volumeUnitsNum) {
            throw `Unable to parse volume units '${this.volumeUnits}'`
        }

        return new EBSVolumePrice(prices[0], parseFloat(this.volumeUnits))
    }

    private filterPricesVolumeUsage(prices) {
        return prices.filter(price => {
            return price.attributes['aws:ec2:volumeType'] === this.volumeTypeFull() &&

                // The usagetype is prefixed with a region abbrev. outside of UE1
                Utils.includes(price.attributes['aws:ec2:usagetype'], this.usageTypeFull())
        })
    }

    private filterPricesVolumeIops(prices) {
        return prices.filter(price => {
            return Utils.includes(price.attributes['aws:ec2:usagetype'], 'EBS:VolumeP-IOPS.piops')
        })
    }

    private usageTypeFull(): string {
        let usageStr = "EBS:VolumeUsage"

        if (this.volumeType === "magnetic") {
            return usageStr
        } else if (this.volumeType === "io1") {
            return Utilities.formatString("%s.%s", usageStr, "piops")
        } else {
            return Utilities.formatString("%s.%s", usageStr, this.volumeType)
        }
    }

    private volumeTypeFull(): string {
        return EBSPrice.volumeTypeMap[this.volumeType]
    }
}