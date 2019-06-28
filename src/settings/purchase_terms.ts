import { ISettings } from "./isettings";

export class PurchaseTerms implements ISettings {
    name(): string {
        return "Purchase Term"
    }

    defaultSetting(): string {
        return "ondemand"
    }

    valid(name: string) {
        return name === "ondemand"
    }
    
    getAll() {
        return ['ondemand']
    }
    
    getAllDisplay() {
        return {'ondemand': 'ondemand'}
    }
}