import { _ec2_full } from "./ec2";

/**
 * Returns the on-demand pricing for given instance type, using Linux.
 * 
 * @param {"m5.xlarge"} instanceType
 * @param {"us-east-2"} region
 * @returns price
 * @customfunction
 */
export function EC2_RI(instanceType: string, region: string, platform: string, offeringClass: string,
    purchaseTerm: string | number, paymentOption: string) {
    return _ec2_full(instanceType, region, "reserved", platform, offeringClass, purchaseTerm, paymentOption)
}
