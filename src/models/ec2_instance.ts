import { Utils } from "../_utils";

export class EC2Instance {
    private readonly instClass: string
    private readonly instSize: string

    constructor(instType: string) {
        let s = instType.toLowerCase().split(".")

        if (s.length != 2) {
            throw `Invalid instance type: ${instType}`
        }

        this.instClass = s[0]
        this.instSize = s[1]
    }

    getInstanceType(): string {
        return this.instClass + "." + this.instSize;
    }
}
