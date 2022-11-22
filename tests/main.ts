import { TestRunner } from "./_framework/test_runner";
import { EC2FunctionTestSuite } from "./functions/ec2_test";
import { EC2InstanceTestSuite } from "./ec2_instance_test";
import { PriceConverterTestSuite } from "./price_converter_test";
import { SettingsTestSuite } from "./settings_tests";
import { Context } from "../src/context";
import { CacheLoaderTestSuite } from "./cache_loader_test";
import { EBSFunctionTestSuite } from "./functions/ebs_test";
import { RDSFunctionTestSuite } from "./functions/rds_test";
import { RDSStorageFunctionTestSuite } from "./functions/rds_storage_test";

function runAllTests(): string {
    return TestRunner.runAllTests(function(t) {
        Context._initContext(null)

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
        new EBSFunctionTestSuite().test(t)
        new RDSFunctionTestSuite().test(t)
        new RDSStorageFunctionTestSuite().test(t)
        new PriceConverterTestSuite().test(t)
        new SettingsTestSuite().test(t)
        new CacheLoaderTestSuite().test(t)
    })
}
