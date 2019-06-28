import { ctxt } from "../context";

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
            if (!ctxt().defaultSettings.isSetting(k)) {
                continue
            }

            settings[k] = map[k].toLowerCase()
        }

        return new InvocationSettings(settings)
    }

    static loadFromRange(range: Array<Array<string>>, overrides: SettingsMap): InvocationSettings {
        let settings = {}

        for (let row of range) {
            if (row.length != 2 ||
                !row[0] || row[0] === "" ||
                !row[1] || row[1] === "") {
                continue
            }

            if (!ctxt().defaultSettings.isSetting(row[0])) {
                continue
            }

            let key = row[0]

            settings[key] = overrides[key] ? overrides[key] : row[1]
            settings[key] = settings[key].toLowerCase()
        }

        return new InvocationSettings(settings)
    }
}