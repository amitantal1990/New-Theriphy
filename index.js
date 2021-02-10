/**
 * @format
 */

import {AppRegistry, TextInput, Text} from 'react-native';
// import App from './App';
import App from './src';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
TextInput.defaultProps.allowFontScaling = false
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
AppRegistry.registerComponent(appName, () => App);
