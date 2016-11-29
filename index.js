'use strict'
const awsIot = require('aws-iot-device-sdk')
const io = require('./server') // websocket server
const iwlist = require('wireless-tools/iwlist')
const _ = require('lodash')




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

      n = _.find(networks, ['ssid', process.env.SSID]) || networks[0]

      data = {
        deviceName: process.env.RESIN_DEVICE_NAME_AT_INIT ,
        deviceUUID: process.env.RESIN_DEVICE_UUID,
        reading: n.signal,
        ts: Date.now()
      }
      device.publish(TOPIC, JSON.stringify(data))
    })
  }, process.env.INTERVAL || 3000)
})

// receive all messages & forward them to all browser clients
device.on('message', function(topic, payload) {
  console.log('message: ', topic, payload.toString())
  io.sockets.emit('data', JSON.parse(payload.toString()))
})
