#!/usr/bin/env bash
if [ "$ANDROID_HOME" = "" ]
then
   echo "IOS BUILD----------------------------"
else
   echo "ANDROID BUILD------------------------"
   rm -f package.json
   cp -f package-native.json package.json
fi
