import { EC2Platform } from "../models/ec2_platform";
import { InvocationSettings } from "../settings/invocation_settings";
import { PriceDuration } from "../price_converter";
import { EC2Price } from "../ec2_price";
import { _initContext } from "../context";
import { SettingKeys } from "../settings/setting_keys";

function _ec2(settings: InvocationSettings, instType: string)  {
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

function _ec2_full(instType: string, region: string, purchaseType: string, platform: string) {
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

    let settings = InvocationSettings.loadFromMap(settingsMap)

    return _ec2(settings, instType)
}

/**
 * Returns the on-demand pricing for given instance type using the provided settings.
 * 
 * @param settingsRange Two-column range of default EC2 instance settngs
 * @param instType Instance type, eg. "m5.xlarge"
 * @param region Override region setting for this call (optional)
 * @returns price
 * @customfunction
 */
export function EC2(settingsRange: Array<Array<string>>, instType: string, region?: string) {
    _initContext()

    if (!settingsRange) {
        throw "Missing required settings range"
    }

    let overrides = {}

    if (region) {
        overrides[SettingKeys.Region] = region
    }

    let settings = InvocationSettings.loadFromRange(settingsRange, overrides)

    return _ec2(settings, instType)
}

/**
 * Returns the on-demand pricing for given instance type.
 * 
 * @param instType
 * @param region
 * @param platform
 * @returns price
 * @customfunction
 */
export function EC2_OD(instType: string, region: string, platform: string) {
    return _ec2_full(instType, region, "ondemand", platform)
}

/**
 * Returns the on-demand pricing for given instance type, using Linux.
 * 
 * @param instType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_LINUX_OD(instType: string, region: string) {
    return EC2_OD(instType, region, "linux")
}

/**
 * Returns the on-demand pricing for given instance type, using Linux SQL.
 * 
 * @param instType
 * @param region
 * @param sqlLicense (std, web, or enterprise)
 * @returns price
 * @customfunction
 */
export function EC2_LINUX_MSSQL_OD(instType: string, region: string, sqlLicense: string) {
    return EC2_OD(instType, region, EC2Platform.msSqlLicenseToType("linux", sqlLicense))
}

/**
 * Returns the on-demand pricing for given instance type, using RHEL.
 * 
 * @param instType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_RHEL_OD(instType: string, region: string) {
    return EC2_OD(instType, region, "rhel")
}

/**
 * Returns the on-demand pricing for given instance type, using SUSE.
 * 
 * @param instType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_SUSE_OD(instType: string, region: string) {
    return EC2_OD(instType, region, "suse")
}

/**
 * Returns the on-demand pricing for given instance type, using Windows.
 * 
 * @param instType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_WINDOWS_OD(instType: string, region: string) {
    return EC2_OD(instType, region, "windows")
}

/**
 * Returns the on-demand pricing for given instance type, using Windows SQL.
 * 
 * @param instType
 * @param region
 * @param sqlLicense
 * @returns price
 * @customfunction
 */
export function EC2_WINDOWS_MSSQL_OD(instType: string, region: string, sqlLicense: string) {
    return EC2_OD(instType, region, EC2Platform.msSqlLicenseToType("windows", sqlLicense))
}
