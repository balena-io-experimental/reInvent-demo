### Device boilerplate for resin.io

This is device code for the [AWS and resin integration](https://github.com/craig-mulligan/resin-aws-lambda).

### Run

* [Sign up with resin.io and connect a device](http://docs.resin.io/#/pages/installing/gettingStarted.md)

* Add a few resin app environment variables

```
AWS_REGION = "us-east-1"
```
```
LAMBDA = "you lambda endpoint responsible for provisioning devices"
```

* Clone this repository
```
https://github.com/craig-mulligan/resin-aws-device
```

* Add your resin applications endpoint
```
git remote add resin <username>@git.resin.io:<username>/<appName>.git
```

* Push your code
```
git push resin master
```

Once your code downloads to the device it will automatically run your app. If the certificates needed to communicate with AWS aren't present it post it's RESIN_DEVICE_UUID to LAMBDA for the [provisioning process](https://github.com/craig-mulligan/resin-aws-lambda) if the certificates do exist it will automatically run the app.
