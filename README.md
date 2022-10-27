# AWS Pricing

> **Warning**
> This is currently broken and failing due to the bug described in #47 (see https://github.com/mheffner/aws-pricing/issues/46#issuecomment-1290822647 for more details). If you have experience working with Google Apps scripts I would love to chat with you.

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

* EC2 instances (Linux, RHEL, SUSE and Windows)
* EBS storage, Provisioned IOPS and snapshots
* RDS DB instances
* RDS Storage

Pricing options support on-demand and reserved purchasing.

## Call syntax

This addon supplies multiple custom functions that you can invoke from a Google Sheets cell. To invoke a custom function (or any function), start by typing a "`=`" followed by the name of the function. Oftentimes the sheets editor will popup a command completion dialog that searches as you type. All the functions here include parameter documentation that will appear when you've selected a particular function and help describe the order of parameters.

Functions are documented here without the required leading "`=`" for ease of reading.

## EC2 Instances

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
* `EC2_WINDOWS_CONV_RI_ALL(instanceType, region, purchaseTerm)`

Lastly, if you want pricing for MSSQL platforms you can use similar functions of the form:
```
 EC2_<platform>_MSSQL_<STD or CONV>_RI_<NO, PARTIAL, or ALL>(instanceType, region, sqlLicense, purchaseTerm)
```

Where `sqlLicense` is either *web*, *std*, or *enterprise* and `platform` is either *LINUX* or *WINDOWS*.


### Pricing Duration

Prices are currently returned in hourly durations. The price is the *effective* hourly rate when using reserved instances.

## EBS

You can compute the cost of EBS storage and provisioned IOPS with the `EC2_EBS_*()` functions. The storage functions end in `_GB()` and compute the cost based on total number of Gigabytes consumed. Provisioned IOPS cost can be computed with the `_IOPS()` functions. Lastly, EBS snapshot usage cost can be computed.

### EBS Storage Costs

The generic function for computing storage cost accepts an optional settings range, similar to the EC2 functions above. The only required setting in the range is *region*. The two variants are:

* `EC2_EBS_GB(settingsRange, volumeType, volumeSize, region: optional)`
* `EC2_EBS_GB(volumeType, volumeSize, region)`

The supported parameters are:

* `volumeType`: The type of volume (*magnetic*, *gp2*, *io1*, *io2*, *st1* or *sc1*)
* `volumeSize`: Size in number of provisioned Gigabytes
* `region`: Will override any region in a settings range, eg: *us-east-2*

There are several alias functions that embed the volumeType in the function name in the form:
```
EC2_EBS_<MAGNETIC or GP2 or IO1 or IO2 or ST1 or SC1>_GB(...)
```

For example, for General Purpose (gp2) storage you can also call:

* `EC2_EBS_GP2_GB(settingsRange, volumeSize, region: optional)`
* `EC2_EBS_GP2_GB(volumeSize, region)`

### EBS Provisioned IOPS

Provisioned IOPS pricing is only supported on *io1*, *io2* and *gp3* volume types.
Both functions take the number of *iops* to calculate for.

* `EC2_EBS_IO1_IOPS(settingsRange, iops, region: optional)`
* `EC2_EBS_IO1_IOPS(iops, region)`

For IO2 IOPS, the functions are the same but will calculate rates using the tiered pricing model.

* `EC2_EBS_IO2_IOPS(settingsRange, iops, region: optional)`
* `EC2_EBS_IO2_IOPS(iops, region)`

For GP3 IOPS it is similar tiered pricing, but the first tier is free.

* `EC2_EBS_GP3_IOPS(settingsRange, iops, region: optional)`
* `EC2_EBS_GP3_IOPS(iops, region)`

### EBS Snapshot storage

EBS snapshot cost is measured by the amount of stored Gigabytes using the following functions.

* `EC2_EBS_SNAPSHOT_GB(settingsRange, size, region: optional)`
* `EC2_EBS_SNAPSHOT_GB(size, region)`

### Pricing Duration

The AWS pricing pages for EBS costs returns pricing amounts in monthly values, despite the actual billing being billed to the second. To match the EC2 functions hourly usage, the EBS cost functions in *AWS Pricing* return costs in hourly durations. This makes it easy to multiply the combined EC2 and EBS costs by 730 (hours in month), for example, to compute a monthly cost.

## RDS Instances

*AWS Pricing* supports custom functions for RDS on-demand and reserved-instance pricing.

### DB Engines

