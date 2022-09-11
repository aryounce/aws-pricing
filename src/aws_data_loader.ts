import { CacheLoader } from "./cache_loader";

interface AwsDataLoaderTransform {
    (value: string): string
}

export class AwsDataLoader {
    static readonly baseHost = 'https://a0.p.awsstatic.com'
    static readonly expireTimeSeconds = 3600

    private readonly cache: CacheLoader

    constructor() {
        this.cache = new CacheLoader(CacheService.getScriptCache())
    }

    loadUrl(url: string, transform?: AwsDataLoaderTransform): string {
        return this.loadFullUrl(url, transform)
    }

    loadPath(path: string, transform?: AwsDataLoaderTransform): string {
        let url = this.buildUrl(path)

        return this.loadFullUrl(url, transform)
    }

    private loadFullUrl(url: string, transform?: AwsDataLoaderTransform): string {
        let data = this.cache.get(url)
        if (data != null) {
            return data
        }

        data = this.fetchUrl(url)

        if (transform) {
            data = transform(data)
        }

        this.cache.put(url, data, AwsDataLoader.expireTimeSeconds)

        return data

    }

    private fetchUrl(url: string) {
        let resp = UrlFetchApp.fetch(url)
        if (resp.getResponseCode() != 200) {
            throw "Unable to load the URL: " + url;
        }
    
        return resp.getContentText();
    }
    
    // Cache bust the URL by adding a timestamp
    // TODO: will not work with existing query params
    private buildUrl(path: string) : string {
        return Utilities.formatString("%s%s?timestamp=%d",
            AwsDataLoader.baseHost, path, Date.now())
    }
}
