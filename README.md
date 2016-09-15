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

The web version of the application is deployed on heroku and can be reached by opening https://liive.in.   

TODO: 
* Continuous deployment 
* Server/CDN cleanup.
 
 
 Build Buddy:
 
 curl -s https://dashboard.buddybuild.com/api/apps/find-my-certs/57dad51a10d0600100b4801e | sh
 