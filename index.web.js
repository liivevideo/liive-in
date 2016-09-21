//
if (!window.navigator.userAgent) {
  window.navigator.userAgent = "react-native";
}

import { AppRegistry } from 'react-native';

let MainApp = require('./app/components/MainApp');

AppRegistry.registerComponent('MainApp', () => MainApp);
AppRegistry.runApplication('MainApp', {
    rootTag: document.getElementById('react-root')
})


