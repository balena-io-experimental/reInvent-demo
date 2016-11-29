'use strict'
const awsIot = require('aws-iot-device-sdk')
const io = require('./server') // websocket server
const iwlist = require('wireless-tools/iwlist')
const _ = require('lodash')
const pitft = require("pitft")
const chrom = require("chroma-js")

const TOPIC = 'wifi'

const scale = chroma.scale(['lightyellow', 'navy']).domain([ 0, -80 ]);

const fb = pitft("/dev/fb1") // Returns a framebuffer in direct mode.  See the clock.js example for double buffering mode
// Clear the screen buffer
fb.clear();
var xMax = fb.size().width;
var yMax = fb.size().height;

const device = awsIot.device({
privateKey: new Buffer(process.env.AWS_PRIVATE_KEY, 'base64'),
clientCert: new Buffer(process.env.AWS_CERT, 'base64'),
    caCert: new Buffer(process.env.AWS_ROOT_CA, 'base64'),
  clientId: process.env.RESIN_DEVICE_UUID,
    region: process.env.AWS_REGION
})

device.on('connect', function() {
  var data
  // subscribe to TOPIC mqtt topic
  device.subscribe(TOPIC)

  // publish reading on TOPIC
  setInterval(function () {
    iwlist.scan(process.env.INTERFACE || 'wlan0', function(err, networks) {
      if (err)
        return err

      // scan local networks for specific ssid or pick first one
      let n = _.find(networks, ['ssid', process.env.SSID]) || networks[0]

      data = {
        name: `${process.env.RESIN_DEVICE_UUID.slice(0, 7)}-${n.ssid}`, // shorten uuid and concat network name
        signal: n.signal,
        ts: Date.now()
      }

      device.publish(TOPIC, JSON.stringify(data))
      displayWifi(n)
    })
  }, process.env.INTERVAL || 3000)
})

// receive all messages & forward them to all browser clients
device.on('message', function(topic, payload) {
  console.log('message: ', topic, payload.toString())
  io.sockets.emit('data', JSON.parse(payload.toString()))
})

const displayWifi = function(network){
  let rgb = scale(network.signal).hex();
  fb.font("fantasy", 24, true); // Use the "fantasy" font with size 24, and font weight bold, if available
  fb.clear();
  fb.color(rgb);
  fb.rect(0, 0, xMax, yMax, true); // Draw a filled rectangle
  fb.color(0, 0, 0);
  fb.text(xMax/2, yMax/2-24, network.ssid, true, 0);
  fb.text(xMax/2, yMax/2, "Q: "+network.quality+"/70", true, 0);
}
