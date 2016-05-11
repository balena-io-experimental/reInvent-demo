#!/bin/bash
modprobe i2c-dev
if [ "$HALT" == "1" ]; then
  echo "HALT don't do anything"
else
  if [[ -z "$AWS_CERT" && -z "$AWS_PRIVATE_KEY" ]]
  then
    echo "Creating AWS certificates"
    curl -X POST -H "Cache-Control: no-cache" -d '{ "uuid": "'$RESIN_DEVICE_UUID'", "attributes": { "someKey": "someVal" } }' $LAMBDA
  elif [[ "$AWS_CERT" && "$AWS_PRIVATE_KEY" && "$AWS_ROOT_CA" ]]
    then
      echo "AWS certificates exist - running app"
      node /usr/src/app/server.js
  fi
fi
