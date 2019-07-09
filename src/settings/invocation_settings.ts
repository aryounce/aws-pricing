import { ctxt } from "../context";
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

    static loadFromMap(map: SettingsMap): InvocationSettings {
        let settings = {}
        for (let k in map) {
            if (map[k] === undefined) {
                continue
            }

            settings[k] = map[k].toLowerCase()
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
            settings[key] = settings[key].toLowerCase()
        }

        return this.load(settings)
    }

    private static load(settings: SettingsMap): InvocationSettings {
        this.fixLegacy(settings)

        for (let k in settings) {
            if (!ctxt().defaultSettings.isSetting(k)) {
                delete settings[k]
            }
        }

        return new InvocationSettings(settings)
    }

    private verifyOptions(options: SettingKeys[]): [boolean, string] {
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
}