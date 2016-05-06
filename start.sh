#!/bin/bash

if [[ -z "$AWS_CERT" && -z "$AWS_PRIVATE_KEY" && -z "$AWS_ROOT_CA" && -z "$HALT" ]]
then
  curl –silent https://www.symantec.com/content/en/us/enterprise/verisign/roots/VeriSign-Class%203-Public-Primary-Certification-Authority-G5.pem > /data/rootCA.pem >/dev/null 2>&1
  echo "Creating AWS certificates"
  curl -X POST -H "Cache-Control: no-cache" -d '{ "uuid": "'$RESIN_DEVICE_UUID'", "attributes": { "someKey": "someVal" } }' $LAMBDA
elif [[ "$AWS_CERT" && "$AWS_PRIVATE_KEY" && "$AWS_ROOT_CA" ]]
  then
    echo "AWS certificates exist - running app"
    node /usr/src/app/server.js
fi
