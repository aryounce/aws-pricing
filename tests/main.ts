import { TestRunner } from "./_framework/test_runnerr";
import { EC2FunctionTestSuite } from "./functions/ec2_test";
import { EC2InstanceTestSuite } from "./ec2_instance_test";
import { PriceConverterTestSuite } from "./price_converter_test";
import { SettingsTestSuite } from "./settings_tests";
import { Context, _setContext } from "../src/context";
import { RegionsList } from "../src/regions_list";

function runAllTests(): string {
    return TestRunner.runAllTests(function(t) {
        let _context = new Context.Builder()
            .withSpreadsheetApp(null)
            .withRegionsList(RegionsList.load())
            .build()
        _setContext(_context)

        t.describe("validate test runner", function() {
            t.areEqual(1, 1)
            t.areNotEqual(1, 2)

            t.areEqual([1, 2], [1, 2])
            t.areNotEqual([1, 2], [2, 3])

            t.willThrow(function() {
                throw "this is a test"
            })

            t.willThrow(function() {
                throw "this failed blahblah foo"
            }, "blahblah")
        })

        new EC2FunctionTestSuite().test(t)
        new EC2InstanceTestSuite().test(t)
        new PriceConverterTestSuite().test(t)
        new SettingsTestSuite().test(t)
    })
}