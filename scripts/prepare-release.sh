#!/bin/bash
#
# Prepare a new version for release.
#

[[ "${npm_lifecycle_event}" != "release" ]] && \
    echo "Run this script via: 'npm run release'" && \
    exit 1

release_message="${1-New release}"
releast_date=`date '+%F'`

clasp_output=`clasp version "${releast_date}: ${release_message}"`

[[ $? -ne 0 ]] && \
    echo "Failed to create new version" && \
    exit 1

echo $clasp_output | sed 's/.*Created version//g' | sed  's/[^0-9]*//g'

#
# TODO - Revisit git tags
#

# NEW_VERSION=`echo $clasp_output | sed 's/.*Created version//g' | sed  's/[^0-9]*//g'`
# GIT_TAG="v${NEW_VERSION}_${releast_date}"
# git tag -a $GIT_TAG -m "${release_message}"
