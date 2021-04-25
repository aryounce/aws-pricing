import { StorageVolumePrice } from "./_storage_volume_price";
import { PriceConverter, PriceDuration } from "../price_converter";

export class StorageVolumePriceFlat extends StorageVolumePrice {
    constructor(private readonly price: any, private units: number) {
        super()
    }

    totalPrice(duration: PriceDuration): number {
        let total = this.unitPrice() * this.units

        return PriceConverter.convert(total, duration, PriceDuration.Monthly)
    }

    private unitPrice(): number {
        return this.price.price.USD
    }
}
