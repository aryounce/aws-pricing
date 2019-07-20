import { InvocationSettings } from "./invocation_settings";
import { SettingKeys } from "./setting_keys";
import { SettingsValidator } from "./_settings_validator";

export class EC2SettingsValidator extends SettingsValidator {
    constructor(private readonly settings: InvocationSettings) {
        super()
    }

    validate(): [boolean, string] {
        let reqd = [SettingKeys.Region, SettingKeys.Platform, SettingKeys.PurchaseType]

        let [ret, msg] = this.verifyOptions(reqd)
        if (!ret) {
            return [ret, msg]
        }

        let riOpts = [SettingKeys.OfferingClass, SettingKeys.PurchaseTerm, SettingKeys.PaymentOption]
        if (this.get(SettingKeys.PurchaseType) === "reserved") {            
            [ret, msg] = this.verifyOptions(riOpts)
            if (!ret) {
                return [ret, msg]
            }
        }

        return [true, null]
    }

    protected get(key: string): string {
        return this.settings.get(key)
    }
}