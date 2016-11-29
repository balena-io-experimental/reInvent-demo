'use strict'
const awsIot = require('aws-iot-device-sdk')
const io = require('./server') // websocket server
const iwlist = require('wireless-tools/iwlist')
const _ = require('lodash')
const lcd = require('./lcd')
const TOPIC = 'wifi'

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
      lcd.display(n)
      console.log('pushed reading: ', topic, JSON.stringify(data))
    })
  }, process.env.INTERVAL || 3000)
})

// receive all messages & forward them to all browser clients
device.on('message', function(topic, payload) {
  io.sockets.emit('data', JSON.parse(payload.toString()))
})
