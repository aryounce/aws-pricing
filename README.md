# AWS Pricing

The AWS Pricing [Google Sheets add-on][addon] allows you to incorporate the latest AWS pricing data in your Google Sheets spreadsheets. This makes it easy to perform cloud cost analysis directly in Sheets without error-prone copy-and-paste from pricing websites. Pricing data tracks the latest discounts from AWS.

## Examples

The following function entered into a Google Sheet cell will return
the hourly price of an m5.xlarge Linux instance running on-demand in us-east-2 region, currently $0.192:
```
=EC2_LINUX_OD("m5.xlarge", "us-east-2")
```

# Installation

Add the *AWS Pricing* [addon][addon] to your Google Sheets document.

# Usage

## Supported services

The following services are currently supported with more to come:

* EC2 instances (Linux and Windows)
* Pricing options: ondemand and reserved

## EC2 Functions

### Parameters

These define the parameters used in the following functions and instance settings.

* `instanceType`: name of instance represented as `<class>.<size>`, eg `m5.xlarge`
* `region`: name of AWS region, eg `us-east-1` and `eu-west-1`
* `purchaseType`: name of the purchasing type, either `ondemand` or `reserved`
* `platform`: name of OS platform, currently supports: `linux`, `windows`, `rhel`, `suse`, `linux_std` (Linux SQL Standard), `linux_web` (Linux SQL Web), `linux_enterprise` (Linux SQL Enterprise), `windows_std` (Windows SQL Std), `windows_web` (Windows SQL Web), `windows_enterprise` (Windows SQL Enterprise)
* `sqlLicense`: name of MSSQL license, either: `std`, `web`, or `enterprise`
* `offeringClass`: type of reserved instance, either `standard` or `convertible`
* `purchaseTerm`: duration of reserved instance purchase in years, either `1` or `3`
* `paymentOption`: payment option of reserved instance, either `no_upfront`, `partial_upfront`, or `all_upfront`

### Generic EC2 Function

To minimize the repetition of standard instance pricing details, the `EC2()` function accepts a range parameter that points to pre-configured instance properties. The range may be an explicit one from the sheet, eg `A1:B4` or it may reference a [named range](https://support.google.com/docs/answer/63175). The range must be a 2 column x N row selection, where the first column in the row is the property name and the second column in the row is the property value.

This approach makes it simple to define per-environment or per-organization pricing policy defaults and reference them per unique instance type.

* `EC2(settingsRange, instanceType, region: optional)`: (`region` is optional and overrides `settingsRange`)

 The supported property names and the supported values match the parameters defined earlier. The following parameters are required:

* `region`
* `platform`
* `purchase_type`

If the `purchase_type` is `reserved`, you must also specify the following parameters:

* `offering_class`
* `purchase_term`
* `payment_option`

The add-on provides an easy way to configure and generate a named range of configuration settings. Find the "AWS Pricing" menu under the "Add-ons" top-level menu and select _"New settings sheet"_. This will popup a dialog to configure and generate a new sheet and a named settings range.

### EC2 On-demand Functions

To explicitly grab on-demand pricing use these functions:

* `EC2_OD(instanceType, region, platform)`
* `EC2_LINUX_OD(instanceType, region)`
* `EC2_RHEL_OD(instanceType, region)`
* `EC2_SUSE_OD(instanceType, region)`
* `EC2_WINDOWS_OD(instanceType, region)`
* `EC2_LINUX_MSSQL_OD(instanceType, region, sqlLicense)`
* `EC2_WINDOWS_MSSQL_OD(instanceType, region, sqlLicense)`

### EC2 RI Functions

The simplest EC2 RI function requires multiple parameters to specify all the RI pricing details:

* `EC2_RI(instanceType, region, platform, offeringClass, purchaseTerm, paymentOption)`

There are also several alias functions that encode the pricing details in the function name. They follow the form:
```
 EC2_<platform>_<STD or CONV>_RI_<NO, PARTIAL, or ALL>(instanceType, region, purchaseTerm)
```

* `STD` or `CONV` represent a *standard* or *convertible* RI, respectively
* `NO`, `PARTIAL` or `ALL` represent whether it's a *no-upfront*, *partial-upfront* or *all-upfront* payment option, respectively

For example, these are some of the alias functions:

* `EC2_LINUX_CONV_RI_NO(instanceType, region, purchaseTerm)`
* `EC2_LINUX_STD_RI_PARTIAL(instanceType, region, purchaseTerm)`
* `EC2_LINUX_STD_RI_PARTIAL(instanceType, region, purchaseTerm)`

Lastly, if you want pricing for MSSQL platforms you can use similar functions of the form:
```
 EC2_<platform>_MSSQL_<STD or CONV>_RI_<NO, PARTIAL, or ALL>(instanceType, region, sqlLicense, purchaseTerm)
```

Where `sqlLicense` is either *web*, *std*, or *enterprise* and `platform` is either *LINUX* or *WINDOWS*.


### Pricing Duration

Prices are currently returned in hourly durations. The price is the *effective* hourly rate when using reserved instances.

# Notes

## Pricing API

This currently pulls data from the pricing data files used on the main EC2 pricing pages. Unfortunately, these data files are not supported by AWS and hence may break at some point in the future. These files are more compact than the published [bulk pricing API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html), roughly 100KB vs 30MB, so they are better suited for quick lookups.

## Future support

* Daily, Monthly, Yearly pricing
* Data transfer
* EBS
* RDS
* Elasticache
* Upfront down-payments for Partial and All Upfront RI's, along with hourly rates
* More services as requested

## References

* Inspired by [aws-pricing-helper](https://github.com/marcy-terui/gs-aws-pricing-helper)

[addon]: https://chrome.google.com/webstore/detail/aws-pricing/obdnfnkckkmjcpeegkhkmpnoiaidhicd
