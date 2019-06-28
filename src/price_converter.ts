export enum PriceDuration { Hourly, Daily, Monthly, Yearly }

export class PriceConverter {
    // Must match enum above
    static readonly hoursPerDuration = [1.0, 24.0, 730.0, 8760.0]

    static readonly hoursInDay = 24.0
    static readonly hoursInMonth = 730.0
    static readonly hoursInYear = 8760.0

    static convert(cost: number, destDuration: PriceDuration, srcDuration: PriceDuration) {
        let srcHours = PriceConverter.hoursPerDuration[srcDuration]
        let destHours = PriceConverter.hoursPerDuration[destDuration]

        return cost * destHours / srcHours
    }
}