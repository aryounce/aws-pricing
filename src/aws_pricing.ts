import { SettingsFormBuilder } from "./settings/settings_form_builder";
import { _initContext, ctxt } from "./context";
import { SettingsFormProcessor } from "./settings/settings_form_processor";
import { SettingsSheetGenerator } from "./settings/settings_sheet_generator";

function onOpen(e) {
    let ui = SpreadsheetApp.getUi()
    let menu = ui.createAddonMenu()
    menu.addItem("New settings sheet", '_newDefaultsSheet')
    menu.addSeparator()
    menu.addItem('Show help', '_showHelpDialog')
    menu.addToUi()

    Logger.log("Started aws-pricing")
}

function onInstall(e) {
    onOpen(e);
  }

function _showHelpDialog() {
    _initContext()

    let ui = SpreadsheetApp.getUi()
    let html = HtmlService.createHtmlOutputFromFile('help_dialog')
    html.setTitle('AWS Pricing Help')
    ui.showSidebar(html)
}

function _newDefaultsSheet() {
    _initContext()

    let builder = new SettingsFormBuilder(SpreadsheetApp)

    builder.generate("_processFormSubmit")
}

function _processFormSubmit(values) {
    _initContext()

    let sheetGenerator = new SettingsSheetGenerator(ctxt().spreadsheetApp.getActive(),
        ctxt().defaultSettings)
    let processor = new SettingsFormProcessor(sheetGenerator)

    processor.process(values)
}