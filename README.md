# AWS Pricing add-on for Google Sheets

:mega: **An announcement about the future of the AWS Pricing add-on for Google Sheets.**

[Strake](https://getstrake.com), in collaboration with [@mheffner](https://github.com/mheffner), is excited to announce that we are inheriting Mike's Google Sheets add-on to continue the great work he started. This repo has been retired and replaced by our [new version](https://github.com/getstrake/aws-pricing-sheets-addon). Also, all existing issues that have not been addressed by the new version have been [migrated to the new repo](https://github.com/getstrake/aws-pricing-sheets-addon/issues).

---

> **Warning**
> This is currently broken and failing due to the bug described in https://github.com/mheffner/aws-pricing/issues/46 (see https://github.com/mheffner/aws-pricing/issues/46#issuecomment-1290822647 for more details). We're actively working on the issue and will post progress as it happens.

---

The AWS Pricing [Google Sheets add-on](https://workspace.google.com/marketplace/app/aws_pricing/328915503637) allows you to incorporate the latest AWS pricing data in your Google Sheets spreadsheets. This makes it easy to perform cloud cost analysis directly in Sheets without error-prone copy-and-paste from pricing websites. Pricing data tracks the latest discounts from AWS.

For usage examples and documentation see the [help file](Help.md).

## Discontinued instance sizes/offerings

This addon pulls from the AWS pricing data. Oftentimes AWS will discontinue certain instance size configurations or purchase offerings. While it may still technically be possible to purchase the offering through AWS, the pricing data is no longer offered in the current pricing files. In this case you may see a method throw an error that it can not find the pricing information.

## References

* Inspired by [aws-pricing-helper](https://github.com/marcy-terui/gs-aws-pricing-helper)

[addon]: https://chrome.google.com/webstore/detail/aws-pricing/obdnfnkckkmjcpeegkhkmpnoiaidhicd
