import { TestSuite } from "./_framework/test_suite";
import { TestRun } from "./_framework/test_run";
import { ctxt } from "../src/context";
import { InvocationSettings } from "../src/settings/invocation_settings";

export class SettingsTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }

    protected run(t: TestRun) {
        t.describe("validate settings", function() {
            let r = ctxt().defaultSettings.getSetting('region')

            t.isTrue(ctxt().defaultSettings.getSetting('region') != undefined)
        })

        t.describe("invocation settings valid", function() {
            let s = InvocationSettings.loadFromMap({
                    'region': 'us-east-1',
                    'platform': 'linux',
                    'purchase_type': 'ondemand'
            })
            t.areEqual([true,null], s.validate())

            // support legacy OS option
            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'operating_system': 'linux',
                'purchase_type': 'ondemand'
            })
            t.areEqual([true,null], s.validate())

            // support legacy purchase term
            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_term': 'ondemand'
            })
            t.areEqual([true,null], s.validate())

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved',
                'offering_class': 'standard',
                'purchase_term': '1',
                'payment_option': 'no_upfront'
            })
            t.areEqual([true,null], s.validate())
        })

        t.describe("invocation settings invalid", function() {
            let s = InvocationSettings.loadFromMap({
                    'region': 'us-east-1',
                    'platform': 'linux'
            })
            t.areNotEqual([true,null], s.validate())

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'macos',
                'purchase_type': 'ondemand'
            })
            t.areNotEqual([true,null], s.validate())

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved'
            })
            t.areNotEqual([true,null], s.validate())

            s = InvocationSettings.loadFromMap({
                'region': 'us-east-1',
                'platform': 'linux',
                'purchase_type': 'reserved',
                'offering_class': 'standard',
                'purchase_term': '5',
                'payment_option': 'no_upfront'
            })
            t.areNotEqual([true,null], s.validate())

        })
    }

}
