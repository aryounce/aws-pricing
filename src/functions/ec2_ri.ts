import { EC2Functions } from "./ec2";

/**
 * Returns the reserved instance pricing for the given instance type and purchase options.
 * 
 * @param {"m5.xlarge"} instanceType Instance type, eg. "m5.xlarge"
 * @param {"us-east-2"} region
 * @param {"linux"} platform Instance platform, eg. "linux", "windows", etc.
 * @param {"convertible"} offeringClass Either "standard" or "convertible"
 * @param {1} purchaseTerm Duration of RI in years (1 or 3)
 * @param {"all_upfront"} paymentOption Payment terms (no_upfront, partial_upfront, all_upfront)
 * @returns price
 * @customfunction
 */
export function EC2_RI(instanceType: string, region: string, platform: string, offeringClass: string,
    purchaseTerm: string | number, paymentOption: string) {
    return EC2Functions._ec2_full(instanceType, region, "reserved", platform, offeringClass, purchaseTerm, paymentOption)
}
