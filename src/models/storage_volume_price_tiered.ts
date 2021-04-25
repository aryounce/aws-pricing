import { StorageVolumePrice } from "./_storage_volume_price";
import { PriceConverter, PriceDuration } from "../price_converter";

export class StorageVolumePriceTiered extends StorageVolumePrice {
    constructor(private tiers: Array<number>, private readonly prices: Array<any>, private units: number) {
        super()
    }

    totalPrice(duration: PriceDuration): number {
        let total : number = 0.0
        for (var i = this.tiers.length - 1; i >= 0; i--) {
          if (this.units > this.tiers[i]) {
            total += this.unitPrice(this.prices[i]) * (this.units - this.tiers[i])
            this.units -= (this.units - this.tiers[i])
          }
        }

        return PriceConverter.convert(total, duration, PriceDuration.Monthly)
    }

    private unitPrice(price: any): number {
        return price.price.USD
    }
}
