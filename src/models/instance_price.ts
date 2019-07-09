export class InstancePrice {
    constructor(private readonly price: any) {
    }

    unitPrice(): number {
        let unit = parseFloat(this.price.price.USD);

        // TODO: manage conversion to different durations
        return unit
    }
}