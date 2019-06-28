import { loadCacheBustUrl } from "./prices";

export class RegionsList {
    // Use available EC2 regions as an authorative list
    private static readonly manifestUrl = 'https://a0.p.awsstatic.com/pricing/1.0/ec2/manifest.json'

    private constructor(readonly regions: Array<string>) {
    }

    static load() {
        let resp = loadCacheBustUrl(this.manifestUrl)
        let json = JSON.parse(resp)

        return new RegionsList(json.ec2)
    }
}