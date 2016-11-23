#!/bin/bash
if [ "$HALT" == "1" ]; then
  echo "HALT don't do anything"
else
  if [[ -z "$AWS_CERT" && -z "$AWS_PRIVATE_KEY" && -z "$AWS_ROOT_CA" ]]
  then
    echo "Creating AWS certificates"
    curl -X POST -H "Cache-Control: no-cache" \
    -d -v '{ "uuid": "'$RESIN_DEVICE_UUID'", "attributes": { "type": "rpi_3" } }' \
    $LAMBDA
  elif [[ "$AWS_CERT" && "$AWS_PRIVATE_KEY" && "$AWS_ROOT_CA" ]]
    then
      echo "AWS certificates exist - running app"
      node /usr/src/app/server.js
  fi
fi
