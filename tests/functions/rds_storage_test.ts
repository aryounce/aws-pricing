import { TestSuite } from "../_framework/test_suite";
import { TestRun } from "../_framework/test_run";
import { RDS_STORAGE_GB } from "../../src/functions/rds_storage";
import { RDS_STORAGE_AURORA_GB, RDS_STORAGE_PIOPS_GB, RDS_STORAGE_MAGNETIC_GB, RDS_STORAGE_GP2_GB } from "../../src/functions/gen/rds_storage_gen";

export class RDSStorageFunctionTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }
    
    protected run(t: TestRun): void {
        t.describe("volume type tests", () => {
            t.areClose(4000 * (0.11/730), RDS_STORAGE_GB("aurora", 4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.138/730), RDS_STORAGE_GB("gp2", 4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.138/730), RDS_STORAGE_GB("piops", 4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.11/730), RDS_STORAGE_GB("magnetic", 4000, "us-west-1"), 0.000001)
        })

        t.describe("alias tests", () => {
            t.areClose(4000 * (0.11/730), RDS_STORAGE_AURORA_GB(4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.138/730), RDS_STORAGE_GP2_GB(4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.138/730), RDS_STORAGE_PIOPS_GB(4000, "us-west-1"), 0.000001)
            t.areClose(4000 * (0.11/730), RDS_STORAGE_MAGNETIC_GB(4000, "us-west-1"), 0.000001)
        })

        t.describe("settings tests", () => {
            let s = [
                ['region', 'ca-central-1']
            ]

            t.areClose(4000 * (0.127/730), RDS_STORAGE_GB(s, "gp2", 4000), 0.000001)
            t.areClose(4000 * (0.138/730), RDS_STORAGE_GB(s, "gp2", 4000, "us-west-1"), 0.000001)
        })

        t.describe("invalid configs", () => {
            let s = [
                ['region', 'us-east-1']
            ]

            t.willThrow(function () {
                RDS_STORAGE_GB(s, "gp3", 400)
            }, "invalid storage type")

            t.willThrow(function () {
                RDS_STORAGE_GP2_GB(4000, undefined)
            }, "missing required option: region")

            t.willThrow(function() {
                RDS_STORAGE_GP2_GB(undefined, "us-east-1")
            }, "must specify a parameter")

            t.willThrow(function() {
                RDS_STORAGE_GP2_GB("foo", "us-east-1")
            }, "unable to parse")

            // XXX: this is a compile error but we want to verify we don't treat the number as string
            // without checking
            t.willThrow(function() {
                RDS_STORAGE_GB(s, 400, "gp2")
            }, "invalid storage type")
        })
    }
}
