import { DefaultSettings } from "./settings/default_settings";
import { RegionsList } from "./regions_list";
import { AwsDataLoader } from "./aws_data_loader";

// Provide a single static reference to context
let _mainContext: Context = null

export class Context {

    static _setContext(context: Context) {
        _mainContext = context
    }

    static _initContext(app = SpreadsheetApp) {
        if (_mainContext != null) {
            return
        }

        let awsLoader = new AwsDataLoader()
        let context = new Context.Builder()
            .withAwsDataLoader(awsLoader)
            .withSpreadsheetApp(app)
            .withRegionsList(RegionsList.load(awsLoader))
            .build()
        Context._setContext(context)
    }

    static ctxt(): Context {
        return _mainContext
    }

    constructor(readonly spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp,
         readonly defaultSettings: DefaultSettings,
         readonly regionsList: RegionsList,
         readonly awsDataLoader: AwsDataLoader) {
    }

    static Builder = class {
        private awsDataLoader: AwsDataLoader
        private spreadsheetApp: GoogleAppsScript.Spreadsheet.SpreadsheetApp
        private regionsList: RegionsList

        withAwsDataLoader(awsDataLoader: AwsDataLoader): this {
            this.awsDataLoader = awsDataLoader
            return this
        }

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
                this.regionsList, this.awsDataLoader)
        }
    }
}
