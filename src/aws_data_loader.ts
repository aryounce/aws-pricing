import { CacheLoader } from "./cache_loader";

interface AwsDataLoaderTransform {
    (value: string): string
}

export class AwsDataLoader {
    static readonly baseHost = 'https://a0.p.awsstatic.com'
    static readonly baseHostV2 = 'https://b0.p.awsstatic.com'
    static readonly expireTimeSeconds = 3600

    private readonly cache: CacheLoader

    constructor() {
        this.cache = new CacheLoader(CacheService.getScriptCache())
    }

    loadPath(path: string, transform?: AwsDataLoaderTransform): string {
        let data = this.cache.get(path)
        if (data != null) {
            return data
        }

        let url = this.buildUrl(path)
        data = this.loadUrl(url)

        if (transform) {
            data = transform(data)
        }

        this.cache.put(path, data, AwsDataLoader.expireTimeSeconds)

        return data
    }

    private loadUrl(url: string) {
        let resp = UrlFetchApp.fetch(url)
        if (resp.getResponseCode() != 200) {
            throw "Unable to load the URL: " + url;
        }
    
        return resp.getContentText();
    }
    
    // Cache bust the URL by adding a timestamp
    // TODO: will not work with existing query params
    private buildUrl(path: string) : string {
        if (path.indexOf("/ec2/") !== -1) {
            return Utilities.formatString("%s%s?timestamp=%d",
                AwsDataLoader.baseHostV2, path, Date.now())
        }

        return Utilities.formatString("%s%s?timestamp=%d",
            AwsDataLoader.baseHost, path, Date.now())
    }
}
