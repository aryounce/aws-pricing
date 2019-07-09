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
* Pricing options: ondemand

## Functions

### EC2 Instances

* `EC2(settingsRange, instType, region: optional)`: (`region` is optional and overrides `settingsRange`)
* `EC2_OD(instType, region, platform)`
* `EC2_LINUX_OD(instType, region)`
* `EC2_RHEL_OD(instType, region)`
* `EC2_SUSE_OD(instType, region)`
* `EC2_WINDOWS_OD(instType, region)`
* `EC2_LINUX_MSSQL_OD(instType, region, sqlLicense)`
* `EC2_WINDOWS_MSSQL_OD(instType, region, sqlLicense)`

_Parameters_

* `settingsRange`: Either an explicit spreadsheet range or named range containing default instance type settings, see below.
* `instType`: name of instance represented as `<class>.<size>`, eg `m5.xlarge`
* `region`: name of AWS region, eg `us-east-1` and `eu-west-1`
* `purchaseType`: name of the purchasing type, currently just `ondemand`
* `platform`: name of OS platform, currently supports: `linux`, `windows`, `rhel`, `suse`, `linux_std` (Linux SQL Standard), `linux_web` (Linux SQL Web), `linux_enterprise` (Linux SQL Enterprise), `windows_std` (Windows SQL Std), `windows_web` (Windows SQL Web), `windows_enterprise` (Windows SQL Enterprise)
* `sqlLicense`: name of MSSQL license, either: `std`, `web`, or `enterprise`

### Default instance settings

To minimize repetition of standard instance type properties, the `EC2()` function accepts a range parameter that points to preconfigured instance properties. The range may be an explicit one from the sheet, eg `A1:B4` or it may reference a [named range](https://support.google.com/docs/answer/63175). The range must be a 2 column x N row selection, where the first column in the row is the property name and the second column in the row is the property value. The supported property names and the supported values match the function parameters above.

* `region`
* `platform`
* `purchase_type`

The add-on provides an easy way to configure and generate a named range of configuration settings. Find the "AWS Pricing" menu under the "Add-ons" top-level menu and select "New settings sheet". This will popup a dialog to configure and generate a new sheet with named settings range.

### Pricing Duration

Prices are currently returned in hourly durations.

# Notes

## Pricing API

This currently pulls data from the pricing data files used on the main EC2 pricing pages. Unfortunately, these data files are not supported by AWS and hence may break at some point in the future. These files are more compact than the published [bulk pricing API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html), roughly 100KB vs 30MB, so they are better suited for quick lookups.

## Future support

* Reserved Instance pricing
* Daily, Monthly, Yearly pricing
* Data transfer
* EBS
* RDS
* Elasticache
* More services as requested

## References

* Inspired by [aws-pricing-helper](https://github.com/marcy-terui/gs-aws-pricing-helper)

[addon]: https://chrome.google.com/webstore/detail/aws-pricing/obdnfnkckkmjcpeegkhkmpnoiaidhicd
