export enum EC2PlatformType {Linux, Rhel, Suse, Windows, Windows_Std, Windows_Web, Windows_Enterprise, Linux_Std, Linux_Web, Linux_Enterprise, Rhel_ha, Rhel_ha_Enterprise, Rhel_ha_Std, Rhel_Enterprise, Rhel_Std, Rhel_Web }

export class EC2Platform {
    static nameToType(name: string): EC2PlatformType {
        switch (name.toLowerCase()) {
            case "linux": {
                return EC2PlatformType.Linux
            }
            case "rhel": {
                return EC2PlatformType.Rhel
            }
            case "suse": {
                return EC2PlatformType.Suse
            }
            case "windows": {
                return EC2PlatformType.Windows
            }
            case "windows_std": {
                return EC2PlatformType.Windows_Std
            }
            case "windows_web": {
                return EC2PlatformType.Windows_Web
            }
            case "windows_enterprise": {
                return EC2PlatformType.Windows_Enterprise
            }
            case "linux_std": {
                return EC2PlatformType.Linux_Std
            }
            case "linux_web": {
                return EC2PlatformType.Linux_Web
            }
            case "linux_enterprise": {
                return EC2PlatformType.Linux_Enterprise
            }
            case "rhel-ha": {
                return EC2PlatformType.Rhel_ha //
            }
            case "rhel-ha_enterprise": {
                return EC2PlatformType.Rhel_ha_Enterprise
            }
            case "rhel-ha_std": {
                return EC2PlatformType.Rhel_ha_Std
            }
            case "rhel_enterprise": {
                return EC2PlatformType.Rhel_Enterprise
            }
            case "rhel_std": {
                return EC2PlatformType.Rhel_Std
            }
            case "rhel_web": {
                return EC2PlatformType.Rhel_Web
            }
            default: {
                return null
            }
        }
    }

    static typeToUriPath(os: EC2PlatformType): string {
        return EC2Platform.typeToString(os).replace("_", "-").toLowerCase()
    }

    static typeToString(os: EC2PlatformType): string {
        return EC2PlatformType[os]
    }

    static msSqlLicenseToType(basePlatform: string, sqlLicense: string) {
        if (basePlatform != "linux" && basePlatform != "windows") {
            throw `Invalid base platform: ${basePlatform}`
        }

        if (!sqlLicense) {
            throw `Missing SQL License`
        }

        sqlLicense = sqlLicense.toLowerCase()

        if (sqlLicense != "std" && sqlLicense != "web" && sqlLicense != "enterprise") {
            throw `Invalid Microsoft SQL license: ${sqlLicense}`
        }

        return Utilities.formatString("%s_%s", basePlatform, sqlLicense)
    }
}