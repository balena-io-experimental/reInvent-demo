'use strict'
var awsIot = require('aws-iot-device-sdk');
var Chance = require('chance'); // used to randomize bool values
var chance = new Chance();

var device = awsIot.device({
privateKey: new Buffer(process.env.AWS_PRIVATE_KEY, 'base64'),
clientCert: new Buffer(process.env.AWS_CERT, 'base64'),
    caCert: new Buffer(process.env.AWS_ROOT_CA, 'base64'),
  clientId: process.env.RESIN_DEVICE_UUID,
    region: process.env.AWS_REGION
});

device.on('connect', function() {
  console.log('connect');
  device.subscribe('sensor');
  // publish data
  setInterval(function () {
    var reading = chance.floating({min: 0, max: 200});
		device.publish('sensor', JSON.stringify({ reading: reading }));
  }, process.env.INTERVAL || 3000);
});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});
