/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {View} from 'react-native';
import ParentScreen from './screens/ParentScreen';

const App: () => React$Node = () => {
  return  <View style={{flex:1}}>
            <ParentScreen/>
          </View>  
};

export default App;