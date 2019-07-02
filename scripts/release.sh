#!/bin/bash

if [ "${npm_lifecycle_event}" != "release" ]; then
    echo "ERROR: Only run this script from npm: 'npm run release'"
    exit 1
fi

if [ $# -ne 1 ]; then
    echo "ERROR: Specify version message, eg: 'npm run release -- \"New function support\"'"
    exit 1
fi

MSG="$1"
DATE=`date '+%F'`

RELEASE_MSG="${DATE}: ${MSG}"

CLASP_OUTPUT=`clasp version "$RELEASE_MSG"`

if [ $? -ne 0 ]; then
    echo "Failed to create new version"
    exit 1
fi

NEW_VERSION=`echo $CLASP_OUTPUT | sed 's/.*Created version//g' | sed  's/[^0-9]*//g'`

echo "Created new version: $NEW_VERSION ($RELEASE_MSG)"

GIT_TAG="v${NEW_VERSION}_${DATE}"

git tag -a $GIT_TAG -m "${MSG}" && \
git push origin $GIT_TAG
