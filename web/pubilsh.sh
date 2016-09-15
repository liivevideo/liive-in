#!/usr/bin/env bash
echo "publish application to public cdn"
npm run build-web
aws s3 sync web/build s3://liive-cdn --acl public-read