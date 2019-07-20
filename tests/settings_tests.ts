import { TestSuite } from "./_framework/test_suite";
import { TestRun } from "./_framework/test_run";
import { ctxt } from "../src/context";
import { InvocationSettings } from "../src/settings/invocation_settings";
import { EC2SettingsValidator } from "../src/settings/ec2_settings_validator";
import { EBSSettingsValidator } from "../src/settings/ebs_settings_validator";

export class SettingsTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }

    protected run(t: TestRun) {
        t.describe("validate settings", function() {
            let r = ctxt().defaultSettings.getSetting('region')

            t.isTrue(ctxt().defaultSettings.getSetting('region') != undefined)
        })

        t.describe("invocation settings valid", () => {
            let s = InvocationSettings.loadFromMap({
                    'region': 'us-east-1',
                    'platform': 'linux',
                    'purchase_type': 'ondemand'
            })
            t.areEqual([true,null], this.ec2Validate(s))

            // support legacy OS option
            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'operating_system': 'linux',
                'purchase_type': 'ondemand'
            })
            t.areEqual([true,null], this.ec2Validate(s))

            // support legacy purchase term
            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_term': 'ondemand'
            })
            t.areEqual([true,null], this.ec2Validate(s))

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved',
                'offering_class': 'standard',
                'purchase_term': '1',
                'payment_option': 'no_upfront'
            })
            t.areEqual([true,null], this.ec2Validate(s))

            // Test when not all values were string
            let confArray = [
                ['region', 'us-east-1'],
                ['platform', 'linux'],
                ['purchase_type', 'ondemand'],
                ['purchase_term', 1]
            ]
            s = InvocationSettings.loadFromRange( <Array<Array<string>>> confArray, {})
            t.areEqual([true,null], this.ec2Validate(s))
        })

        t.describe("invocation settings invalid", () => {
            let s = InvocationSettings.loadFromMap({
                    'region': 'us-east-1',
                    'platform': 'linux'
            })
            t.areNotEqual([true,null], this.ec2Validate(s))

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'macos',
                'purchase_type': 'ondemand'
            })
            t.areNotEqual([true,null], this.ec2Validate(s))

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved'
            })
            t.areNotEqual([true,null], this.ec2Validate(s))

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved',
                'offering_class': 'standard',
                'purchase_term': '5',
                'payment_option': 'no_upfront'
            })
            t.areNotEqual([true,null], this.ec2Validate(s))
        })

        t.describe("ebs validation", () => {
            let s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'ondemand'
            })
            t.areEqual([true, null], this.ebsValidate(s))

            s = InvocationSettings.loadFromMap({
                'platform': 'linux',
                'purchase_type': 'ondemand'
            })
            t.areNotEqual([true, null], this.ebsValidate(s))
        })
    }

    private ec2Validate(s: InvocationSettings): [boolean, string] {
        return new EC2SettingsValidator(s).validate()
    }

    private ebsValidate(s: InvocationSettings): [boolean, string] {
        return new EBSSettingsValidator(s).validate()
    }

}
