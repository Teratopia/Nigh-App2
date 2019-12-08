/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import io from 'socket.io-client/dist/socket.io';   //
import apiSettings from './constants/apiSettings';
import ParentScreen from './screens/ParentScreen';

const App: () => React$Node = () => {
  let socket = io(apiSettings.awsProxy, {jsonp : false});
  socket.on('connect', () => {});
  return  <ParentScreen socket={socket}/>
};

export default App;