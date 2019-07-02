import { AwsDataLoader } from "./aws_data_loader";

export class RegionsList {
    // Use available EC2 regions as an authorative list
    private static readonly manifestPath = '/pricing/1.0/ec2/manifest.json'

    private constructor(readonly regions: Array<string>) {
    }

    static load(awsLoader: AwsDataLoader) {
        let resp = awsLoader.loadPath(this.manifestPath)
        let json = JSON.parse(resp)

        return new RegionsList(json.ec2)
    }
}