import { ISettings } from "./isettings";
import { Utils } from "../_utils";

// TODO: dedup with EC2Platform
export class Platforms implements ISettings {
    private static readonly available = ['linux', 'windows', 'rhel', 'suse', 'linux_std', 'linux_web',
        'linux_enterprise', 'windows_std', 'windows_web', 'windows_enterprise']
    private static readonly availableMap = Utils.lookupMap(Platforms.available)

    name(): string {
        return "Platform"
    }

    defaultSetting(): string {
        return 'linux'
    }

    valid(name: string) {
        return Platforms.availableMap[name] != undefined
    }

    getAll() {
        return Platforms.available
    }

    getAllDisplay() {
        return Platforms.available.reduce(function(map, elem) {
            map[elem] = elem
            return map
        }, {})
    }
}