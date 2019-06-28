import { EC2OperatingSystem } from "../models/ec2_operating_systems";
import { InvocationSettings } from "../settings/invocation_settings";
import { PriceDuration } from "../price_converter";
import { EC2Price } from "../ec2_price";
import { ctxt, _initContext } from "../context";

function _ec2(settings: InvocationSettings, instType: string)  {
    if (!instType) {
        throw "Instance type is not set"
    }

    for (let setting of ctxt().defaultSettings.getSettingKeys()) {
        if (!settings.get(setting)) {
            throw `Required EC2 property unset: ${setting}`
        }
    }

    let ec2Prices = new EC2Price(settings, instType)

    return ec2Prices.get(PriceDuration.Hourly)
}

function _ec2_full(instType: string, region: string, term: string, operating_system: string) {
    _initContext()

    if (!instType) {
        throw "Instance type is not set"
    }

    if (!region) {
        throw "Region is not set"
    }

    if (!term) {
        throw "Purchase term is not set"
    }

    if (!operating_system) {
        throw "Operating system is not set"
    }

    let settingsMap = {
        'region': region,
        'purchase_term': term,
        'operating_system': operating_system
    }

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
        overrides['region'] = region
    }

    let settings = InvocationSettings.loadFromRange(settingsRange, overrides)

    return _ec2(settings, instType)
}

/**
 * Returns the on-demand pricing for given instance type.
 * 
 * @param instType
 * @param region
 * @param operating_system
 * @returns price
 * @customfunction
 */
export function EC2_OD(instType: string, region: string, operating_system: string) {
    return _ec2_full(instType, region, "ondemand", operating_system)
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
    return EC2_OD(instType, region, EC2OperatingSystem.msSqlLicenseToType("linux", sqlLicense))
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
    return EC2_OD(instType, region, EC2OperatingSystem.msSqlLicenseToType("windows", sqlLicense))
}
