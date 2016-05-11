var awsIot = require('aws-iot-device-sdk');
var Chance = require('chance'); // used to randomize bool values
    chance = new Chance();

var GrovePi = require('node-grovepi').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board
var dhtSensor = new DHTDigitalSensor(3, DHTDigitalSensor.VERSION.DHT22, DHTDigitalSensor.CELSIUS)

var board = new Board({
    debug: true,
    onError: function(err) {
      console.log('Something wrong just happened')
      console.log(err)
    },
    onInit: function(res) {
      if (res) {
        console.log('GrovePi Version :: ' + board.version())

        console.log('DHT Digital Sensor (start watch)')
        dhtSensor.on('change', function(res) {
          console.log('DHT onChange value=' + res)
        })
        dhtSensor.watch(500) // milliseconds
      }
    }
  })

var pattern = /#####/g;

var device = awsIot.device({
privateKey: new Buffer(process.env.AWS_PRIVATE_KEY.replace(pattern, '\n')),
clientCert: new Buffer(process.env.AWS_CERT.replace(pattern, '\n')),
    // caCert: new Buffer(process.env.AWS_ROOT_CA.replace(pattern, '\r\n')),
    caPath: "/data/rootCA.pem",
  clientId: process.env.RESIN_DEVICE_UUID,
    region: process.env.AWS_REGION
});

device.on('connect', function() {
  console.log('connect');
  device.subscribe('topic_1');

  // publish data every second
  setInterval(function () {
    if (process.env.SENSOR) {
      var reading = chance.floating({min: 0, max: 100});
    } else {
      var reading = chance.floating({min: 0, max: 100});
    }

    device.publish('topic_1', JSON.stringify({ temperature: reading }));
  }, 5000);
});

device.on('message', function(topic, payload) {
  console.log('message', topic, payload.toString());
});
