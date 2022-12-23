import { InvocationSettings } from "../settings/invocation_settings";
// don't import function _rds_storage_type_str_to_type, otherwise clasp bug
import { RDSStorage } from "../models/rds_storage";
import { RDSStorageSettingsValidator } from "../settings/rds_storage_settings_validator";
import { RDSStoragePrice } from "../rds_storage_price";
import { PriceDuration } from "../price_converter";
import { Context } from "../context";

function _rds_storage(settings: InvocationSettings, volumeType: RDSStorage, volumeSize: string|number) {
    if (!volumeSize) {
        throw `Must set a RDS volume size`
    }

    let volumeSizeNum = parseFloat(volumeSize.toString())
    if (!volumeSizeNum) {
        throw `Unable to parse RDS volume size from ${volumeSize}`
    }

    let [ret, msg] = new RDSStorageSettingsValidator(settings).validate()
    if (!ret) {
        throw msg
    }

    return new RDSStoragePrice(settings, volumeType, volumeSizeNum).get(PriceDuration.Hourly)
}

function _rds_storage_settings(settingsRange: Array<Array<string>>, volumeType: RDSStorage, volumeSize: string|number, region?: string) {
    let overrides = {}
    if (region) {
        overrides['region'] = region
    }

    let settings = InvocationSettings.loadFromRange(settingsRange, overrides)

    return _rds_storage(settings, volumeType, volumeSize)
}

function _rds_storage_full(volumeType: RDSStorage, volumeSize: string|number, region: string) {
    let settings = InvocationSettings.loadFromMap({'region': region})

    return _rds_storage(settings, volumeType, volumeSize)
}

/**
 * Returns the price of RDS storage for the given volume type.
 *
 * @param {A2:B7} settingsRange Two-column range of default EC2 instance settings
 * @param {"gp2"} volumeType type of RDS storage volume (aurora, gp2, piops, or magnetic)
 * @param {3000} volumeSize Size of the volume in Gigabytes
 * @param {"us-east-2"} region Override the region from the settings range (optional)
 * @returns price
 * @customfunction
 */
function RDS_STORAGE_GB(settingsRange: Array<Array<string>>, volumeType: string, volumeSize: string|number, region?: string): number;

/**
 * Returns the price of RDS storage for the given volume type.
 *
 * @param {"gp2"} volumeType type of RDS storage volume (aurora, gp2, piops, or magnetic)
 * @param {3000} volumeSize Size of the volume in Gigabytes
 * @param {"us-east-2"} region
 * @returns price
 * @customfunction
 */
function RDS_STORAGE_GB(volumeType: string, volumeSize: string | number, region: string): number

function RDS_STORAGE_GB(settingsOrType, typeOrSize, sizeOrRegion, region?: string): number {
    Context._initContext()

    if (!settingsOrType) {
        throw `Must specify a parameter`
    }

    if (typeof settingsOrType === "string") {
        let storageType = _rds_storage_type_str_to_type(settingsOrType)
        if (storageType == null) {
            throw `Invalid storage type ${settingsOrType}`
        }

        return _rds_storage_full(storageType, typeOrSize, sizeOrRegion)
    } else {
        if (!typeOrSize) {
            throw `Must specify RDS volume type`
        }

        let storageType = _rds_storage_type_str_to_type(typeOrSize.toString())
        if (storageType == null) {
            throw `Invalid storage type ${typeOrSize}`
        }

        return _rds_storage_settings(settingsOrType, storageType, sizeOrRegion, region)
    }
}

// don't export const. Otherwise bug in clasp
const RDS_STORAGE_Functions = {
    RDS_STORAGE_GB
}