var awsIot = require('aws-iot-device-sdk');
var eol = require('eol'); // used to fix line endings in the CA cert
var Chance = require('chance'); // used to randomize bool values
    chance = new Chance();

var pattern = /#####/g;
var fs = require('fs');
var bufferEqual = require('buffer-equal');
//
// var device = awsIot.device({
// privateKey: new Buffer(process.env.AWS_PRIVATE_KEY.replace(pattern, '\n')),
// clientCert: new Buffer(process.env.AWS_CERT.replace(pattern, '\n')),
//     caCert: new Buffer(eol.crlf(process.env.AWS_ROOT_CA.replace(pattern, '\n'))),
//   clientId: process.env.RESIN_DEVICE_UUID,
//     region: process.env.AWS_REGION
// });
//
// device.on('connect', function() {
//   console.log('connect');
//   device.subscribe('topic_1');
//
//   // publish data every second
//   setInterval(function () {
//     var bool = chance.bool({likelihood: 10});
//     device.publish('topic_1', JSON.stringify({ test_data: bool }));
//   }, 5000);
// });
//
// device.on('message', function(topic, payload) {
//   console.log('message', topic, payload.toString());
// });

process.env.TEST = "-----BEGIN CERTIFICATE-----#####MIIE0zCCA7ugAwIBAgIQGNrRniZ96LtKIVjNzGs7SjANBgkqhkiG9w0BAQUFADCB#####yjELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQL#####ExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJp#####U2lnbiwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxW#####ZXJpU2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0#####aG9yaXR5IC0gRzUwHhcNMDYxMTA4MDAwMDAwWhcNMzYwNzE2MjM1OTU5WjCByjEL#####MAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQLExZW#####ZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJpU2ln#####biwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxWZXJp#####U2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0aG9y#####aXR5IC0gRzUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvJAgIKXo1#####nmAMqudLO07cfLw8RRy7K+D+KQL5VwijZIUVJ/XxrcgxiV0i6CqqpkKzj/i5Vbex#####t0uz/o9+B1fs70PbZmIVYc9gDaTY3vjgw2IIPVQT60nKWVSFJuUrjxuf6/WhkcIz#####SdhDY2pSS9KP6HBRTdGJaXvHcPaz3BJ023tdS1bTlr8Vd6Gw9KIl8q8ckmcY5fQG#####BO+QueQA5N06tRn/Arr0PO7gi+s3i+z016zy9vA9r911kTMZHRxAy3QkGSGT2RT+#####rCpSx4/VBEnkjWNHiDxpg8v+R70rfk/Fla4OndTRQ8Bnc+MUCH7lP59zuDMKz10/#####NIeWiu5T6CUVAgMBAAGjgbIwga8wDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8E#####BAMCAQYwbQYIKwYBBQUHAQwEYTBfoV2gWzBZMFcwVRYJaW1hZ2UvZ2lmMCEwHzAH#####BgUrDgMCGgQUj+XTGoasjY5rw8+AatRIGCx7GS4wJRYjaHR0cDovL2xvZ28udmVy#####aXNpZ24uY29tL3ZzbG9nby5naWYwHQYDVR0OBBYEFH/TZafC3ey78DAJ80M5+gKv#####MzEzMA0GCSqGSIb3DQEBBQUAA4IBAQCTJEowX2LP2BqYLz3q3JktvXf2pXkiOOzE#####p6B4Eq1iDkVwZMXnl2YtmAl+X6/WzChl8gGqCBpH3vn5fJJaCGkgDdk+bW48DW7Y#####5gaRQBi5+MHt39tBquCWIMnNZBU4gcmU7qKEKQsTb47bDN0lAtukixlE0kF6BWlK#####WE9gyn6CagsCqiUXObXbf+eEZSqVir2G3l6BFoMtEMze/aiCKm0oHw0LxOXnGiYZ#####4fQRbxC1lfznQgUy286dUV4otp6F01vvpX1FQHKOtw5rDgb7MzVIcbidJ4vEZV8N#####hnacRHr2lVz2XTIIM6RUthg/aFzyQkqFOFSDX9HoLPKsEdao7WNq#####-----END CERTIFICATE-----"

fs.readFile('/data/rootCA.pem', 'utf8', function read(err, data) {
    if (err) {
        throw err;
    }
    // console.log(new Buffer());
    run(data)
});


function run(data) {
  //
  // console.log(data);
  console.log(process.env.AWS_CERT)
  // console.log(process.env.TEST);
  console.log(process.env.AWS_ROOT_CA);
  console.dir(bufferEqual(
      new Buffer(process.env.TEST.replace(pattern, '\r\n')),
      new Buffer(process.env.AWS_ROOT_CA.replace(pattern, '\r\n'))
  ));
  console.log(new Buffer(process.env.TEST.replace(pattern, '\r\n')));
  console.log(new Buffer(process.env.AWS_ROOT_CA.replace(pattern, '\r\n')));

  // var pattern = /#####/g;
  // console.dir(bufferEqual(
  //     new Buffer(data),
  //     new Buffer((process.env.AWS_ROOT_CA.replace(pattern, '\r\n')))
  // ));
}
