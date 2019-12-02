import React, {useState} from 'react';
import {Text, View, TextInput, Button, StyleSheet } from 'react-native';
import CasLeagueVenueHomeNewTablePicker from './CasLeagueVenueHomeNewTablePickers';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import Icon from 'react-native-vector-icons/Entypo';    //


const CasLeagueVenueViewTable = props => {

return <View style={{...styles.tablesView, 
marginVertical : 2
}}>
            <View style={styles.tablesViewHeader}>
                <Text style={{...styles.textStyle, fontSize : 16, fontWeight : '500', color : Colors.quasiBlack, flex : 1}}>
                    {props.table.name}
                </Text>
                <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {props.setTableToUpdate(props.table._id)}} style={{marginRight : 12}}/>
            </View>
            <View style={{...styles.tablesViewRow, marginBottom : 0, marginTop : 0}}>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <View style={{padding : 2}}>
                        <Button title={'$'+props.table.price.toFixed(2)} onPress={() => {props.setTableToUpdate(props.table._id)}} color={Colors.quasiBlack}/>
                    </View>
                </View>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <View style={{padding : 2}}>
                        <Button title={''+props.table.priceUnit} onPress={() => {props.setTableToUpdate(props.table._id)}} color={Colors.quasiBlack}/>
                    </View>
                </View>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <View style={{padding : 2}}>
                        <Button title={props.table.size} onPress={() => {props.setTableToUpdate(props.table._id)}} color={Colors.quasiBlack}/>
                    </View>
                    
                </View>
            </View>
        </View>  
}


const styles = StyleSheet.create({
    screen : {
      flex:1,
      alignItems: 'center',
      marginTop: getStatusBarHeight(),
    },
    parentView : {
        flex : 1,
        //width : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    contactDetailsView : {
      flex : 1,
      //width : '100%',
      justifyContent : 'center',
      alignItems : 'center'
    },
    optionsView : {
      flex : 6,
      //width : '100%',
      //justifyContent : 'space-evenly',
      alignItems : 'center',
      marginTop : 8,
      paddingTop : 4,
      borderTopColor : Colors.inactiveGrey,
      borderTopWidth : 1
    },
    textView : {
      marginVertical : 2,
    },
    textStyle : {
        color : Colors.quasiBlack,
        fontSize : 14
    },
  button : {
      //width : '100%', 
      borderWidth : 1, 
      borderRadius : 8, 
      borderColor : Colors.activeTeal, 
      backgroundColor : Colors.inactiveGrey,
      margin : 4,
  },
  tablesView : {
      marginHorizontal : 12,
      marginVertical : 2,
      borderRadius : 8,
      borderWidth : 1,
      borderColor : Colors.inactiveGrey,
      justifyContent : 'center',
      alignItems : 'center'
  },
  tablesViewHeader : {
      //flex : 1,
      flexDirection : 'row',
      justifyContent : 'space-between',
      borderBottomColor : Colors.inactiveGrey,
      borderBottomWidth : 1,
      marginTop : 8,
      marginHorizontal : 8,
      //width : '94%'
  },
  tablesViewRow : {
      //flex : 1,
      flexDirection : 'row',
      //width : '100%',
      margin : 8,
  },
  tablesViewTextInput : {
      flex : 1,
      borderWidth : 1,
      borderColor : Colors.quasiBlack,
      margin : 4,
      padding : 4,
      borderRadius : 8,
      textAlign : 'center'
  },
  pickerView: {
      flex:1,
      alignItems: 'center',
      width: '100%',
      justifyContent : 'center'
    },
  
  });

export default CasLeagueVenueViewTable;