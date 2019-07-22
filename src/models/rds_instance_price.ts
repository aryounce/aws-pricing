import { PriceDuration } from "../price_converter";

export class RDSInstancePrice {
    constructor(private readonly price, private readonly isReserved: boolean) {

    }

    totalPrice(duration: PriceDuration): number {
        if (this.isReserved) {
            return parseFloat(this.price.calculatedPrice.effectiveHourlyRate.USD)
        } else {
            return parseFloat(this.price.price.USD)
        }
    }
}