// Compiled using aws-pricing 0.0.1 (TypeScript 4.9.4)
function test1() {
  // console.log(RDS_MARIADB_OD("db.r5.2xlarge", "ca-central-1"));
  // console.log(RDS_AURORA_MYSQL_OD("db.r5.xlarge", "us-east-1"));
  // console.log(EC2_EBS_IO1_IOPS(15000, "us-east-1"));
  // console.log(EC2_EBS_GP3_IOPS(7000, "us-east-1"));
  console.log(RDS_STORAGE_GB("aurora", 4000, "us-west-1"));
}

function getTableOfContents() {
  const baseHost = 'https://cdn.x.macroscope.io/aws-pricing/retro';
  const url = baseHost + 'retro/pricing/1.0/toc_ec2_reserved-instance.json';
  const response = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  console.log(response);
}