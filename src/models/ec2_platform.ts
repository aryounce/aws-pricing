export enum EC2PlatformType {Linux, Rhel, Suse, Windows, Windows_Std, Windows_Web, Windows_Enterprise,
    Linux_Std, Linux_Web, Linux_Enterprise }

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
            default: {
                return null
            }
        }
    }

    static typeToUriPath(os: EC2PlatformType): string {
        switch (os) {
            case EC2PlatformType.Linux: {
                return "Linux"
            }
            default: {
                return "unknown"
            }
        }
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
