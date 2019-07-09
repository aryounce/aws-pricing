import { ISettings } from "./isettings";

export class OfferingClasses implements ISettings {
    private static readonly offerings = ['standard', 'convertible']

    name(): string {
        return "RI Offering Class"
    }
    
    valid(name: string): boolean {
        return OfferingClasses.offerings.indexOf(name) != -1
    }

    defaultSetting(): string {
        return OfferingClasses.offerings[0]
    }

    getAll(): string[] {
        return OfferingClasses.offerings
    }

    getAllDisplay() {
        return OfferingClasses.offerings.reduce(function(map, elem) {
            map[elem] = elem
            return map
        }, {})
    }

}