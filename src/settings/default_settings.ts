import { Regions } from "./regions";
import { Platforms } from "./platforms";
import { PurchaseTypes } from "./purchase_types";
import { RegionsList } from "../regions_list";
import { ISettings } from "./isettings";
import { OfferingClasses } from "./offering_classes";
import { PurchaseTerms } from "./purchase_terms";
import { PaymentOptions } from "./payment_options";
import { SettingKeys } from "./setting_keys";

export class DefaultSettings {
    private readonly settings = {} 

    constructor(regionsList: RegionsList) {
        this.setSetting(SettingKeys.Region, new Regions(regionsList))
        this.setSetting(SettingKeys.Platform, new Platforms())
        this.setSetting(SettingKeys.PurchaseType, new PurchaseTypes())
        this.setSetting(SettingKeys.OfferingClass, new OfferingClasses())
        this.setSetting(SettingKeys.PurchaseTerm, new PurchaseTerms())
        this.setSetting(SettingKeys.PaymentOption, new PaymentOptions())
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