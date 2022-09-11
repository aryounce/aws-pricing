import { ISettings } from "./isettings";
import { RegionsList } from "../regions_list";
import { Utils } from "../_utils";

export class Regions implements ISettings {
    // Mapping of known regions to regional name, may be a subset
    // XXX: does this mapping exist via public API?
    private static readonly nameToDisplay = {
        'us-east-1': 'US East (N. Virginia)',
        'us-east-2': 'US East (Ohio)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
        'ca-central-1': 'Canada (Central)',
        'eu-central-1': 'EU (Frankfurt)',
        'eu-west-1': 'EU (Ireland)',
        'eu-west-2': 'EU (London)',
        'eu-west-3': 'EU (Paris)',
        'eu-north-1': 'EU (Stockholm)',
        'ap-east-1': 'Asia Pacific (Hong Kong)',
        'ap-northeast-1': 'Asia Pacific (Tokyo)',
        'ap-northeast-2': 'Asia Pacific (Seoul)',
        'ap-northeast-3': 'Asia Pacific (Osaka-Local)',
        'ap-southeast-1': 'Asia Pacific (Singapore)',
        'ap-southeast-2': 'Asia Pacific (Sydney)',
        'ap-south-1': 'Asia Pacific (Mumbai)',
        'me-south-1': 'Middle East (Bahrain)',
        'sa-east-1': 'South America (São Paulo)',
        'us-gov-east-1': 'GovCloud (US-East)',
        'us-gov-west-1': 'GovCloud (US-West)'
    }

    private readonly available: Array<string>
    private readonly availableMap: {[key: string]: boolean}

    static getDisplay(name: string): string {
        return Regions.nameToDisplay[name]
    }

    constructor(regionsList: RegionsList) {
        this.available = regionsList.regions
        this.availableMap = Utils.lookupMap(this.available)
    }

    name(): string {
        return "Region"
    }

    defaultSetting(): string {
        return "us-east-1"
    }

    valid(name: string): boolean {
        return this.availableMap[name] != undefined
    }

    getAll() {
        return this.available
    }

    getAllDisplay() {
        return this.available.reduce(function(map, elem) {
            if (Regions.nameToDisplay[elem]) {
                map[elem] = Utilities.formatString("%s - %s", elem, Regions.nameToDisplay[elem])
            } else {
                map[elem] = Utilities.formatString("%s", elem)
            }
            return map
        }, {})
    }
}
