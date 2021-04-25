import { TestSuite } from "../_framework/test_suite";
import { TestRun } from "../_framework/test_run";
import { EC2_EBS_GP2_GB, EC2_EBS_MAGNETIC_GB, EC2_EBS_IO1_GB, EC2_EBS_ST1_GB, EC2_EBS_SC1_GB } from "../../src/functions/gen/ec2_ebs_gen";
import { EC2_EBS_GB, EC2_EBS_IO1_IOPS, EC2_EBS_SNAPSHOT_GB } from "../../src/functions/ebs";

export class EBSFunctionTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }

    protected run(t: TestRun): void {
        t.describe("EBS GP2", () => {
            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GP2_GB("400", "us-east-1"), 0.000001)
            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GP2_GB("400", "us-east-2"), 0.000001)
        })

        t.describe("EBS IO1 IOPs", () => {
            t.areClose(15000 * (0.065/730.0), EC2_EBS_IO1_IOPS(15000, "us-east-1"), 0.000001)
            t.areClose(20000 * (0.072/730.0), EC2_EBS_IO1_IOPS(20000, "ca-central-1"), 0.000001)
        })

        t.describe("EBS Snapshots", () => {
            t.areClose(2500 * (0.05/730.0), EC2_EBS_SNAPSHOT_GB(2500, "us-east-1"), 0.000001)
            t.areClose(5500 * (0.055/730.0), EC2_EBS_SNAPSHOT_GB(5500, "ca-central-1"), 0.000001)
        })

        t.describe("EBS storage tests", () => {
            t.areClose(550.0 * (0.05/730.0), EC2_EBS_MAGNETIC_GB(550.0, "us-east-1"), 0.000001)
            t.areClose(550.0 * (0.125/730.0), EC2_EBS_IO1_GB(550.0, "us-east-1"), 0.000001)
            t.areClose(550.0 * (0.045/730.0), EC2_EBS_ST1_GB(550.0, "us-east-1"), 0.000001)
            t.areClose(550.0 * (0.015/730.0), EC2_EBS_SC1_GB(550.0, "us-east-1"), 0.000001)
        })

        t.describe("EBS with settings range", () => {
            let s = [
                ['region', 'us-east-1']
            ]

            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GP2_GB(s, "400"), 0.000001)
            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GP2_GB(s, 400), 0.000001)
            t.areClose(400.0 * (0.11/730.0), EC2_EBS_GP2_GB(s, 400, "ca-central-1"), 0.000001)
            t.areClose(400.0 * (0.11/730.0), EC2_EBS_GP2_GB(s, 400, "CA-CENTRAL-1"), 0.000001)

            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GB(s, "gp2", 400), 0.000001)
            t.areClose(400.0 * (0.10/730.0), EC2_EBS_GB(s, "GP2", 400), 0.000001)
            t.areClose(400.0 * (0.125/730.0), EC2_EBS_GB(s, "io1", 400), 0.000001)

            t.areClose(10000 * (0.065/730.0), EC2_EBS_IO1_IOPS(s, 10000), 0.000001)
            t.areClose(10000 * (0.072/730.0), EC2_EBS_IO1_IOPS(s, 10000, "ca-central-1"), 0.000001)

            t.areClose(4000 * (0.05/730.0), EC2_EBS_SNAPSHOT_GB(s, 4000), 0.000001)
            t.areClose(4000 * (0.055/730.0), EC2_EBS_SNAPSHOT_GB(s, 4000, "ca-central-1"), 0.000001)
        })

        t.describe("EBS invalid configs", () => {
            let s = [
                ['region', 'us-east-1']
            ]

            t.willThrow(function() {
                EC2_EBS_GB(s, "gp3", 400)
            }, "invalid EBS volume type")

            t.willThrow(function() {
                EC2_EBS_GP2_GB(400, undefined)
            }, "must specify region")

            t.willThrow(function() {
                EC2_EBS_GP2_GB(undefined, "us-east-1")
            }, "must specify parameter")

            t.willThrow(function() {
                EC2_EBS_GP2_GB("foo", "us-east-1")
            }, "unable to parse volume units")

            t.willThrow(function() {
                EC2_EBS_GB(s, 400, "gp2")
            }, "invalid EBS volume type")
        })
    }
}
