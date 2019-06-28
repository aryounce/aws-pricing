import { ISettings } from "./isettings";
import { Utils } from "../_utils";

// TODO: dedup with EC2OS
export class OperatingSystems implements ISettings {
    private static readonly available = ['linux', 'windows', 'rhel', 'suse', 'linux_std', 'linux_web',
        'linux_enterprise', 'windows_std', 'windows_web', 'windows_enterprise']
    private static readonly availableMap = Utils.lookupMap(OperatingSystems.available)

    name(): string {
        return "Operating System"
    }

    defaultSetting(): string {
        return 'linux'
    }

    valid(name: string) {
        return OperatingSystems[name] != undefined
    }

    getAll() {
        return OperatingSystems.available
    }

    getAllDisplay() {
        return OperatingSystems.available.reduce(function(map, elem) {
            map[elem] = elem
            return map
        }, {})
    }
}