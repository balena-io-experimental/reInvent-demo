var awsIot = require('aws-iot-device-sdk');
var Chance = require('chance'); // used to randomize bool values
    chance = new Chance();

var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var lightSensor

var board = new Board({
    debug: true,
    onError: function(err) {
      console.log('Something wrong just happened')
      console.log(err)
    },
    onInit: function(res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version())

        lightSensor = new LightAnalogSensor(2)
        console.log('Light Analog Sensor (start watch)')

      }
    }
  })

board.init()

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
  device.subscribe('topic_1');

  // publish data every second
  setInterval(function () {
    // if (process.env.SENSOR) {
    //   var reading = chance.floating({min: 0, max: 100});
    // } else {
    //   var reading = chance.floating({min: 0, max: 100});
    // }
    console.log(lightSensor.read())

    // device.publish('topic_1', JSON.stringify({ temperature: reading }));
  }, 5000);
});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});
