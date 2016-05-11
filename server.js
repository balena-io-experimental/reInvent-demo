var awsIot = require('aws-iot-device-sdk');
var Chance = require('chance'); // used to randomize bool values
    chance = new Chance();
var sensors = require('ds1820-temp');

var pattern = /#####/g;

var device = awsIot.device({
privateKey: new Buffer(process.env.AWS_PRIVATE_KEY.replace(pattern, '\n')),
clientCert: new Buffer(process.env.AWS_CERT.replace(pattern, '\n')),
    caCert: new Buffer(process.env.AWS_ROOT_CA.replace(pattern, '\r\n')),
  clientId: process.env.RESIN_DEVICE_UUID,
    region: process.env.AWS_REGION
});

device.on('connect', function() {
  console.log('connect');
  device.subscribe('sensor');

  // publish data every second
  setInterval(function () {
		var reading = null
    if (process.env.SENSOR) {
			// promise based
			sensors.readDevices().then(
				function (devices) {
					reading = devices[0].value
					device.publish('sensor', JSON.stringify({ reading: reading }));
				},
				function (err) {
					console.log('An error occurred while reading sensor: ', err);
				}
			);
    } else {
      reading = chance.floating({min: 0, max: 200});
			device.publish('sensor', JSON.stringify({ reading: reading }));
    }

  }, 3000);
});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});
