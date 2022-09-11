import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";
import { StorageVolumePrice } from "./models/_storage_volume_price";
import { StorageVolumePriceFlat } from "./models/storage_volume_price_flat";
import { StorageVolumePriceTiered } from "./models/storage_volume_price_tiered";
import { Utils } from "./_utils";

export enum EBSStorageType {Storage, Iops, Snapshot, Throughput}

export class EBSPrice {
    private static volumeTypeMap = {
        'magnetic': 'Magnetic',
        'gp2': 'General Purpose',
        'gp3': 'General Purpose',
        'st1': 'Throughput Optimized HDD',
        'sc1': 'Cold HDD',
        'io1': 'Provisioned IOPS',
        'io2': 'Provisioned IOPS',
    }

    private static iopsVolumeTypesMap = {
        'io1': true,
        'io2': true,
        'gp3': true,
    }

    static readonly ebsCalcJson = "https://calculator.aws/pricing/2.0/meteredUnitMaps/ec2/USD/current/ebs-calculator.json"

    constructor(private readonly settings: any, private storageType: EBSStorageType, private volumeType: string,
        private volumeUnits: string) {

    }

    get(duration: PriceDuration): number {
        let priceData = this.loadPriceData()

        return priceData.totalPrice(duration)
    }

    private loadPriceData(): StorageVolumePrice {
        // volumeType not set for Snapshots
        if (this.storageType !== EBSStorageType.Snapshot && !EBSPrice.volumeTypeMap[this.volumeType]) {
            throw `Invalid EBS volume type '${this.volumeType}'`
        }

        if (this.storageType === EBSStorageType.Iops && !EBSPrice.iopsVolumeTypesMap[this.volumeType]) {
            throw `IOPS pricing is not supported for volume type ${this.volumeType}`
        }

        if (this.storageType === EBSStorageType.Throughput && this.volumeType !== "gp3") {
            throw `Throughput pricing is only supported for gp3 volumes`
        }

        let volumeUnitsNum = parseFloat(this.volumeUnits)
        if (!volumeUnitsNum) {
            throw `Unable to parse volume units '${this.volumeUnits}'`
        }

        if (this.storageType === EBSStorageType.Throughput) {
            return this.tieredGP3Throughput(volumeUnitsNum)
        }

        let pricePath = Utilities.formatString("/pricing/1.0/ec2/region/%s/ebs/index.json",
            this.settings.get('region'))

        let body = ctxt().awsDataLoader.loadPath(pricePath)

        let resp = JSON.parse(body)

        // io2 IOPS is tiered
        if (this.storageType === EBSStorageType.Iops && this.volumeType === "io2") {
            return this.tieredIO2IOPS(resp.prices, volumeUnitsNum)
        }

        if (this.storageType === EBSStorageType.Iops && this.volumeType === "gp3") {
            return this.tieredGP3IOPS(resp.prices, volumeUnitsNum)
        }

        let prices = null
        if (this.storageType === EBSStorageType.Storage) {
            prices = this.filterPricesVolumeUsage(resp.prices)
        } else if (this.storageType === EBSStorageType.Iops) {
            prices = this.filterPricesVolumeIops(resp.prices)
        } else {
            prices = this.filterPricesSnapshot(resp.prices)
        }

        if (prices.length == 0) {
            throw `Unable to find matching EBS price for ${this.volumeType} in ${this.settings.get('region')}`
        }

        if (prices.length > 1) {
            if (this.storageType === EBSStorageType.Snapshot) {
                throw `Too many matches for EBS Snapshot storage`
            } else {
                throw `Too many matches for EBS volume type ${this.volumeType}`
            }
        }

        return new StorageVolumePriceFlat(prices[0], volumeUnitsNum)
    }

    private tieredIO2IOPS(prices, volumeUnitsNum : number) : StorageVolumePrice {
        let price1 = this.filterPricesVolumeIopsIO2(prices, 'tier1')
        let price2 = this.filterPricesVolumeIopsIO2(prices, 'tier2')
        let price3 = this.filterPricesVolumeIopsIO2(prices, 'tier3')

        if (price1.length !== 1 || price2.length !== 1 || price3.length !== 1) {
            throw `Unable to find tiered pricing for IO2 IOPS`
        }

        let tiers : Array<number> = [0.0, 32000.0, 64000.0]
        let priceTiers : Array<any> = [price1[0], price2[0], price3[0]]

        return new StorageVolumePriceTiered(tiers, priceTiers, volumeUnitsNum)
    }

    private tieredGP3IOPS(prices, volumeUnitsNum : number) : StorageVolumePrice {
        let priceTier = prices.filter(price => {
            return Utils.endsWith(price.attributes['aws:ec2:usagetype'], 'EBS:VolumeP-IOPS.gp3')
        })

        if (priceTier.length !== 1) {
            throw `Unable to find pricing for GP3 IOPS`
        }

        let tiers : Array<number> = [0.0, 3000.0];

        // We fake the first tier since it is free
        let priceTiers : Array<any> = [{price: {USD: 0.0}}, priceTier[0]]

        return new StorageVolumePriceTiered(tiers, priceTiers, volumeUnitsNum)
    }

    private tieredGP3Throughput(volumeUnitsNum : number) : StorageVolumePrice {
        let body = ctxt().awsDataLoader.loadPath()

        let resp = JSON.parse(body)

        let priceTier = prices.filter(price => {
            return Utils.endsWith(price.attributes['aws:ec2:usagetype'], 'EBS:VolumeP-IOPS.gp3')
        })

        if (priceTier.length !== 1) {
            throw `Unable to find pricing for GP3 IOPS`
        }

        let tiers : Array<number> = [0.0, 3000.0];

        // We fake the first tier since it is free
        let priceTiers : Array<any> = [{price: {USD: 0.0}}, priceTier[0]]

        return new StorageVolumePriceTiered(tiers, priceTiers, volumeUnitsNum)
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
            return Utils.endsWith(price.attributes['aws:ec2:usagetype'], 'EBS:VolumeP-IOPS.piops')
        })
    }

    private filterPricesVolumeIopsIO2(prices, tier: string) {
        let usageType = 'EBS:VolumeP-IOPS.io2';
        if (tier === 'tier2') {
            usageType = 'EBS:VolumeP-IOPS.io2.tier2';
        } else if (tier === 'tier3') {
            usageType = 'EBS:VolumeP-IOPS.io2.tier3';
        }

        return prices.filter(price => {
            return Utils.endsWith(price.attributes['aws:ec2:usagetype'], usageType)
        })
    }

    private filterPricesSnapshot(prices) {
        return prices.filter(price => {
            // This may be prefixed with the region abbrev, there are also
            // suffixes like `UnderBilling` and `.outposts`
            return Utils.endsWith(price.attributes['aws:ec2:usagetype'], "EBS:SnapshotUsage")
        })
    }

    private usageTypeFull(): string {
        let usageStr = "EBS:VolumeUsage"

        if (this.volumeType === "magnetic") {
            return usageStr
        } else if (this.volumeType === "io1") {
            return Utilities.formatString("%s.%s", usageStr, "piops")
        } else if (this.volumeType === "io2") {
            return Utilities.formatString("%s.%s", usageStr, "io2")
        } else {
            return Utilities.formatString("%s.%s", usageStr, this.volumeType)
        }
    }

    private volumeTypeFull(): string {
        return EBSPrice.volumeTypeMap[this.volumeType]
    }
}
