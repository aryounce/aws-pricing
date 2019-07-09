import { ISettings } from "./isettings";

export class PurchaseTerms implements ISettings {
    private static readonly terms = ["1", "3"]

    name(): string {
        return "RI Purchase Term"
    }
    
    valid(name: string): boolean {
        return PurchaseTerms.terms.indexOf(name) != -1
    }

    defaultSetting(): string {
        return PurchaseTerms.terms[0]
    }

    getAll(): string[] {
        return PurchaseTerms.terms
    }

    getAllDisplay() {
        return PurchaseTerms.terms.reduce(function(map, elem) {
            map[elem] = Utilities.formatString("%s year(s)", elem)
            return map
        }, {})
    }
}