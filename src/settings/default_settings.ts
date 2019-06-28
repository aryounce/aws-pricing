import { Regions } from "./regions";
import { OperatingSystems } from "./operating_systems";
import { PurchaseTerms } from "./purchase_terms";
import { RegionsList } from "../regions_list";
import { ISettings } from "./isettings";

export class DefaultSettings {
    private readonly settings = {} 

    constructor(regionsList: RegionsList) {
        this.setSetting('region', new Regions(regionsList))
        this.setSetting('operating_system', new OperatingSystems())
        this.setSetting('purchase_term', new PurchaseTerms())
    }

    isSetting(key: string): boolean {
        return this.settings[key] != undefined
    }

    getSetting(name: string): ISettings {
        return this.settings[name]
    }

    getSettingKeys(): Array<string> {
        return Object.keys(this.settings)
    }

    getSettings() {
        return this.settings
    }

    private setSetting(name: string, setting: ISettings) {
        this.settings[name] = setting
    }
}