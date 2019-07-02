export class CacheLoader {
    constructor(private readonly cache: GoogleAppsScript.Cache.Cache) {
    }

    get(key: string): string {
        let keyEncode = this.keyEncode(key)

        let data = this.cache.get(keyEncode)
        if (data == null) {
            return null
        }

        let decoded = Utilities.base64Decode(data, Utilities.Charset.UTF_8)

        let textBlob = Utilities.newBlob(decoded)
        textBlob.setContentType('application/x-gzip')

        let blob = Utilities.ungzip(textBlob)

        return blob.getDataAsString()
    }

    put(key: string, value: string, expirationInSeconds?: number) {
        let keyEncode = this.keyEncode(key)

        let textBlob = Utilities.newBlob(value)

        let gzBlob = Utilities.gzip(textBlob)

        let encoded = Utilities.base64Encode(gzBlob.getBytes())

        if (expirationInSeconds) {
            this.cache.put(keyEncode, encoded, expirationInSeconds)
        } else {
            this.cache.put(keyEncode, encoded)
        }
    }

    private keyEncode(key: string): string {
        return Utilities.base64Encode(key)
    }
}