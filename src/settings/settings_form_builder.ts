import { ctxt } from "../context";
import { ISettings } from "./isettings";
import { SettingKeys } from "./setting_keys";

interface SettingFormOption {
    key: string,
    setting: ISettings,
    toggle?: boolean
}

export class SettingsFormBuilder {
    private static readonly defaultSheetName = "AWS Pricing Settings"
    private static readonly defaultRangeName = "awsSettings"

    constructor(private readonly app: GoogleAppsScript.Spreadsheet.SpreadsheetApp) {
    }

    generate(submitCb: string) {
        let defaultSettings = ctxt().defaultSettings
        let settings: SettingFormOption[] = [
            this.newSettingOption(SettingKeys.Region),
            this.newSettingOption(SettingKeys.Platform),
            this.newSettingOption(SettingKeys.PurchaseType),
            this.newSettingOption(SettingKeys.OfferingClass, true),
            this.newSettingOption(SettingKeys.PurchaseTerm, true),
            this.newSettingOption(SettingKeys.PaymentOption, true)
        ]

        let t = HtmlService.createTemplateFromFile('files/settings_form')
        t.defaultSheetName = this.newSheetName()
        t.defaultRangeName = this.newRangeName()
        t.settings = settings
        t.submitCb = submitCb

        let src = t.evaluate().getContent()
        let html = HtmlService.createHtmlOutput()
            .setContent(src)
            .setWidth(600)
            .setHeight(450)
            .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    
        let ui = this.app.getUi()
    
        ui.showModalDialog(html, 'Generate Default Settings')
    }

    private newSheetName(): string {
        let sheet = this.app.getActive()

        for (let i = 1; i < 20; i++) {
            let name = SettingsFormBuilder.defaultSheetName;
            if (i > 1) {
                name += Utilities.formatString(" %d", i)
            }

            if (sheet.getSheetByName(name) == null) {
                return name
            }
        }

        throw "Unable to find unique sheet name for default sheet, remove existing sheets"
    }

    private newRangeName(): string {
        let sheet = this.app.getActive()

        for (let i = 1; i < 20; i++) {
            let name = SettingsFormBuilder.defaultRangeName
            if (i > 1) {
                name += Utilities.formatString("%d", i)
            }

            if (sheet.getRangeByName(name) == null) {
                return name
            }
        }

        throw "Unable to find unique name for named range, remove existing named ranges"
    }

    private newSettingOption(key: SettingKeys, toggle?: boolean): SettingFormOption {
        let opt: SettingFormOption = {
            key: key,
            setting: ctxt().defaultSettings.getSetting(key)
        }

        if (toggle) {
            opt.toggle = toggle
        }

        return opt
    }
}