import { TestSuite } from "./_framework/test_suite";
import { TestRun } from "./_framework/test_run";
import { DefaultSettings } from "../src/settings/default_settings";
import { Regions } from "../src/settings/regions";
import { ctxt } from "../src/context";

export class SettingsTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }

    protected run(t: TestRun) {
        t.describe("validate settings", function() {
            let r = ctxt().defaultSettings.getSetting('region')

            t.isTrue(ctxt().defaultSettings.getSetting('region') != undefined)
        })
    }

}
