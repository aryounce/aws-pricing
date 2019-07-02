import { OSType, EC2OperatingSystem } from "./models/ec2_operating_systems";
import { InstancePrice } from "./models/instance_price";
import { EC2Instance } from "./models/ec2_instance";
import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";

export class EC2Price {
    private readonly instance: EC2Instance

    constructor(private readonly settings: any, instType: string) {
        this.instance = new EC2Instance(instType)
    }

    get(duration: PriceDuration): number {
        let instPrice = this.ec2GetPrice(this.instance, this.settings.get('region'),
            this.settings.get('purchase_term'), this.osType())

        return instPrice.unitPrice()
    }

    private osType(): OSType {
        let operating_system = this.settings.get('operating_system')

        let osType = EC2OperatingSystem.nameToType(operating_system)
        if (osType == null) {
            throw `Unknown operating system: ${operating_system}`
        }

        return osType
    }

    private ec2PrevGenPriceDataPath(region: string, term: string, os: OSType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/previous-generation/%s/%s/index.json',
            region, term, EC2OperatingSystem.typeToUriPath(os))
    }

    private ec2PriceDataPath(region: string, term: string, os: OSType): string {
        return Utilities.formatString('/pricing/1.0/ec2/region/%s/%s/%s/index.json',
            region, term, EC2OperatingSystem.typeToUriPath(os))
    }

    private ec2GetPrice(instance: EC2Instance, region: string, term: string, os: OSType): InstancePrice {
        let pricePath = null
    
        if (instance.isPreviousGeneration()) {
            pricePath = this.ec2PrevGenPriceDataPath(region, term, os)
        } else {
            pricePath = this.ec2PriceDataPath(region, term, os)
        }

        let prices = this.loadPriceData(pricePath);
    
        let insts = prices.filter(price => price.attributes['aws:ec2:instanceType'] == instance.getInstanceType());
    
        if (insts.length > 1) {
            Logger.log(`found more than one matching instance: ${insts}`)
            throw "too many matches"
        }
        if (insts.length == 0) {
            throw `Can not find instance type ${instance.getInstanceType()}`
        }
        
        return new InstancePrice(insts[0])
    }

    private loadPriceData(pricePath: string) {
        let body = ctxt().awsDataLoader.loadPath(pricePath)

        let resp = JSON.parse(body)
        return resp.prices
    }
}
