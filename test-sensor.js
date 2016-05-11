var sensors = require('ds1820-temp');

// promise based
sensors.readDevices().then(
  function (devices) {
    console.log('Read all devices', devices);
  },
  function (err) {
    console.log('An error occurred', err);
  }
);
