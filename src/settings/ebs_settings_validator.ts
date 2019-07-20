import { SettingsValidator } from "./_settings_validator";
import { InvocationSettings } from "./invocation_settings";
import { SettingKeys } from "./setting_keys";

export class EBSSettingsValidator extends SettingsValidator {
    constructor(private readonly settings: InvocationSettings) {
        super()
    }
    
    validate(): [boolean, string] {
        let [ret, msg] = this.verifyOptions([SettingKeys.Region])
        if (!ret) {
            return [ret, msg]
        }

        return [true, null]
    }
    
    protected get(key: string): string {
        return this.settings.get(key)
    }

    
}