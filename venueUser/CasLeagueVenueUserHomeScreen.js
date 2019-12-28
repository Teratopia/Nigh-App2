import React, {useState} from 'react';
import {Text, View, TextInput, Button, ScrollView, StyleSheet, SafeAreaView, FlatList} from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import CasLeagueVenueUserInitSetup from './CasLeagueVenueUserInitSetup';    //
import VenueNetworking from '../networking/venueNetworking';    //
import Icon from 'react-native-vector-icons/Entypo';    //
import CasLeagueVenueEditTable from './CasLeagueVenueEditTable';    //
import CasLeagueVenueUserHouseRulesEdit from './CasLeagueVenueUserHouseRulesEdit';  //
import CasLeagueVenueViewTable from './CasLeagueVenueViewTable';

const CasLeagueVenueUserHomeScreen = props => {

  const [view, setView] = useState(props.venueUser.googlePlaceId ? 'home' : 'initSetup');
  const [venueDetails, setVenueDetails] = useState(null);
  const [modalView, setModalView] = useState(null);
  const [venueEmail, setVenueEmail] = useState(props.venueUser.email);
  const [tableToUpdate, setTableToUpdate] = useState(null);
  const [newTable, setNewTable] = useState({
    name : 'Add Table',
    price : 0.00,
    priceUnit : 'Per Game',
    size : "6'x3'"
  });

  const setVenueUser = venue => {
      props.setVenueUser(venue);
      if(venue.googlePlaceId){
        setView('home');
      }
  }

  const updateEmail = e => {
      var venueUserClone = {...props.venueUser};
      venueUserClone.email = e.nativeEvent.text;
      VenueNetworking.updateVenue(venueUserClone, venue => {
        console.log('updateVenue value = ', venue);
        if(venue){
            setVenueEmail(venue.email);
            props.setVenueUser(venue);
        }
    }, err => {
        console.log('updateVenue err = ', err)
    })

  }

  const updateTable = tableToUpdate => {
    VenueNetworking.updateTable(props.venueUser._id, tableToUpdate, res => {
        console.log('updateTable details = ', res);
        setTableToUpdate(null);
        if(res.venue){
            props.setVenueUser(res.venue);
        }
        //setVenueDetails(res.venue);
    }, err => {
        console.log('updateTable err = ', err);
    })
  }

  const saveNewTable = table => {
    VenueNetworking.addTableToVenue(props.venueUser._id, table, res => {
        console.log('saveNewTable details = ', res);
        setTableToUpdate(null);
        if(res.venue){
            props.setVenueUser(res.venue);
        }
        //setVenueDetails(res.venue);
    }, err => {
        console.log('saveNewTable err = ', err);
    })
  }
  
  const deleteTable = table => {
    VenueNetworking.deletePoolTable(props.venueUser._id, table._id, res => {
        console.log('deleteTable details = ', res);
        setTableToUpdate(null);
        if(res.venue){
            props.setVenueUser(res.venue);
        }
    }, err => {
        console.log('deleteTable err = ', err);
    })
  }

  if (view === 'home' && props.venueUser.googlePlaceId && !venueDetails){
    VenueNetworking.getVenueDetails(props.venueUser.googlePlaceId, details => {
        console.log('getVenueDetails details = ', details);
        setVenueDetails(details.result);
    }, err => {
        console.log('getVenueDetails err = ', err);
    })
  }

  return (
          <View style={styles.screen}>
            <ModalHeader 
            title={venueDetails ? 'SETTINGS' : "SETUP"}
            leftIcon="new-message" 
            leftIconFunction={() => {}}
            rightIcon="logout" 
            rightIconFunction={() => {props.setVenueUser(null)}}
            rightIconLibrary="AntDesign"
            />
            {
            view === 'initSetup' ? 
            <CasLeagueVenueUserInitSetup venueUser={props.venueUser} setVenueUser={setVenueUser}/> : 
            <View style={styles.parentView}>
                {
                    venueDetails ? 
                    <View style={styles.contactDetailsView}>
                        <View style={{...styles.textView}}>
                            <Text style={{...styles.textStyle, fontSize : 20, fontWeight : '700', color : Colors.quasiBlack}}>{venueDetails.name}</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>{venueDetails.formatted_phone_number}</Text>
                        </View>
                        <View style={styles.textView}>
                            <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>{venueDetails.website}</Text>
                        </View>
                        {
                            venueEmail ? 
                            <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey}}>{props.venueUser.email}</Text>
                                <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {setVenueEmail(null)}} style={{marginLeft : 4}}/>
                            </View>
                            :
                            <View style={{...styles.inputFormTextInput, width : '62%'}}>
                                <TextInput  placeholder="Input@Email.here" 
                                            placeholderTextColor={Colors.inactiveGrey}
                                            onSubmitEditing={updateEmail} 
                                            defaultValue={props.venueUser.email}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                            />
                            </View>
                        }
                    </View>
                    :
                    <View>
                        <Text>Loading...</Text>
                    </View>
                }
                <SafeAreaView style={{
                    ...styles.optionsView, 
                    //marginHorizontal : 16
                    }}>
                    <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        directionalLockEnabled={true}
                        alwaysBounceHorizontal={false}
                        centerContent={true}
                        contentContainerStyle={{justifyContent : 'center', alignItems : 'center'}}
                        >
                            <View style={{width : '95%', justifyContent : 'center', alignItems : 'center'}}>
                            <CasLeagueVenueUserHouseRulesEdit venueUser={props.venueUser} setVenueUser={props.setVenueUser}/>
                            </View>
                <View style={{width : '50%', borderBottomColor : Colors.inactiveGrey, borderBottomWidth : 1, marginHorizontal : '25%', marginTop : 12}} />

                    <View style={{...styles.textView, marginTop : 16, marginBottom : 8, justifyContent : 'center', alignItems : 'center'}}>
                            <Text style={{...styles.textStyle, fontSize : 16, fontWeight : '600', color : Colors.quasiBlack, textAlign : 'center'}}>Tables</Text>
                        </View>

                        <CasLeagueVenueEditTable 
                        table={newTable} 
                        saveTable={saveNewTable}
                        />

                    {
                        props.venueUser.poolTables.map(table => {
                            if(table._id === tableToUpdate){
                                return <CasLeagueVenueEditTable 
                                            table={table} 
                                            saveTable={updateTable} 
                                            deleteTable={deleteTable} 
                                            setTableToUpdate={setTableToUpdate}
                                        />
                            } else {
                                return <CasLeagueVenueViewTable 
                                            table={table} 
                                            setTableToUpdate={setTableToUpdate}
                                        />   
                            }
                        })
                    }
                    
                    </ScrollView>
                </SafeAreaView>
            </View>
            }
          </View>
  );
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
      alignItems : 'center',
      marginBottom : 16
  },
  contactDetailsView : {
    flex : 1,
    //width : '100%',
    justifyContent : 'center',
    alignItems : 'center'
  },
  optionsView : {
    flex : 5,
    //width : '100%',
    //justifyContent : 'space-evenly',
    alignItems : 'center',
    marginTop : 8,
    paddingTop : 4,
    borderTopColor : Colors.inactiveGrey,
    borderTopWidth : 1,
    //marginBottom : 16
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
    //width : '100%',
    textAlign : 'center'
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
    margin : 12,
    borderRadius : 8,
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
},
tablesViewHeader : {
    //flex : 1,
    flexDirection : 'row',
    justifyContent : 'space-between',
    borderBottomColor : Colors.inactiveGrey,
    borderBottomWidth : 1,
    marginTop : 8,
    marginHorizontal : 8
},
tablesViewRow : {
    //flex : 1,
    flexDirection : 'row',
    //width : '100%',
    margin : 8
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
    //width: '100%',
    justifyContent : 'center'
  },

});

export default CasLeagueVenueUserHomeScreen;