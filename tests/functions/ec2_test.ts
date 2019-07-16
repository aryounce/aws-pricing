import { EC2_OD, EC2_LINUX_OD, EC2_WINDOWS_OD, EC2_RHEL_OD, EC2_SUSE_OD, EC2, EC2_LINUX_MSSQL_OD, EC2_WINDOWS_MSSQL_OD } from "../../src/functions/ec2";
import { TestSuite } from "../_framework/test_suite";
import { TestRun } from "../_framework/test_run";

export class EC2FunctionTestSuite extends TestSuite {
    name() {
        return this.constructor.name
    }

    run(t: TestRun): void {
        t.describe("EC2 on-demand", function() {
            t.areEqual(0.192, EC2_OD("m5.xlarge", "us-east-1", "linux"))
            t.areEqual(0.214, EC2_OD("m5.xlarge", "ca-central-1", "linux"))


            t.areEqual(0.192, EC2_LINUX_OD("m5.xlarge", "us-east-1"))
            t.areEqual(0.214, EC2_LINUX_OD("m5.xlarge", "ca-central-1"))

            t.areEqual(0.252, EC2_RHEL_OD("m5.xlarge", "us-east-1"))
            t.areEqual(0.292, EC2_SUSE_OD("m5.xlarge", "us-east-1"))

            t.willThrow(function() {
                EC2_OD("m5.xlarge", "us-east-1", undefined)
            }, "platform")

            t.willThrow(function() {
                EC2_LINUX_OD("mX5.xlarge", "us-east-1")
            }, "Can not find instance")
        })

        t.describe("EC2 Windows on-demand", function() {
            t.areEqual(0.376, EC2_WINDOWS_OD("m5.xlarge", "us-east-1"))
            t.areEqual(0.398, EC2_WINDOWS_OD("m5.xlarge", "ca-central-1"))
        })

        t.describe("EC2 previous generation", function() {
            t.areEqual(0.35, EC2_LINUX_OD("m1.xlarge", "us-east-1"))
            t.areEqual(6.82, EC2_LINUX_OD("i2.8xlarge", "us-east-1"))
        })

        t.describe("EC2 case sensitivity", function() {
            t.areEqual(0.192, EC2_LINUX_OD("M5.XLARGE", "US-EAST-1"))
        })

        t.describe("EC2 MSSQL", function() {
            t.areEqual(0.282, EC2_LINUX_MSSQL_OD("m5.xlarge", "ca-central-1", "web"))
            t.areEqual(0.694, EC2_LINUX_MSSQL_OD("m5.xlarge", "ca-central-1", "std"))
            t.areEqual(1.714, EC2_LINUX_MSSQL_OD("m5.xlarge", "ca-central-1", "enterprise"))
            t.areEqual(0.466, EC2_WINDOWS_MSSQL_OD("m5.xlarge", "ca-central-1", "web"))
            t.areEqual(0.282, EC2_LINUX_MSSQL_OD("m5.xlarge", "ca-central-1", "WEB"))

            t.willThrow(function() {
                EC2_LINUX_MSSQL_OD("m5.xlarge", "ca-central-1", undefined)
            }, "missing")
        })

        t.describe("EC2 with invalid settings", function() {
            t.willThrow(function() {
                EC2(undefined, undefined)
            }, "missing")

            t.willThrow(function() {
                EC2([], "m5.xlarge")
            }, "missing required")

            t.willThrow(function() {
                EC2([["region"]], "m5.xlarge")
            }, "missing required")

            t.willThrow(function() {
                EC2([["region", ""]], "m5.xlarge")
            }, "missing required")

            t.willThrow(function() {
                EC2([["region", undefined]], "m5.xlarge")
            }, "missing required")
        })

        t.describe("EC2 with valid settings", function() {
            let settings = [
                ["region", "us-east-1"],
                ["purchase_term", "ondemand"],
                ["operating_system", "linux"]
            ]

            t.areEqual(0.192, EC2(settings, "m5.xlarge"))

            // test override
            t.areEqual(0.214, EC2(settings, "m5.xlarge", "ca-central-1"))
        })

        t.describe("EC2 RI", function() {
            let settings = [
                ['region', 'us-east-1'],
                ['platform', 'linux'],
                ['purchase_type', 'reserved'],
                ['offering_class', 'standard'],
                ['purchase_term', '1'],
                ['payment_option', 'partial_upfront']
            ]

            t.areClose(0.116447, EC2(settings, "m5.xlarge"), 0.00001)
        })
    }

}
