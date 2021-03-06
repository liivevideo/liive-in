#!/usr/bin/env bash
echo "deploy application to private cdn"
npm run build-web
aws s3 sync web/build s3://develop-liive-cdn --acl public-read
echo "deployed to: https://s3-us-west-2.amazonaws.com/develop-liive-cdn/index.html"