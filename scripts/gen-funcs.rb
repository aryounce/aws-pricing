#!/usr/bin/env ruby

def create_file(filename)
    f = File.open(filename, File::CREAT|File::TRUNC|File::WRONLY, 0664)

    f.write "/* DO NOT EDIT -- this file is generated */\n"
    f.write "\n"

    f
end 

#
# EC2 RI functions
#
def gen_ec2_ri(func_dir)
    outfilename = 'ec2_ri_gen.ts'
    outfile = File.join(func_dir, outfilename)
    
    f = create_file(outfile)
    
    f.write <<~EOF
    import { EC2_RI } from "../ec2_ri";
    import { EC2Platform } from "../../models/ec2_platform";
    
    EOF
    
    platforms = ["linux", "rhel", "suse", "windows"]
    ri_classes = {
        "convertible" => "conv",
        "standard" => "std"
    }
    
    payment_options = {
        "no_upfront" => "no",
        "partial_upfront" => "partial",
        "all_upfront" => "all"
    }
    
    platforms.each do |platform|
        ri_classes.each do |ri_class|
            payment_options.each do |payment_option|
                func = <<~EOF
                /**
                 * Returns the RI pricing for an instance type with a #{ri_class[0]}, #{payment_option[0].gsub("_", "-")} RI using #{platform}.
                 *
                 * @param {"m5.xlarge"} instanceType
                 * @param {"us-east-2"} region
                 * @param purchaseTerm in years (1 or 3)
                 * @returns price
                 * @customfunction
                 */
                export function EC2_#{platform.upcase}_#{ri_class[1].upcase}_RI_#{payment_option[1].upcase}(instanceType: string, region: string, purchaseTerm: string) {
                    return EC2_RI(instanceType, region, "#{platform}", "#{ri_class[0]}", purchaseTerm, "#{payment_option[0]}")
                }
    
                EOF
                f.write(func)
            end
        end
    end
    
    sql_platforms = ["linux", "windows"]
    
    sql_platforms.each do |sql_platform|
        ri_classes.each do |ri_class|
            payment_options.each do |payment_option|
                func = <<~EOF
                /**
                 * Returns the RI pricing for an instance type with a #{ri_class[0]}, #{payment_option[0].gsub("_", "-")} RI using #{sql_platform} SQL.
                 *
                 * @param {"m5.xlarge"} instanceType
                 * @param {"us-east-2"} region
                 * @param {"web"} sqlLicense (std, web, or enterprise)
                 * @param purchaseTerm in years (1 or 3)
                 * @returns price
                 * @customfunction
                 */
                export function EC2_#{sql_platform.upcase}_MSSQL_#{ri_class[1].upcase}_RI_#{payment_option[1].upcase}(instanceType: string, region: string, sqlLicense: string, purchaseTerm: string) {
                    return EC2_RI(instanceType, region, EC2Platform.msSqlLicenseToType("#{sql_platform}", sqlLicense), "#{ri_class[0]}", purchaseTerm, "#{payment_option[0]}")
                }
    
                EOF
                f.write(func)
            end
        end
    end
    
    f.close
end

def gen_ebs(func_dir)
    outfilename = 'ec2_ebs_gen.ts'
    outfile = File.join(func_dir, outfilename)
    
    f = create_file(outfile)
    
    f.write <<~EOF
    import { EC2_EBS_GB } from "../ebs";

    EOF

    vol_types = ['magnetic', 'gp2', 'st1', 'sc1', 'io1']

    vol_types.each do |vol_type|
        vol_type_up = vol_type.upcase
        func = <<~EOF
        /**
         * Returns the monthly cost for the amount of provisioned EBS #{vol_type_up} storage Gigabytes
         * 
         * @param {A2:B7} settingsRange Two-column range of default EC2 instance settings
         * @param size Size in GB of provisioned storage
         * @param {"us-east-2"} region Override region setting of settings (optional)
         * @returns monthly price
         * @customfunction
         */
        export function EC2_EBS_#{vol_type_up}_GB(settingsRange: Array<Array<string>>, size: string | number, region?: string): number;

        /**
        * Returns the monthly cost for the amount of provisioned EBS #{vol_type_up} storage Gigabytes
        * 
        * @param size Size in GB of provisioned storage
        * @param {"us-east-2"} region
        * @returns monthly price
        * @customfunction
        */
        export function EC2_EBS_#{vol_type_up}_GB(size: string | number, region: string): number;

        export function EC2_EBS_#{vol_type_up}_GB(settingsOrSize, sizeOrRegion, region?) {
            if (typeof settingsOrSize === "string" || typeof settingsOrSize === "number") {
                return EC2_EBS_GB("#{vol_type}", settingsOrSize.toString(), sizeOrRegion)
            } else {
                return EC2_EBS_GB(settingsOrSize, "#{vol_type}", sizeOrRegion, region)
            }
        }

        EOF
        f.write(func)
    end

    f.close
end

