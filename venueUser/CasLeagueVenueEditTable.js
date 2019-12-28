import React, {useState} from 'react';
import {Text, View, TextInput, Button, StyleSheet } from 'react-native';
import CasLeagueVenueHomeNewTablePicker from './CasLeagueVenueHomeNewTablePickers';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import Icon from 'react-native-vector-icons/Entypo';    //


const CasLeagueVenueEditTable = props => {

    const [modalView, setModalView] = useState(null);
    const [table, setTable] = useState(props.table);

    const updateTable = (field, value) => {
        var ntClone = {...table};
        ntClone[field] = value;
        setTable(ntClone);
        setModalView(null);
    }

return  <View style={styles.tablesView}>
            {
                modalView ? <CasLeagueVenueHomeNewTablePicker 
                                updateNewTable={updateTable} 
                                modalView={modalView} 
                                newTable={table}/> 
                : null
              }
            <View style={styles.tablesViewHeader}>
                <TextInput 
                    style={{flex : 1, color : Colors.quasiBlack}} 
                    defaultValue={table.name} 
                    placeholder="Table Name" 
                    placeholderTextColor={Colors.inactiveGrey}
                    onSubmitEditing={e => {updateTable('name', e.nativeEvent.text)}} 
                />
                {
                    props.setTableToUpdate ? 
                    <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {props.setTableToUpdate(null)}} style={{marginRight : 4}}/>
                    : null
                }
                
            </View>
            <View style={{...styles.tablesViewRow, marginBottom : 0}}>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>Price</Text>
                    <View style={{padding : 2}}>
                        <Button title={'$'+table.price.toFixed(2)} onPress={() => {setModalView('price')}} />
                    </View>
                </View>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>Price Unit</Text>
                    <View style={{padding : 2}}>
                        <Button title={''+table.priceUnit} onPress={() => {updateTable('priceUnit', (table.priceUnit === 'Per Game' ? 'Per Hour' : 'Per Game'))}} />
                    </View>
                </View>
                <View style={{justifyContent : 'center', alignItems : 'center', borderRadius : 8, textAlign : 'center', flex : 1}}>
                    <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>Size</Text>
                    <View style={{padding : 2}}>
                        <Button title={table.size} onPress={() => {setModalView('size')}} />
                    </View>
                    
                </View>
            </View>
            <View style={{...styles.tablesViewRow, marginTop : 0}}>
                <View style={{
                    borderRadius : 8, 
                    borderWidth : 1, 
                    borderColor : Colors.inactiveGrey, 
                    backgroundColor : Colors.activeTeal,
                    marginHorizontal : 8,
                    padding : 2,
                    flex : 1
                    }}>
                    <Button title="SAVE" onPress={() => {props.saveTable(table)}} color="white" style={{padding : 2}}/>
                </View>
            </View>
            {
                    props.deleteTable ? 
                    <View style={{...styles.tablesViewRow, marginTop : 0}}>
                        <View style={{
                            borderRadius : 8, 
                            borderWidth : 1, 
                            borderColor : Colors.dangerRed, 
                            backgroundColor : Colors.inactiveGrey,
                            marginHorizontal : 8,
                            padding : 2,
                            flex : 1
                            }}>
                            <Button title="DELETE" onPress={() => {props.deleteTable(table)}} color="white" style={{padding : 2}}/>
                        </View>
                    </View>
                    : null
                }
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
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    contactDetailsView : {
      flex : 1,
      width : '100%',
      justifyContent : 'center',
      alignItems : 'center'
    },
    optionsView : {
      flex : 6,
      width : '100%',
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
    inputFormTextInput : {
      borderWidth : 1,
      borderColor : Colors.inactiveGrey,
      margin : 4,
      borderRadius : 8,
      width : '100%',
      textAlign : 'center'
  },
  button : {
      width : '100%', 
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
  
  export default CasLeagueVenueEditTable;