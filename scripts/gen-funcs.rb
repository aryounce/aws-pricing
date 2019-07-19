#!/usr/bin/env ruby

from = File.expand_path(File.dirname(__FILE__))
topdir = File.join(from, "..")

outfilename = 'ec2_ri_gen.ts'
outfile = File.join(topdir, 'src/functions/gen', outfilename)

f = File.open(outfile, File::CREAT|File::TRUNC|File::WRONLY, 0644)

f.write <<~EOF
/* DO NOT EDIT -- this file is generated */

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
