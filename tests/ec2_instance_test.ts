import { TestSuite } from "./_framework/test_suite";
import { TestRun } from "./_framework/test_run";
import { EC2Instance } from "../src/models/ec2_instance";

export class EC2InstanceTestSuite extends TestSuite {
    name(): string {
        return this.constructor.name
    }

    run(t: TestRun): void {
        t.describe("EC2Instance", function() {
            let inst = null

            inst = new EC2Instance("m3.xlarge")
            t.isTrue(inst.isPreviousGeneration())
            inst = new EC2Instance("c1.large")
            t.isTrue(inst.isPreviousGeneration())

            inst = new EC2Instance("m5.xlarge")
            t.isFalse(inst.isPreviousGeneration())
            inst = new EC2Instance("i3.2xlarge")
            t.isFalse(inst.isPreviousGeneration())
        })
    }

}