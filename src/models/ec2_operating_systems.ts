export enum OSType {Linux, Rhel, Suse, Windows, Windows_Std, Windows_Web, Windows_Enterprise,
    Linux_Std, Linux_Web, Linux_Enterprise }

export class EC2OperatingSystem {
    static nameToType(name: string): OSType {
        switch (name.toLowerCase()) {
            case "linux": {
                return OSType.Linux
            }
            case "rhel": {
                return OSType.Rhel
            }
            case "suse": {
                return OSType.Suse
            }
            case "windows": {
                return OSType.Windows
            }
            case "windows_std": {
                return OSType.Windows_Std
            }
            case "windows_web": {
                return OSType.Windows_Web
            }
            case "windows_enterprise": {
                return OSType.Windows_Enterprise
            }
            case "linux_std": {
                return OSType.Linux_Std
            }
            case "linux_web": {
                return OSType.Linux_Web
            }
            case "linux_enterprise": {
                return OSType.Linux_Enterprise
            }
            default: {
                return null
            }
        }
    }

    static typeToUriPath(os: OSType): string {
        return EC2OperatingSystem.typeToString(os).replace("_", "-").toLowerCase()
    }

    static typeToString(os: OSType): string {
        return OSType[os]
    }

    static msSqlLicenseToType(baseOs: string, sqlLicense: string) {
        if (baseOs != "linux" && baseOs != "windows") {
            throw `Invalid base operating system: ${baseOs}`
        }

        if (!sqlLicense) {
            throw `Missing SQL License`
        }

        sqlLicense = sqlLicense.toLowerCase()

        if (sqlLicense != "std" && sqlLicense != "web" && sqlLicense != "enterprise") {
            throw `Invalid Microsoft SQL license: ${sqlLicense}`
        }

        return Utilities.formatString("%s_%s", baseOs, sqlLicense)
    }
}