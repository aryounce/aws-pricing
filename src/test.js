function test4() {
  console.log(EC2_EBS_IO1_IOPS(15000, "us-east-1"));
}

function testRDS() {
  console.log(RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "no_upfront"))
  console.log(RDS_AURORA_MYSQL_RI("db.r6g.xlarge", "us-east-1", 1, "partial_upfront"))
  console.log(RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "all_upfront"))
  console.log(RDS_AURORA_MYSQL_RI("db.r6g.xlarge", "us-east-1", 3, "partial_upfront"))
  console.log(RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "all_upfront"))
  console.log(RDS_AURORA_MYSQL_RI_NO("db.r5.xlarge", "us-east-1", 1))
  console.log(RDS_AURORA_MYSQL_RI_PARTIAL("db.r6g.xlarge", "us-east-1", 1))
  console.log(RDS_AURORA_MYSQL_RI_ALL("db.r5.xlarge", "us-east-1", 1))
  console.log(RDS_AURORA_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"))
  console.log(RDS_MARIADB_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"))
  console.log(RDS_MYSQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"))
  console.log(RDS_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"))
}

function test3() {
  console.log(RDS_MARIADB_OD("db.r4.xlarge", "us-east-2"));
  // console.log(RDS_AURORA_MYSQL_OD("db.r4.xlarge", "us-east-2"));
}

function test2() {
  const data = UrlFetchApp.fetch('https://cdn.x.macroscope.io/aws-pricing/retro/pricing/1.0/ec2/region/us-east-2/reserved-instance/linux/index.json?timestamp=' + Date.now());
  // console.log(data);
  console.log(saveToDrive(data, 'dump.json'));
}
  
function test1() {
  console.log(EC2_RI("m5.xlarge", "us-east-2", "linux", "convertible", 1, "all_upfront"))
}

function saveToDrive(data, fileName) {
  var file = DriveApp.createFile(fileName, data, MimeType.PLAIN_TEXT);
  return file.getUrl();
}

