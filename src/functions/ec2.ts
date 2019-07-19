import { PriceDuration } from "../price_converter";
import { EC2Price } from "../ec2_price";
import { InvocationSettings } from "../settings/invocation_settings";
import { _initContext } from "../context";
import { SettingKeys } from "../settings/setting_keys";

export function _ec2(settings: InvocationSettings, instType: string)  {
    if (!instType) {
        throw "Instance type is not set"
    }

    let [ret, msg] = settings.validate()
    if (!ret) {
        throw msg
    }

    let ec2Prices = new EC2Price(settings, instType)

    return ec2Prices.get(PriceDuration.Hourly)
}

export function _ec2_full(instType: string, region: string, purchaseType: string, platform: string,
    offeringClass?: string, purchaseTerm?: string, paymentOption?: string) {
    _initContext()

    if (!instType) {
        throw "Instance type is not set"
    }

    if (!region) {
        throw "Region is not set"
    }

    if (!purchaseType) {
        throw "Purchase type is not set"
    }

    if (!platform) {
        throw "Platform is not set"
    }

    let settingsMap = {}
    settingsMap[SettingKeys.Region] = region
    settingsMap[SettingKeys.PurchaseType] = purchaseType
    settingsMap[SettingKeys.Platform] = platform

    if (purchaseType === "reserved") {
        if (!offeringClass) {
            throw "Offering class is not set"
        }

        if (!purchaseTerm) {
            throw "Purchase term is not set"
        }

        if (!paymentOption) {
            throw "Payment option is not set"
        }

        settingsMap[SettingKeys.OfferingClass] = offeringClass
        settingsMap[SettingKeys.PurchaseTerm] = purchaseTerm
        settingsMap[SettingKeys.PaymentOption] = paymentOption
    }

    let settings = InvocationSettings.loadFromMap(settingsMap)

    return _ec2(settings, instType)
}
