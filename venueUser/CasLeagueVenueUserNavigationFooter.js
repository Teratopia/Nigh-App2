import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';   //
import Icon from 'react-native-vector-icons/Entypo';    //
import DeviceInfo from 'react-native-device-info';

const CasLeagueVenueUserNavigationFooter = props => {
    const [status, setLocalStatus] = useState('Settings');

    const setStatus = value => {
        props.setParentStatus(value);
        setLocalStatus(value);
    }

    console.log('DeviceInfo.getModel() = '+DeviceInfo.getModel());
    let iphonexFooterView;
    if(DeviceInfo.getModel() === 'iPhone 11'){
      iphonexFooterView = <View style={styles.iphoneXHeader} />;
    }

      return (
        <View style={{width : '100%'}}>
          <View style={styles.notificationSettingRow}>
            <TouchableOpacity onPress={() => {setStatus('Promotions')}} 
                              style={status === 'Promotions' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="ticket" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Promotions</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setStatus('Settings')}} 
                              style={status === 'Settings' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="cog" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setStatus('Statistics')}} 
                              style={status === 'Statistics' ?
                              styles.activeButton :
                              styles.inactiveButton
                              }>
                  <Icon name="line-graph" size={18} color="white" style={{marginTop : 4}}/>
                  <Text style={styles.textStyle}>Statistics</Text>
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

export default CasLeagueVenueUserNavigationFooter;