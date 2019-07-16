import { SettingsSheetGenerator } from "./settings_sheet_generator";

interface FormValues {
    sheet_name: string,
    range_name: string,
    region: string,
    platform: string,
    purchase_type: string,
    offering_class: string,
    purchase_term: string,
    payment_option: string
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
            platform: values.platform,
            purchaseType: values.purchase_type,
            offeringClass: values.offering_class,
            purchaseTerm: values.purchase_term,
            paymentOption: values.payment_option
        }

        this.sheetGenerator.generate(values.sheet_name, values.range_name, selections)
    }
}