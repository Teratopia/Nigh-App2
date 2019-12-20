import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';             //
import Icon from 'react-native-vector-icons/Entypo';  //
import DeviceInfo from 'react-native-device-info';    

const NavigationFooter = props => {
    /*
  const [status, setLocalStatus] = useState(props.currentScreen ? props.currentScreen : 'SEARCH');

    const setStatus = value => {
        setLocalStatus(value);
        props.selectionChange(value);
    }
    */

    console.log('DeviceInfo.getModel() = '+DeviceInfo.getModel());
    let iphonexFooterView;
    if(DeviceInfo.getModel() === 'iPhone 11'){
      iphonexFooterView = <View style={styles.iphoneXHeader} />;
    }

      return (
        <View style={{width : '100%'}}>
          <View style={styles.notificationSettingRow}>
            <TouchableOpacity onPress={() => {props.selectionChange('STATUS')}} 
                              style={props.currentScreen === 'STATUS' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="user" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.selectionChange('SEARCH')}} 
                              style={props.currentScreen === 'SEARCH' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="compass" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {props.selectionChange('FRIENDS')}} 
                              style={props.currentScreen === 'FRIENDS' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="users" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Friends</Text>
            </TouchableOpacity>
          </View>
          {
            iphonexFooterView
          }    
        </View>

      );
  }
  
  const styles = StyleSheet.create({
      notificationSettingRow : {
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
      },
      activeButton : {
        flex : 1,
        backgroundColor : Colors.activeTeal,
        borderWidth : 2,
        borderColor : Colors.inactiveGrey,
        padding : 4,
        justifyContent : 'center',
        alignItems : 'center'
      },
      inactiveButton : {
        flex : 1,
        backgroundColor : Colors.inactiveGrey,
        borderWidth : 2,
        borderColor : Colors.inactiveGrey,
        padding : 4,
        justifyContent : 'center',
        alignItems : 'center'
      },
      textStyle : {
        fontSize : 10,
        color : 'white'
      },
      iphoneXHeader : {
        paddingVertical : 11,
        backgroundColor : 'black'
      }
    });

export default NavigationFooter;