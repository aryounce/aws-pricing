import { TestSuite } from "../_framework/test_suite";
import { TestRun } from "../_framework/test_run";
import { RDS_GENFunctions } from "../../src/functions/gen/rds_gen";

export class RDSFunctionTestSuite extends TestSuite {
    protected name(): string {
        return this.constructor.name
    }
    
    protected run(t: TestRun): void {
        t.describe("RDS func tests", () => {
            t.areEqual(0.58, RDS_GENFunctions.RDS_AURORA_MYSQL_OD("db.r5.xlarge", "us-east-1"))
            t.areClose(0.379999, RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "no_upfront"), 0.000001)
            // db.r5.xlarge no longer offered in partial upfront
            t.areClose(0.288806, RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r6g.xlarge", "us-east-1", 1, "partial_upfront"), 0.000001)
            t.areClose(0.316210, RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 1, "all_upfront"), 0.000001)

            t.willThrow(function() {
                RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "no_upfront")
            }, "not supported")
            t.areClose(0.192570, RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r6g.xlarge", "us-east-1", 3, "partial_upfront"), 0.000001)
            t.areClose(0.202207, RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 3, "all_upfront"), 0.000001)

            t.areClose(0.379999, RDS_GENFunctions.RDS_AURORA_MYSQL_RI_NO("db.r5.xlarge", "us-east-1", 1), 0.000001)
            t.areClose(0.288806, RDS_GENFunctions.RDS_AURORA_MYSQL_RI_PARTIAL("db.r6g.xlarge", "us-east-1", 1), 0.000001)
            t.areClose(0.316210, RDS_GENFunctions.RDS_AURORA_MYSQL_RI_ALL("db.r5.xlarge", "us-east-1", 1), 0.000001)

            t.areEqual(1.16, RDS_GENFunctions.RDS_AURORA_POSTGRESQL_OD("db.r5.2xlarge", "us-east-1"))
            t.areEqual(1.04, RDS_GENFunctions.RDS_MARIADB_OD("db.r5.2xlarge", "ca-central-1"))
            t.areEqual(1.0810, RDS_GENFunctions.RDS_POSTGRESQL_OD("db.r5.2XLARGE", "CA-CENTRAL-1"))
            t.areEqual(1.04, RDS_GENFunctions.RDS_MYSQL_OD("db.r5.2xlarge", "ca-central-1"))

            // Verify all RI purchase types to ensure payload sizes fit in cache
            t.areClose(0.404452, RDS_GENFunctions.RDS_AURORA_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.348097, RDS_GENFunctions.RDS_MARIADB_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.348097, RDS_GENFunctions.RDS_MYSQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
            t.areClose(0.362595, RDS_GENFunctions.RDS_POSTGRESQL_RI("db.r5.2xlarge", "us-east-1", 3, "all_upfront"), 0.000001)
        })

        t.describe("RDS settings tests", () => {
            let s = [
                ['region', 'us-east-2'],
                ['purchase_type', 'ondemand']
            ]

            t.areEqual(0.58, RDS_GENFunctions.RDS_AURORA_MYSQL(s, "db.r5.xlarge"))
            t.areEqual(0.64, RDS_GENFunctions.RDS_AURORA_MYSQL(s, "db.r5.xlarge", "ca-central-1"))

            s = [
                ['region', 'us-east-1'],
                ['purchase_type', 'reserved'],
                ['purchase_term', '1'],
                ['payment_option', 'partial_upfront']
            ]

            t.areClose(0.288806, RDS_GENFunctions.RDS_AURORA_MYSQL(s, "db.r6g.xlarge"), 0.000001)
            s[3][1] = 'all_upfront'
            t.areClose(0.282990, RDS_GENFunctions.RDS_AURORA_MYSQL(s, "db.r6g.xlarge"), 0.000001)
        })

        t.describe("RDS invalid settings", () => {
            let s = [
                ['region', 'us-east-1'],
                ['purchase_type', 'reserved'],
                ['purchase_term', '1'],
                ['payment_option', 'partial_upfront']
            ]

            t.willThrow(function() {
                RDS_GENFunctions.RDS_AURORA_MYSQL(s, "db.r1.2xlarge")
            }, "unable to find")

            t.willThrow(function() {
                RDS_GENFunctions.RDS_AURORA_MYSQL(s, undefined)
            }, "must specify a db instance")

            t.willThrow(function() {
                RDS_GENFunctions.RDS_AURORA_MYSQL_RI("db.r5.xlarge", "us-east-1", 2, "no_upfront")
            }, "purchase_term")
        })
    }

}
