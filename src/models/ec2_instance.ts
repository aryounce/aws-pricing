import { Utils } from "../_utils";

export class EC2Instance {
    // TODO: Build this list dynamically
    private static readonly prevGenerationClasses = [
        'c1', 'c2', 'c3',
        'cc2',
        'cr1',
        'g2',
        'i2',
        'm1', 'm2', 'm3',
        'r3',
        't1'
    ]
    private static readonly prevGenerationClassesMap = Utils.lookupMap(EC2Instance.prevGenerationClasses)

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

    isPreviousGeneration(): boolean {
        return EC2Instance.prevGenerationClassesMap[this.instClass] != undefined
    }
}
