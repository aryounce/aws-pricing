import { EBSPrice } from "../ebs_price";
import { PriceDuration } from "../price_converter";
import { InvocationSettings } from "../settings/invocation_settings";
import { EBSSettingsValidator } from "../settings/ebs_settings_validator";
import { _initContext } from "../context";

export function EC2_EBS_GB(settingsRange: Array<Array<string>>, type: string, size: string | number, region?: string): number
export function EC2_EBS_GB(type: string, size: string | number, region: string): number
export function EC2_EBS_GB(settingsOrType, typeOrSize, sizeOrRegion, region?: string): number {
    _initContext()

    let settings: InvocationSettings = null
    let volumeType: string = null
    let volumeSize: string = null

    if (!settingsOrType) {
        throw `Must specify parameter`
    }

    if (typeof settingsOrType === "string") {
        volumeType = settingsOrType
        volumeSize = typeOrSize

        if (!sizeOrRegion) {
            throw `Must specify region`
        }
        
        settings = InvocationSettings.loadFromMap({'region': sizeOrRegion})
    } else {
        let overrides = {}

        if (region) {
            overrides['region'] = region
        }

        volumeType = typeOrSize
        volumeSize = sizeOrRegion

        settings = InvocationSettings.loadFromRange(settingsOrType, overrides)
    }

    if (!volumeType) {
        throw `Must specify EBS volume type`
    }

    if (!volumeSize) {
        throw `Must specify EBS volume size`
    }

    let [ret, msg] = new EBSSettingsValidator(settings).validate()
    if (!ret) {
        throw msg
    }

    let ebsPrices = new EBSPrice(settings, volumeType.toLowerCase(), volumeSize.toString())

    return ebsPrices.get(PriceDuration.Hourly)
}
