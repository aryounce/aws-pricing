import { InvocationSettings } from "./settings/invocation_settings";
import { RDSDbEngine } from "./models/rds_db_engine";
import { PriceDuration } from "./price_converter";
import { ctxt } from "./context";
import { RDSInstancePrice } from "./models/rds_instance_price";
import { Utils } from "./_utils";

export class RDSPrice {
    constructor(private readonly settings: InvocationSettings, private readonly dbEngine: RDSDbEngine,
        private readonly instanceType: string) {

    }

    get(duration: PriceDuration): number {
        let priceData = this.loadPriceData()

        return priceData.totalPrice(duration)
    }

    private loadPriceData() {
        if (this.isReserved() && this.settings.get("purchase_term") === "3" &&
            this.settings.get("payment_option") === "no_upfront") {
            throw `The No-Upfront payment option is not supported for 3 year RDS RIs`
        }

        let pricePath = Utilities.formatString("/pricing/1.0/rds/%s/%s/%sindex.json",
            this.dbEngineUrlParam(), this.purchaseTypeUrlParam(), this.azUrlParam())

        let body = ctxt().awsDataLoader.loadPath(pricePath, this.transformPayload)

        let resp = JSON.parse(body)

        let prices = this.filterPrices(resp.prices)

        if (prices.length == 0) {
            throw `Unable to find RDS instance ${this.instanceType} for DB engine ${this.dbEngineStr()}`
        }

        if (prices.length > 1) {
            throw `Too many matches found for ${this.instanceType} for DB engine ${this.dbEngineStr()}`
        }

        return new RDSInstancePrice(prices[0], this.isReserved())
    }

    private filterPrices(prices) {
        return prices.filter(price => {
            let ret = price.attributes['aws:region'] == this.settings.get('region') &&
                price.attributes['aws:rds:term'] === this.purchaseTypeAttr() &&
                price.attributes['aws:rds:instanceType'] === this.instanceType
            if (!ret || !this.isReserved()) {
                return ret
            }

            return price.attributes['aws:offerTermLeaseLength'] === this.purchaseTermAttr() &&
                price.attributes['aws:offerTermPurchaseOption'] === this.paymentOptionAttr()
        })
    }

    // The full RI payload is too large to cache, so filter and reduce to only required attributes
    // XXX: these payloads when gzip'd are very close to max size, will need to adjust
    // if more instance types are added
    private transformPayload(data: string): string {
        let ret: any = {}

        let json = JSON.parse(data)

        ret.metadata = json.metadata
        ret.prices = []

        for (let price of json.prices) {
            // Ensure to filter out any products we won't look at
            if (price.attributes['aws:productFamily'] !== 'Database Instance') {
                continue
            }

            if (price.attributes['aws:offerTermOfferingClass'] &&
                price.attributes['aws:offerTermOfferingClass'] !== 'standard') {
                continue
            }

            let n: any = {}

            n.price = price.price
            n.unit = price.unit

            n.attributes = Utils.slice(price.attributes,
                ['aws:region', 'aws:rds:term', 'aws:rds:instanceType',
                 'aws:offerTermLeaseLength', 'aws:offerTermPurchaseOption'])

            if (price.calculatedPrice) {
                n.calculatedPrice = Utils.slice(price.calculatedPrice,
                    ["effectiveHourlyRate", "upfrontRate"])
            }
            ret.prices.push(n)
        }

        return JSON.stringify(ret)
    }


    private isReserved(): boolean {
        return this.settings.get('purchase_type') === 'reserved'
    }

    private dbEngineUrlParam(): string {
        switch (this.dbEngine) {
            case RDSDbEngine.Aurora_Mysql: {
                return "aurora/mysql"
            }
            case RDSDbEngine.Aurora_Postgresql: {
                return "aurora/postgresql"
            }
            case RDSDbEngine.Mysql: {
                return "mysql"
            }
            case RDSDbEngine.Mariadb: {
                return "mariadb"
            }
            case RDSDbEngine.Postgresql: {
                return "postgresql"
            }
        }
    }

    private azUrlParam(): string {
        if (this.isAurora()) {
            return ""
        } else {
            return "single-az/"
        }
    }

    private isAurora(): boolean {
        return this.dbEngine === RDSDbEngine.Aurora_Mysql || this.dbEngine === RDSDbEngine.Aurora_Postgresql
    }

    private purchaseTypeUrlParam(): string {
        return this.isReserved() ? "reserved-instance" : "ondemand"
    }

    private purchaseTypeAttr(): string {
        return this.isReserved() ? "reserved" : "on-demand"
    }

    private purchaseTermAttr(): string {
        return Utilities.formatString("%syr", this.settings.get('purchase_term'))
    }

    private paymentOptionAttr(): string {
        switch(this.settings.get('payment_option')) {
            case 'no_upfront': {
                return 'No Upfront'
            }
            case 'partial_upfront': {
                return 'Partial Upfront'
            }
            case 'all_upfront': {
                return 'All Upfront'
            }
            default: {
                throw `Unknown payment option ${this.settings.get('payment_option')}`
            }
        }
    }

    private dbEngineStr(): string {
        return RDSDbEngine[this.dbEngine]
    }
}