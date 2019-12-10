import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
//import SocketIOClient from 'socket.io-client';
import io from 'socket.io-client/dist/socket.io';   //
import { GiftedChat } from 'react-native-gifted-chat';    //
import Helper from '../helpers/giftedChatHelper';
import apiSettings from '../constants/apiSettings';
import PushNotificationIOS from "@react-native-community/push-notification-ios";


const USER_ID = '@userId';

class SocketGiftedChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userId: null
    };  

    this.onReceivedMessage = this.onReceivedMessage.bind(this);
    this.onSocketConnect = this.onSocketConnect.bind(this);
    this.onSend = this.onSend.bind(this);
    this._storeMessages = this._storeMessages.bind(this);

    this.socket = this.props.socket;
    //this.socket.on('connect', this.onSocketConnect);
    this.socket.on('chat message', this.onReceivedMessage);
  }

    componentWillMount() {
        if(this.props.chat){
            console.log('this.props.chat = ');
            console.log(this.props.chat);
            console.log('this.props.messages = ');
            console.log(this.props.messages);
            this._storeMessages(this.props.messages);
            /*
            Helper.reformatMessages(this.props.chat).then(res => {
              console.log('component will mount res = '. res);
              this._storeMessages(res);
            }).catch(err => {
              console.log('err, ', err);
            })
            */
        }
        if(this.props.user){
            this.setState({userId : this.props.user._id});
        }
        this.onSocketConnect();
    }

    onSocketConnect(){
        this.socket.emit('room', this.props.chat._id);
    }

  // Event listeners
  /**
   * When the server sends a message to this.
   */
  onReceivedMessage(messages) {
      console.log('onReceivedMessage messages = ', messages);
      PushNotificationIOS.presentLocalNotification({alertTitle : 'test', alertBody : 'test'});
      if(!Array.isArray(messages)){
          console.log('onReceivedMessage 1' );
          messages = [messages];
      }
      console.log('onReceivedMessage 2' );
    this._storeMessages(messages);
  }

  /**
   * When a message is sent, send the message to the server
   * and store it in this component's state.
   */
  onSend(messages=[]) {
    console.log('foo messages[0]');
    console.log(messages[0]);
    this.socket.emit('chat message', messages[0]);
    this._storeMessages(messages);
  }

  render() {
    var user = { _id: this.state.userId || -1};

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={user}
        renderAvatar={null}
      />
    );
  }

  // Helper functions
  _storeMessages(messages) {
      console.log('storeMessages messages = ');
      console.log(messages);
      this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
  }

  componentWillUnmount() {
    this.socket.emit('leaveRoom', this.props.chat._id);
  }
}

module.exports = SocketGiftedChat;