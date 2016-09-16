#!/usr/bin/env bash
echo "Publish application to public cdn"
npm run build-web
aws s3 sync web/build s3://liive-cdn --acl public-read

echo "Deployed to: https://s3-us-west-2.amazonaws.com/liive-cdn/index.html"
echo "Available at https://liive.in"