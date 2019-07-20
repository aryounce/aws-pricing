import { EC2Platform } from "../models/ec2_platform";
import { InvocationSettings } from "../settings/invocation_settings";
import { _initContext } from "../context";
import { SettingKeys } from "../settings/setting_keys";
import { _ec2, _ec2_full } from "./ec2";

/**
 * Returns the on-demand pricing for given instance type using the provided settings.
 *
 * @param settingsRange Two-column range of default EC2 instance settings
 * @param instanceType Instance type, eg. "m5.xlarge"
 * @param region Override region setting for this call (optional)
 * @returns price
 * @customfunction
 */
export function EC2(settingsRange: Array<Array<string>>, instanceType: string, region?: string) {
    _initContext()

    if (!settingsRange) {
        throw "Missing required settings range"
    }

    let overrides = {}

    if (region) {
        overrides[SettingKeys.Region] = region
    }

    let settings = InvocationSettings.loadFromRange(settingsRange, overrides)

    return _ec2(settings, instanceType)
}

/**
 * Returns the on-demand pricing for given instance type.
 *
 * @param instanceType
 * @param region
 * @param platform
 * @returns price
 * @customfunction
 */
export function EC2_OD(instanceType: string, region: string, platform: string) {
    return _ec2_full(instanceType, region, "ondemand", platform)
}

/**
 * Returns the on-demand pricing for given instance type, using Linux.
 *
 * @param instanceType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_LINUX_OD(instanceType: string, region: string) {
    return EC2_OD(instanceType, region, "linux")
}

/**
 * Returns the on-demand pricing for given instance type, using Linux MS SQL.
 *
 * @param instanceType
 * @param region
 * @param sqlLicense (std, web, or enterprise)
 * @returns price
 * @customfunction
 */
export function EC2_LINUX_MSSQL_OD(instanceType: string, region: string, sqlLicense: string) {
    return EC2_OD(instanceType, region, EC2Platform.msSqlLicenseToType("linux", sqlLicense))
}

/**
 * Returns the on-demand pricing for given instance type, using RHEL.
 *
 * @param instanceType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_RHEL_OD(instanceType: string, region: string) {
    return EC2_OD(instanceType, region, "rhel")
}

/**
 * Returns the on-demand pricing for given instance type, using SUSE.
 *
 * @param instanceType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_SUSE_OD(instanceType: string, region: string) {
    return EC2_OD(instanceType, region, "suse")
}

/**
 * Returns the on-demand pricing for given instance type, using Windows.
 *
 * @param instanceType
 * @param region
 * @returns price
 * @customfunction
 */
export function EC2_WINDOWS_OD(instanceType: string, region: string) {
    return EC2_OD(instanceType, region, "windows")
}

/**
 * Returns the on-demand pricing for given instance type, using Windows MS SQL.
 *
 * @param instanceType
 * @param region
 * @param sqlLicense
 * @returns price
 * @customfunction
 */
export function EC2_WINDOWS_MSSQL_OD(instanceType: string, region: string, sqlLicense: string) {
    return EC2_OD(instanceType, region, EC2Platform.msSqlLicenseToType("windows", sqlLicense))
}
