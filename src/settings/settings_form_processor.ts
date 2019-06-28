import { SettingsSheetGenerator } from "./settings_sheet_generator";

interface FormValues {
    sheet_name: string,
    range_name: string,
    region: string,
    purchase_term: string,
    operating_system: string
}

export class SettingsFormProcessor {
    constructor(private readonly sheetGenerator: SettingsSheetGenerator) {
    }

    process(values: FormValues) {
        if (!values.sheet_name || !values.range_name) {
            throw "Must specify sheet and range names"
        }

        let selections = {
            region: values.region,
            purchaseTerm: values.purchase_term,
            operatingSystem: values.operating_system
        }

        this.sheetGenerator.generate(values.sheet_name, values.range_name, selections)
    }
}