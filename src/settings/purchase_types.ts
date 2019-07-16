import { ISettings } from "./isettings";

export class PurchaseTypes implements ISettings {
    private static readonly types = ['ondemand', 'reserved']

    name(): string {
        return "Purchase Type"
    }

    defaultSetting(): string {
        return PurchaseTypes.types[0]
    }

    valid(name: string) {
        return PurchaseTypes.types.indexOf(name) != -1
    }
    
    getAll() {
        return PurchaseTypes.types
    }
    
    getAllDisplay() {
        return PurchaseTypes.types.reduce(function(map, elem) {
            map[elem] = elem
            return map
        }, {})
    }
}