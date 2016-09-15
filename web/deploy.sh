#!/usr/bin/env bash
echo "deploy application to private cdn"
npm run build-web
aws s3 sync web/build s3://liive-cdn
