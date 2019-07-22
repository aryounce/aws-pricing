import { RDSDbEngine } from "../models/rds_db_engine";
import { InvocationSettings } from "../settings/invocation_settings";
import { RDSPrice } from "../rds_price";
import { PriceDuration } from "../price_converter";
import { _initContext } from "../context";
import { RDSSettingsValidator } from "../settings/rds_settings_validator";

function _rds(settings: InvocationSettings, dbEngine: RDSDbEngine, instanceType: string): number {
    if (dbEngine === undefined || dbEngine === null) {
        throw `Must specify DB engine`
    }

    if (!instanceType) {
        throw `Must specify a DB instance type`
    }

    let [ret, msg] = new RDSSettingsValidator(settings).validate()
    if (!ret) {
        throw msg
    }

    instanceType = instanceType.toString().toLowerCase()

    return new RDSPrice(settings, dbEngine, instanceType).get(PriceDuration.Hourly)
}

export function _rds_full(dbEngine: RDSDbEngine, instanceType: string, region: string,
    purchaseType: string, purchaseTerm?: string | number, paymentOption?: string) {
    _initContext()

    let settingsMap = {
        'region': region,
        'purchase_type': purchaseType
    }

    if (purchaseType === "reserved") {
        settingsMap['purchase_term'] = purchaseTerm
        settingsMap['payment_option'] = paymentOption
    }

    let settings = InvocationSettings.loadFromMap(settingsMap)

    return _rds(settings, dbEngine, instanceType)
}

export function _rds_settings(settingsRange: Array<Array<string>>, dbEngine: RDSDbEngine, instanceType: string, region?: string) {
    _initContext()

    if (!settingsRange) {
        throw `Must specify settings range`
    }

    let overrides = {}
    if (region) {
        overrides['region'] = region
    }

    let settings = InvocationSettings.loadFromRange(settingsRange, overrides)

    return _rds(settings, dbEngine, instanceType)
}