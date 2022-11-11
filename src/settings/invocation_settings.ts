import { Context } from "../context";
import { SettingKeys } from "./setting_keys";

interface SettingsMap {
    [key: string]: string
}

export class InvocationSettings {
    constructor(private readonly settings: SettingsMap) {
    }

    get(key: string): string {
        return this.settings[key]
    }

    static loadFromMap(map: SettingsMap): InvocationSettings {
        let settings = {}
        for (let k in map) {
            if (map[k] === undefined) {
                continue
            }

            settings[k] = this.scrubValue(map[k])
        }

        return this.load(settings);
    }

    static loadFromRange(range: Array<Array<string>>, overrides: SettingsMap): InvocationSettings {
        let settings = {}

        for (let row of range) {
            if (row.length != 2 ||
                !row[0] || row[0] === "" ||
                !row[1] || row[1] === "") {
                continue
            }

            let key = row[0]

            settings[key] = overrides[key] ? overrides[key] : row[1]
            settings[key] = this.scrubValue(settings[key])
        }

        return this.load(settings)
    }

    private static load(settings: SettingsMap): InvocationSettings {
        this.fixLegacy(settings)

        for (let k in settings) {
            if (!Context.ctxt().defaultSettings.isSetting(k)) {
                delete settings[k]
            }
        }

        return new InvocationSettings(settings)
    }

    // XXX: backwards compat for some options that changed
    private static fixLegacy(settings: {[key: string]: string}) {
        if (settings["purchase_term"] === "ondemand") {
            settings["purchase_type"] = "ondemand"
            delete settings["purchase_term"]
        }

        if (settings["operating_system"] != undefined) {
            settings["platform"] = settings["operating_system"]
            delete settings["operating_system"]
        }
    }

    private static scrubValue(value: any): string {
        return value.toString().toLowerCase()
    }
}
