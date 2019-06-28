import { DefaultSettings } from "./default_settings";

interface FormSelections {
    region: string,
    purchaseTerm: string,
    operatingSystem: string
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
    
        range = sheet.getRange(2, 1, 3)
        let nameValues = [['region'], ['purchase_term'], ['operating_system']]
        range.setValues(nameValues)
     
        range = sheet.getRange(2, 2, 3)
        let validators = []
    
        validators.push([this.buildDataValidation("region")])
        validators.push([this.buildDataValidation("purchase_term")])
        validators.push([this.buildDataValidation("operating_system")])
    
        range.setDataValidations(validators)
    
        nameValues = [[selections.region], [selections.purchaseTerm], [selections.operatingSystem]]
        range.setValues(nameValues)
    
        range = sheet.getRange(2, 1, 3, 2)
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