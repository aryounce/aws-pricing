interface ISettingsMap {
    [key: string]: string
}

export interface ISettings {
    name(): string
    valid(name: string): boolean
    defaultSetting(): string
    getAll(): Array<string>
    getAllDisplay(): ISettingsMap
}