#!/usr/bin/env bash
if [ "$ANDROID_HOME" = "" ]
then
   echo "IOS BUILD----------------------------"
else
   echo "ANDROID BUILD------------------------"
   rm -f package.json
   cp -f package-native.json package.json
fi
# Example: Expose the commit SHA accessible through $GIT_REVISION_SHA Environment Variable
export GIT_REVISION_SHA=$(git rev-parse HEAD)

# Example: Expose the commit author & email through the $GIT_REVISION_AUTHOR in the following format: Author Name <author@example.com>
export GIT_REVISION_AUTHOR=$(git log -1 --pretty=format:"%an <%ae>")
echo "revision: $GIT_REVISION_SHA"
echo "author: $GIT_REVISION_AUTHOR"
