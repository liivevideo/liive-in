# liive.in

Application source code for liive.in: https://github.com/liivevideo.com/liive.in.git

## Setup 

`npm install`.  

The application requires that a "signal server" be running to support handshaking between instances that want to share video, audio and text communications.
The application is currently pointed to https://signal.liive.in deployed from the code base https://github.com/liivevideo.com/signal.liive.in.git

## Run

The iOS applications requires that the react packager be started manually with `npm start`. Note that the android runner will start this automatically.

- iOS: The iOS simulator can't use the camera, so the program must be run in Xcode. 
Run `npm start` and open the project in the ios directory. 
The iOS simulator can be used if `navigator.getUserMedia({"audio": true, "video": false})` is set so that video is not used.
- Android: connect a real device or start an android simulator and run `npm run android` .  
- Chrome `npm run build-chrome` produces a bundle for /chrome/src. Put chrome into developer mode and then go to chrome://extensions and load the chrome application from the /chrome directory.  
- Web (Server based) `npm run build-web` in the directory.  This produces a bundle.js file in the web/src directory. 

## Deployment

#### Signal Server:

The submodule checked out to the "server" directory is deployed from https://github.com/liivevideo/signal-liive-in to Heroku.
The signal server acts as the application web server and is available at: https://liive.in
When this repository's master branch is pushed to origin, it is published.

TODO::
* Deploy a development signal server.
* Rollback

#### Web:

The web application is deployed to a public CDN at AWS S3.

Production---> https://s3-us-west-2.amazonaws.com/liive-cdn/index.html
Development---> https://s3-us-west-2.amazonaws.com/develop-liive-cdn/index.html

Currently, both use the same signal server at https://liive.in
The production version can be reached by navigating to the signal server: https://liive.in.

TODO: :
* Keep versions for rollback.

#### iOS: 

The iOS version is deployed via BuildBuddy.

There are two targets built at BuildBuddy, one intended for production, the other for review: ```Liive.In``` and ```Liive.In Internal```
The third target is a local build target ```iOSNativeApp```

Both BuildBuddy pipelines build and deploy an internal scheme from the develop branch and a production scheme from the master branch.

#### Android

The Android version is deployed via BuildBuddy.

#### ChromeOS

The ChromeOS doesn't have continuous deployment yet.

TODO::
* Authentication
* Signup
* Design
* Interaction