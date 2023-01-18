import { SettingsFormBuilder } from "./settings/settings_form_builder";
import { Context } from "./context";
import { SettingsFormProcessor } from "./settings/settings_form_processor";
import { SettingsSheetGenerator } from "./settings/settings_sheet_generator";

function onOpen(e) {
    let ui = SpreadsheetApp.getUi()
    let menu = ui.createAddonMenu()
    menu.addItem("New settings sheet", '_newDefaultsSheet')
    menu.addItem('Show manual', '_showManualDialog')
    menu.addToUi()
}

function onInstall(e) {
    onOpen(e);
  }

function _showManualDialog() {
    Context._initContext()

    let ui = SpreadsheetApp.getUi()
    let html = HtmlService.createHtmlOutputFromFile('help_dialog')
    html.setTitle('AWS Pricing Help')
    ui.showSidebar(html)
}

function _newDefaultsSheet() {
    Context._initContext()

    let builder = new SettingsFormBuilder(SpreadsheetApp)

    builder.generate("_processFormSubmit")
}

function _processFormSubmit(values) {
    Context._initContext()

    let sheetGenerator = new SettingsSheetGenerator(Context.ctxt().spreadsheetApp.getActive(),
        Context.ctxt().defaultSettings)
    let processor = new SettingsFormProcessor(sheetGenerator)

    processor.process(values)
}
