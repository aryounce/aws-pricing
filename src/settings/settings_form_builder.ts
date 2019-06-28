import { ctxt } from "../context";

export class SettingsFormBuilder {
    private static readonly defaultSheetName = "AWS Pricing Settings"
    private static readonly defaultRangeName = "awsSettings"

    constructor(private readonly app: GoogleAppsScript.Spreadsheet.SpreadsheetApp) {
    }

    generate(submitCb: string) {
        let defaultSettings = ctxt().defaultSettings
        let settings = [
            ['region', defaultSettings.getSetting('region')],
            ['purchase_term', defaultSettings.getSetting('purchase_term')],
            ['operating_system', defaultSettings.getSetting('operating_system')]
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
}