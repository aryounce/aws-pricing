import { TestSuite } from "./_framework/test_suitee";
import { TestRun } from "./_framework/test_runn";
import { PriceConverter, PriceDuration } from "../src/price_converter";

export class PriceConverterTestSuite extends TestSuite {
    name() {
        return this.constructor.name
    }

    run(t: TestRun): void {
        t.describe("price converter tests", function() {
            t.areEqual(48.0, PriceConverter.convert(2.0, PriceDuration.Daily, PriceDuration.Hourly))
            t.areEqual(730.0 * 2, PriceConverter.convert(2.0, PriceDuration.Monthly, PriceDuration.Hourly))
            t.areEqual(8760.0 * 2, PriceConverter.convert(2.0, PriceDuration.Yearly, PriceDuration.Hourly))

            t.areEqual(34.5, PriceConverter.convert(34.5, PriceDuration.Hourly, PriceDuration.Hourly))
            t.areEqual(34.5, PriceConverter.convert(34.5, PriceDuration.Daily, PriceDuration.Daily))
            t.areEqual(34.5, PriceConverter.convert(34.5, PriceDuration.Monthly, PriceDuration.Monthly))
            t.areEqual(34.5, PriceConverter.convert(34.5, PriceDuration.Yearly, PriceDuration.Yearly))
        })
    }
}