RDS DB instance pricing supports the following RDS DB engines:

* Aurora MySQL (`RDS_AURORA_MYSQL*`)
* Aurora PostgreSQL (`RDS_AURORA_POSTGRESQL*`)
* MySQL (`RDS_MYSQL*`)
* PostgreSQL (`RDS_POSTGRESQL*`)
* MariaDB (`RDS_MARIADB*`)

All RDS functions are prefixed with the name of the DB engine.

### Using settings

Similar to EC2, you can use a predefined range of custom settings to reduce repetition across multiple lookup calls. The following settings are used by RDS functions:

* `region`
* `purchase_type`
* `purchase_term`
* `payment_option`

To use the settings in an RDS call, invoke the appropriate function for the DB engine like:
```
RDS_<ENGINE>(settingsRange, instanceType, region: optional)
```

For example, to lookup the price for an Aurora MySQL instance running on a *db.r4.2xlarge* use the following call. The purchase type and payment options will be pulled from the *settingsRange*, allowing easy adjustment across all calls referencing it.
```
RDS_AURORA_MYSQL(<settingsRange>, "db.r4.2xlarge")
```

The *region* parameter allows overriding the region for a single lookup.

### On-demand instances

To lookup the on-demand price for a DB instance you can use the explicit call:
```
RDS_<ENGINE>_OD(instanceType, region)
```

### Reserved instances

To lookup reserved-instance pricing for DB instances uses the following call pattern:
```
RDS_<ENGINE>_RI(instanceType, region, purchaseTerm, paymentOption)
```
For example, the following call pulls the pricing for an MariaDB reserved instance on a 3yr, all-upfront RI:
```
RDS_MARIADB_RI("db.r4.2xlarge", "ca-central-1", 3, "all_upfront")
```

There are also alias functions for the three payment options:

* `RDS_<ENGINE>_RI_NO(instanceType, region, purchaseTerm)`: no-upfront purchase (not valid for 3 year purchase terms)
* `RDS_<ENGINE>_RI_PARTIAL(instanceType, region, purchaseTerm)`: partial-upfront purchase
* `RDS_<ENGINE>_RI_ALL(instanceType, region, purchaseTerm)`: all-upfront purchase

### Pricing duration

All RDS functions return the effective price *per hour*.

## RDS Storage

You can compute the cost of provisioned RDS storage using the `RDS_STORAGE_*` functions. These functions all take the size of the volume in Gigabytes and return the hourly cost for the amount of provisioned storage.

### RDS Storage Costs

The generic RDS storage function can work with or without a predefined settings range. The only setting that these functions require is the *region* setting.

* `RDS_STORAGE_GB(settingsRange, volumeType, volumeSize, region: optional)`: *region* overrides the *settingsRange* if specified
* `RDS_STORAGE_GB(volumeType, volumeSize, region)`

The supported `volumeType`'s are: *aurora*, *gp2*, *piops* and *magnetic*.

There are two alias functions for each volume type as well. For example, for Aurora volumes you can also use the following alias:

* `RDS_STORAGE_AURORA_GB(settingsRange, volumeSize, region: optional)`
* `RDS_STORAGE_AURORA_GB(volumeSize, region)`

# Notes

## Pricing API

This currently pulls data from the pricing data files used on the main EC2 pricing pages. Unfortunately, these data files are not supported by AWS and hence may break at some point in the future. These files are more compact than the published [bulk pricing API](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-ppslong.html), roughly 100KB vs 30MB, so they are better suited for quick lookups.

## Discontinued instance sizes/offerings

This addon pulls directly from the AWS pricing data files. Oftentimes AWS will discontinue certain instance size configurations or
purchase offerings. While it may still technically be possible to purchase the offering through AWS, the pricing data is no longer
offered in the current pricing files. In this case you may see a method throw an error that it can not find the pricing information. The addon
could probably be smarter at pulling from legacy pricing locations, but that's not supported for all services.

## Future support

* Daily, Monthly, Yearly pricing
* Data transfer
* RDS Aurora Serverless, IOPS, Aurora Global, Data Xfer
* RDS SQL Server
* Elasticache
* Upfront down-payments for Partial and All Upfront RI's, along with hourly rates
* More services as requested

## References

* Inspired by [aws-pricing-helper](https://github.com/marcy-terui/gs-aws-pricing-helper)

[addon]: https://chrome.google.com/webstore/detail/aws-pricing/obdnfnkckkmjcpeegkhkmpnoiaidhicd