def gen_rds(func_dir)
    outfilename = 'rds_gen.ts'
    outfile = File.join(func_dir, outfilename)
    
    f = create_file(outfile)
    
    f.write <<~EOF
    import { _rds_settings, _rds_full } from "../rds";
    import { RDSDbEngine } from "../../models/rds_db_engine";

    EOF

    engines = {
        "AURORA_MYSQL" => "Aurora_Mysql",
        "AURORA_POSTGRESQL" => "Aurora_Postgresql",
        "MYSQL" => "Mysql",
        "POSTGRESQL" => "Postgresql",
        "MARIADB" => "Mariadb"
    }

    engines.each do |engine|
        func = <<~EOF
        /**
         * Returns the instance price for a #{engine[1]} RDS DB instance
         *
         * @param {A2:B7} settingsRange Two-column range of default EC2 instance settings
         * @param {"db.r4.xlarge"} instanceType Type of RDS instance
         * @param {"us-east-2"} region Override the region setting (optional)
         * @returns price
         * @customfunction
         */
        export function RDS_#{engine[0].upcase}(settingsRange: Array<Array<string>>, instanceType: string, region?: string) {
            return _rds_settings(settingsRange, RDSDbEngine.#{engine[1]}, instanceType, region)
        }

        /**
         * Returns the on-demand instance price for a #{engine[1]} RDS DB instance
         *
         * @param {"db.r4.xlarge"} instanceType Type of RDS instance
         * @param {"us-east-2"} region AWS region of instance
         * @returns price
         * @customfunction
         */
        export function RDS_#{engine[0].upcase}_OD(instanceType: string, region: string) {
            return _rds_full(RDSDbEngine.#{engine[1]}, instanceType, region, 'ondemand')
        }

        /**
         * Returns the reserved instance price for a #{engine[1]} RDS DB instance
         *
         * @param {"db.r4.xlarge"} instanceType Type of RDS instance
         * @param {"us-east-2"} region AWS region of instance
         * @param purchaseTerm Duration of RI in years (1 or 3)
         * @param paymentOption Payment terms (no_upfront, partial_upfront, all_upfront)
         * @returns price
         * @customfunction
         */
        export function RDS_#{engine[0].upcase}_RI(instanceType: string, region: string, purchaseTerm: string | number, paymentOption: string) {
            return _rds_full(RDSDbEngine.#{engine[1]}, instanceType, region, 'reserved', purchaseTerm, paymentOption)
        }

        EOF
        f.write(func)

        
        payment_options = {
            "no_upfront" => "no",
            "partial_upfront" => "partial",
            "all_upfront" => "all"
        }

        payment_options.each do |payment_option|
            func = <<~EOF
            /**
            * Returns the reserved instance price for a #{engine[1]} RDS DB instance with #{payment_option[0]} payment
            *
            * @param {"db.r4.xlarge"} instanceType Type of RDS instance
            * @param {"us-east-2"} region AWS region of instance
            * @param purchaseTerm Duration of RI in years (1 or 3)
            * @returns price
            * @customfunction
            */
            export function RDS_#{engine[0].upcase}_RI_#{payment_option[1].upcase}(instanceType: string, region: string, purchaseTerm: string | number) {
                return _rds_full(RDSDbEngine.#{engine[1]}, instanceType, region, 'reserved', purchaseTerm, "#{payment_option[0]}")
            }
            EOF
            f.write(func)
        end
    end

    f.close
end

def gen_rds_storage(func_dir)
    outfilename = 'rds_storage_gen.ts'
    outfile = File.join(func_dir, outfilename)

    f = create_file(outfile)

    f.write <<~EOF
    import { RDS_STORAGE_GB } from "../rds_storage";

    EOF

    voltypes = ["aurora", "gp2", "piops", "magnetic"]

    voltypes.each do |voltype|
        func = <<~EOF
        /**
         * Returns the price of RDS storage for volume type #{voltype}.
         *
         * @param {A2:B7} settingsRange Two-column range of default EC2 instance settings
         * @param volumeSize Size of the volume in Gigabytes
         * @param {"us-east-2"} region Override the region from the settings range (optional)
         * @returns price
         * @customfunction
         */
        export function RDS_STORAGE_#{voltype.upcase}_GB(settingsRange: Array<Array<string>>, volumeSize: string|number, region?: string): number;

        /**
         * Returns the price of RDS storage for volume type #{voltype}.
         *
         * @param volumeSize Size of the volume in Gigabytes
         * @param {"us-east-2"} region
         * @returns price
         * @customfunction
         */
        export function RDS_STORAGE_#{voltype.upcase}_GB(volumeSize: string|number, region: string): number;

        export function RDS_STORAGE_#{voltype.upcase}_GB(settingsOrSize, sizeOrRegion, region?: string): number {
            if (typeof settingsOrSize === "string" || typeof settingsOrSize === "number") {
                return RDS_STORAGE_GB("#{voltype}", settingsOrSize, sizeOrRegion)
            } else {
                return RDS_STORAGE_GB(settingsOrSize, "#{voltype}", sizeOrRegion, region)
            }
        }
        EOF
        f.write(func)
    end

    f.close
end

#
# MAIN
#

from = File.expand_path(File.dirname(__FILE__))
topdir = File.join(from, "..")

func_dir = File.join(topdir, 'src/functions/gen')

gen_ec2_ri(func_dir)
gen_ebs(func_dir)
gen_rds(func_dir)
gen_rds_storage(func_dir)