import { SettingKeys } from "./setting_keys";
import { ctxt } from "../context";

export abstract class SettingsValidator {
    abstract validate(): [boolean, string];
    protected abstract get(key:string): string;

    protected verifyOptions(options: SettingKeys[]): [boolean, string] {
        for (let opt of options) {
            let x = this.get(opt)
            if (x === undefined) {
                return [false, `Missing required option: ${opt}`]
            }

            let setting = ctxt().defaultSettings.getSetting(opt)
            if (!setting.valid(x)) {
                return [false, `Invalid setting of '${x}' for: ${opt}`]
            }
        }

        return [true, null]
    }

}