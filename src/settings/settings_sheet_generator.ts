import { DefaultSettings } from "./default_settings";
import { SettingKeys } from "./setting_keys";

interface FormSelections {
    region: string,
    platform: string,
    purchaseType: string,
    offeringClass: string,
    purchaseTerm: string,
    paymentOption: string
}

export class SettingsSheetGenerator {
    constructor(private readonly app: GoogleAppsScript.Spreadsheet.Spreadsheet,
        private readonly defaultSettings: DefaultSettings) {
    }

    generate(sheetName: string, rangeName: string, selections: FormSelections) {
        if (this.app.getSheetByName(sheetName) != null) {
            throw `A sheet by the name '${sheetName}' already exists.`
        }

        if (this.app.getRangeByName(rangeName) != null) {
            throw `A range by the name '${rangeName}' already exists.`
        }

        let num = this.app.getNumSheets()
        let sheet = this.app.insertSheet(sheetName, num)
    
        let range = sheet.getRange(1, 1, 1, 2)
        range.setValue([["AWS Pricing Defaults"]])
        range.merge()
        range.setFontSize(14).setFontWeight('bold').setFontLine('underline')
        range.setNote("Modify these settings to adjust price functions.")
    
        let settings = [
            SettingKeys.Region,
            SettingKeys.Platform,
            SettingKeys.PurchaseType,
            SettingKeys.OfferingClass,
            SettingKeys.PurchaseTerm,
            SettingKeys.PaymentOption
        ]

        range = sheet.getRange(2, 1, settings.length)
        let nameValues = settings.reduce(function(ar, elem) {
            ar.push([elem])
            return ar
        }, [])

        range.setValues(nameValues)
     
        let validators = settings.reduce((ar, elem) => {
            ar.push([this.buildDataValidation(elem)])
            return ar
        }, [])
    
        range = sheet.getRange(2, 2, validators.length)
        range.setDataValidations(validators)
    
        nameValues = [
            [selections.region],
            [selections.platform],
            [selections.purchaseType],
            [selections.offeringClass],
            [selections.purchaseTerm],
            [selections.paymentOption]
        ]
        range.setValues(nameValues)
    
        range = sheet.getRange(2, 1, nameValues.length, 2)
        range.setFontSize(14).setFontFamily('Courier New')
        
        sheet.setColumnWidth(1, 200)
        sheet.setColumnWidth(2, 400)
    
        this.app.setNamedRange(rangeName, range)
    }

    private buildDataValidation(name: string) {
        let values = this.defaultSettings.getSetting(name).getAll()

        return SpreadsheetApp.newDataValidation()
            .requireValueInList(values)
            .setAllowInvalid(false)
            .setHelpText(`Pick a ${name}`)
            .build()
    }
    
}