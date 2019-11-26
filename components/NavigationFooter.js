import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';             //
import Icon from 'react-native-vector-icons/Entypo';  //

const NavigationFooter = props => {
    const [status, setLocalStatus] = useState('SEARCH');

    const setStatus = value => {
        setLocalStatus(value);
        props.selectionChange(value);
    }

      return (
        <View style={styles.notificationSettingRow}>
          <TouchableOpacity onPress={() => {setStatus('STATUS')}} 
                            style={status === 'STATUS' ?
                            styles.activeButton :
                            styles.inactiveButton
                            }>
                <Icon name="megaphone" size={18} color="white" style={{marginTop : 4}}/>
                <Text style={styles.textStyle}>Status</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setStatus('SEARCH')}} 
                            style={status === 'SEARCH' ?
                            styles.activeButton :
                            styles.inactiveButton
                            }>
                <Icon name="compass" size={18} color="white" style={{marginTop : 4}}/>
                <Text style={styles.textStyle}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setStatus('FRIENDS')}} 
                            style={status === 'FRIENDS' ?
                            styles.activeButton :
                            styles.inactiveButton
                            }>
                <Icon name="users" size={18} color="white" style={{marginTop : 4}}/>
                <Text style={styles.textStyle}>Friends</Text>
          </TouchableOpacity>
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
      }
    });

export default NavigationFooter;