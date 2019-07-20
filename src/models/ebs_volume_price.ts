import { PriceConverter, PriceDuration } from "../price_converter";

export class EBSVolumePrice {
    constructor(private readonly price: any, private units: number) {

    }

    totalPrice(duration: PriceDuration): number {
        let total = this.unitPrice() * this.units

        return PriceConverter.convert(total, duration, PriceDuration.Monthly)
    }

    private unitPrice(): number {
        return this.price.price.USD
    }
}