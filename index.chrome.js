//
if (!window.navigator.userAgent) {
    window.navigator.userAgent = "react-native";
}
if (chrome !== undefined && chrome.storage !== undefined) {
    window.localStorage = chrome.storage.local;
}

import { AppRegistry } from 'react-native';

let MainApp = require('./app/components/MainApp');

AppRegistry.registerComponent('MainApp', () => MainApp);
AppRegistry.runApplication('MainApp', {
    rootTag: document.getElementById('react-root')
})
