import { DefaultSettings } from "./settings/default_settings";
import { RegionsList } from "./regions_list";


export class Context {
    constructor(readonly spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp,
         readonly defaultSettings: DefaultSettings,
         readonly regionsList: RegionsList) {
    }

    static Builder = class {
        private spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
        private regionsList: RegionsList

        withSpreadsheetApp(spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp): this {
            this.spreadsheetApp = spreadsheetApp
            return this
        }

        withRegionsList(regionsList: RegionsList): this {
            this.regionsList = regionsList
            return this
        }

        build(): Context {
            return new Context(this.spreadsheetApp,
                new DefaultSettings(this.regionsList),
                this.regionsList)
        }
    }
}

// Provide a single static reference to context
let _mainContext: Context = null

export function _initContext() {
    if (_mainContext != null) {
        return
    }

    Logger.log("Initializing context")

    let context = new Context.Builder()
        .withSpreadsheetApp(SpreadsheetApp)
        .withRegionsList(RegionsList.load())
        .build()
    _setContext(context)
}

export function _setContext(context: Context) {
    _mainContext = context
}

export function ctxt(): Context {
    return _mainContext
}