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
                 * @param instanceType
                 * @param region
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
                 * @param instanceType
                 * @param region
                 * @param sqlLicense (std, web, or enterprise)
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
         * @param settingsRange Two-column range of default EC2 instance settings
         * @param size Size in GB of provisioned storage
         * @param region Override region setting of settings (optional)
         * @returns monthly price
         * @customfunction
         */
        export function EC2_EBS_#{vol_type_up}_GB(settingsRange: Array<Array<string>>, size: string | number, region?: string): number;

        /**
        * Returns the monthly cost for the amount of provisioned EBS #{vol_type_up} storage Gigabytes
        * 
        * @param size Size in GB of provisioned storage
        * @param region
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

#
# MAIN
#

from = File.expand_path(File.dirname(__FILE__))
topdir = File.join(from, "..")

func_dir = File.join(topdir, 'src/functions/gen')

gen_ec2_ri(func_dir)
gen_ebs(func_dir)