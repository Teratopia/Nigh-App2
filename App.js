import React from 'react';
import {View} from 'react-native';
import io from 'socket.io-client/dist/socket.io';
import apiSettings from './constants/apiSettings';
import ParentScreen from './screens/ParentScreen';
import FlashMessage from "react-native-flash-message";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };  
    this.socket = io(apiSettings.awsProxy, {jsonp : false});
    this.socket.on('connect', () => {});
  }
  
  render() {
    return <View style={{flex : 1}}>
      <ParentScreen socket={this.socket} setUser={user => {this.setState({user : user})}}/>
      <FlashMessage position="top"/>
    </View>
    
  }
}

export default App;



/*
const App: () => React$Node = () => {
  componentDidMount() {
    //BackgroundTask.schedule()
  }
  let socket = io(apiSettings.awsProxy, {jsonp : false});
  socket.on('connect', () => {});
  return  <ParentScreen socket={socket}/>
};
*/