import { ISettings } from "./isettings";

export class PaymentOptions implements ISettings {
    private static readonly optionsMap = {
        'no_upfront': 'No Upfront',
        'partial_upfront': 'Partial Upfront',
        'all_upfront': 'All Upfront'
    }
    private static readonly options = Object.keys(PaymentOptions.optionsMap)

    name(): string {
        return "RI Payment Option"
    }
    
    valid(name: string): boolean {
        return PaymentOptions.optionsMap[name] != undefined
    }

    defaultSetting(): string {
        return 'no_upfront'
    }

    getAll(): string[] {
        return PaymentOptions.options
    }

    getAllDisplay() {
        return PaymentOptions.optionsMap
    }

    
}