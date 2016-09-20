if (!window.navigator.userAgent) {
  window.navigator.userAgent = "react-native";
}
import { AppRegistry } from 'react-native';

let MainApp = require('./app/components/MainApp');

AppRegistry.registerComponent('MainApp', () => MainApp);

// 'use strict';
//
// import { AppRegistry, StatusBar } from 'react-native'
// import setup from './js/setup'
//
// StatusBar.setBarStyle('light-content');
// AppRegistry.registerComponent('MainApp', setup);
