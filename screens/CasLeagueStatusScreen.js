import React, {useState} from 'react';
import {Text, View, TextInput, Button, Switch, StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import CasLeagueSearchVenueSelectedVenueModal from '../components/CasLeagueSearchVenueSelectedVenueModal';  //
import WarningMesageModal from '../components/WarningMesageModal';  //
import VenueNetworking from '../networking/venueNetworking';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import Geolocation from '@react-native-community/geolocation';  //


//  TODO:
/*
    Add stranger danger warning
    Only allow active when at verified venue in

*/

const CasLeagueStatusScreen = props => {

  const activityName = 'BILLIARDS'; //replace with props
  const [isInit, setIsInit] = useState(false);
  const [quickSetSelection, setQuickSetSelection] = useState('off');
  const [playMode, setPlayMode] = useState('casual');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [recLoc, setRecLoc] = useState(false);
  const [warningMessageArgs, setWarningMessageArgs] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
      friendsAreNear : true,
      friendsBecomeActive : true,
      aPoolTableIsNear : true,
      anActiveUserIsNear : false,
      shareMyStatusWithFriends : true,
      shareMyLocationWithFriends : false,
      showFriendsMyLocationOnMap : false,
      notifyFriendsIfNear : true,
      notifyAnyUserIfNear : false,
      league : false,
      casual : false,
      active : false,
      passive : false,
      description : ''
  });

  if(props.user){
    var clone = {...notificationSettings};
    props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
            console.log('status = ', status);
          clone.friendsAreNear = status.friendsAreNear;
          clone.friendsBecomeActive = status.friendsBecomeActive;
          clone.aPoolTableIsNear = status.aPoolTableIsNear;
          clone.anActiveUserIsNear = status.anActiveUserIsNear;
          clone.shareMyStatusWithFriends = status.shareMyStatusWithFriends;
          clone.shareMyLocationWithFriends = status.shareMyLocationWithFriends;
          clone.showFriendsMyLocationOnMap = status.showFriendsMyLocationOnMap;
          clone.notifyFriendsIfNear = status.notifyFriendsIfNear;
          clone.notifyAnyUserIfNear = status.notifyAnyUserIfNear;
          clone.league = status.league;
          clone.casual = status.casual;
          clone.passive = status.passive;
          clone.active = status.active;
          clone.description = status.description;
        }
    });
    if(!isInit){
        clone.active ? setQuickSetSelection('active') : clone.passive ? setQuickSetSelection('passive') : setQuickSetSelection('off');
        clone.casual && clone.league ? setPlayMode('any') : clone.casual ? setPlayMode('casual') : setPlayMode('league');
        setNotificationSettings(clone);
        setIsInit(true);
    }
  }

  function initVenueCheckin(){
    Geolocation.getCurrentPosition(position => {
        setRecLoc({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        });
        VenueNetworking.queryVenues(position.coords.latitude, position.coords.longitude, 25, res => {
            console.log('initVenueCheckin res ', res.venues[0]);
            if(res.venues && res.venues.length > 0){
                setSelectedVenue(res.venues[0]);
            } else {
                setWarningMessageArgs({
                    title : 'NO VENUE FOUND',
                    description : 'To set a status to active you must be within thirty feet of a registered venue.'
                });
            }
        }, err => {
            console.log('initVenueCheckin err ', err);
        })
    }, err => {
        console.log(err);
    });
  }

  pressQuickSet = selection => {
    var clone = {...notificationSettings};
    if (selection === 'active'){
        initVenueCheckin();
        return;
    } else if(selection === 'passive'){
        clone.passive = true;
        clone.active = false;
    } else {
        clone.passive = false;
        clone.active = false;
    }
    props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
          status.passive = clone.passive;
          status.active = clone.active;
        }
    });
    setQuickSetSelection(selection);
    setNotificationSettings(clone);
    props.updateParentList(props.user.statuses);
  }

  pressPlayMode = selection => {
    setPlayMode(selection);
    var clone = {...notificationSettings};
    if(selection === 'casual'){
        clone.casual = true;
        clone.league = false;
    } else if (selection === 'league'){
        clone.casual = false;
        clone.league = true;
    } else {
        clone.casual = true;
        clone.league = true;
    }
    props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
          status.casual = clone.casual;
          status.league = clone.league;
        }
    });
    setNotificationSettings(clone);
    props.updateParentList(props.user.statuses);
  }

  pressSwitch = (selection, e) => {
      console.log('pressSwitch, selection = '+selection+', e = ', e);
      var notificationSettingsClone = {...notificationSettings};
      notificationSettingsClone[selection] = e;
      props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
          status[selection] = e;
        }
      });
      setNotificationSettings(notificationSettingsClone);
      props.updateParentList(props.user.statuses);
  }

  editDescription = e => {
    var notificationSettingsClone = {...notificationSettings};
      props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
          status.description = e;
        }
      });
      setNotificationSettings(notificationSettingsClone);
      props.updateParentList(props.user.statuses);
  }

  checkInVenue = () => {
    var clone = {...notificationSettings};
    clone.passive = true;
    clone.active = true;
    props.user.statuses.forEach(status => {
        if(status.activityName === activityName){
          status.passive = true;
          status.active = true;
        }
    });
    props.updateUserStatusToActive(props.user.statuses, selectedVenue._id);
    setQuickSetSelection('active');
    setNotificationSettings(clone);
    setSelectedVenue(null);
  }


  return (

          <SafeAreaView style={styles.screen}>
              {
                  selectedVenue ? 
                  <CasLeagueSearchVenueSelectedVenueModal 
                        venue={selectedVenue} 
                        setSelectedVenue={setSelectedVenue}
                        recLoc={recLoc}
                        checkInVenue={checkInVenue}
                        user={props.user}
                    />
                  :
                  null
              }
              {
                  warningMessageArgs ?
                    <WarningMesageModal 
                        title={warningMessageArgs.title} 
                        description={warningMessageArgs.description} 
                        onClose={setWarningMessageArgs}
                    />
                  :
                  null
              }
            <ModalHeader 
            title="STATUS"
            leftIcon="menu" 
            leftIconFunction={props.leftIconFunction}
            //rightIcon="light-bulb" 
            //rightIconFunction={toggleActivityIdeaModal}
            />
            
            <ScrollView style={styles.bodyView}>
                <View style={styles.bodyBlock}>
                    <View style={styles.bodyBlockHeader}>
                        <Text style={styles.bodyBlockHeaderText}>
                            Quick Set
                        </Text>
                    </View>
                    <View style={styles.bodyBlockRow}>
                        <View style={quickSetSelection === 'off' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="OFF" onPress={() => {pressQuickSet('off')}} color="white"/>
                        </View>
                        <View style={quickSetSelection === 'passive' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="PASSIVE" onPress={() => {pressQuickSet('passive')}} color="white"/>
                        </View>
                        <View style={quickSetSelection === 'active' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="ACTIVE" onPress={() => {pressQuickSet('active')}} color="white"/>
                        </View>
                    </View>
                </View>

                <View style={styles.bodyBlock}>
                    <View style={styles.bodyBlockHeader}>
                        <Text style={styles.bodyBlockHeaderText}>
                            Play Mode
                        </Text>
                    </View>
                    <View style={styles.bodyBlockRow}>
                        <View style={(playMode === 'casual' || playMode === 'any') && quickSetSelection !== 'off' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="CASUAL" onPress={() => {pressPlayMode('casual')}} color="white"
                            disabled={quickSetSelection === 'off'}
                            />
                        </View>
                        <View style={(playMode === 'league' || playMode === 'any') && quickSetSelection !== 'off' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="LEAGUE" onPress={() => {pressPlayMode('league')}} color="white"
                            disabled={quickSetSelection === 'off'}
                            />
                        </View>
                        <View style={playMode === 'any' && quickSetSelection !== 'off' ? styles.activeBodyBlockRowButton : styles.inactiveBodyBlockRowButton}>
                            <Button title="ANY" onPress={() => {pressPlayMode('any')}} color="white"
                            disabled={quickSetSelection === 'off'}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.bodyBlock}>
                    <View style={styles.bodyBlockHeader}>
                        <Text style={styles.bodyBlockHeaderText}>
                            Status Description
                        </Text>
                    </View>
                    <View style={styles.bodyBlockRow}>
                        <TextInput style={styles.descriptionInput} 
                        placeholder="Tell folks what you're up to!"
                        multiline={true}
                        maxLength={144}
                        defaultValue={notificationSettings.description} 
                        onChangeText={e => {editDescription(e)}}/>
                    </View>
                </View>

                <View style={styles.bodyBlock}>
                    <View style={styles.bodyBlockHeader}>
                        <Text style={styles.bodyBlockHeaderText}>
                            Notify Me When...
                        </Text>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Active Friends Are Near</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.friendsAreNear}
                            onValueChange={e => pressSwitch('friendsAreNear', e)}
                            disabled={quickSetSelection === 'off'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                        </View>
                        <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Friends Become Active</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.friendsBecomeActive}
                            onValueChange={e => pressSwitch('friendsBecomeActive', e)}
                            disabled={quickSetSelection === 'off'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                        </View>
                        <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>A Pool Table Is Near</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.aPoolTableIsNear}
                            onValueChange={e => pressSwitch('aPoolTableIsNear', e)}
                            disabled={quickSetSelection === 'off'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                        </View>
                        <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Any Active User is Near</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.anActiveUserIsNear}
                            onValueChange={e => pressSwitch('anActiveUserIsNear', e)}
                            disabled={quickSetSelection === 'off'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                </View>

                <View style={{...styles.bodyBlock, borderBottomWidth : 0}}>
                    <View style={styles.bodyBlockHeader}>
                        <Text style={styles.bodyBlockHeaderText}>
                            Notify Others (Active Only)
                        </Text>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Share My Status With Friends</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.shareMyStatusWithFriends}
                            onValueChange={e => pressSwitch('shareMyStatusWithFriends', e)}
                            disabled={quickSetSelection !== 'active'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Share My Location With Friends</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.shareMyLocationWithFriends}
                            onValueChange={e => pressSwitch('shareMyLocationWithFriends', e)}
                            disabled={quickSetSelection !== 'active'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Show Friends My Location On Map</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.showFriendsMyLocationOnMap}
                            onValueChange={e => pressSwitch('showFriendsMyLocationOnMap', e)}
                            disabled={quickSetSelection !== 'active'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Notify Friends If Near</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.notifyFriendsIfNear}
                            onValueChange={e => pressSwitch('notifyFriendsIfNear', e)}
                            disabled={quickSetSelection !== 'active'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                    <View style={{...styles.bodyBlockRow, justifyContent : 'space-between'}}>
                        <View style={styles.bodyBlockRowSwitchTitle}>
                            <Text>Notify Any User If Near</Text>
                        </View>
                        <View style={styles.bodyBlockRowSwitch}>
                            <Switch value={notificationSettings.notifyAnyUserIfNear}
                            onValueChange={e => pressSwitch('notifyAnyUserIfNear', e)}
                            disabled={quickSetSelection !== 'active'}
                            trackColor={{false : Colors.inactiveGrey, true : Colors.activeTeal}}
                            ios_backgroundColor={Colors.inactiveGrey}
                            />
                        </View>
                    </View>
                </View>

            </ScrollView>
            
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
    paddingBottom: 12
  },
  bodyView : {
      margin : 12
  },
  quickSetView : {
      margin : 8,
      borderBottomWidth : 1,
      borderBottomColor : Colors.inactiveGrey
  },
  bodyBlock : {
    paddingVertical : 12,
    borderBottomWidth : 1,
    borderColor : Colors.inactiveGrey
  },
  bodyBlockHeaderText : {
    fontSize : 16,
    fontWeight : '600'
  },
  bodyBlockRow : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'space-evenly',
    padding : 4,
  },
  activeBodyBlockRowButton : {
    width : '30%',
    backgroundColor : Colors.activeTeal,
    borderWidth : 1,
    borderRadius : 8,
    borderColor : Colors.inactiveGrey
  },
  inactiveBodyBlockRowButton : {
    width : '30%',
    backgroundColor : Colors.inactiveGrey,
    borderWidth : 1,
    borderRadius : 8,
    borderColor : Colors.activeTeal
  },
  descriptionInput : {
    padding : 12,
    width : '100%',
    minHeight : 48,
    borderColor : Colors.inactiveGrey,
    borderWidth : 1,
    borderRadius : 8
  },
  bodyBlockRowSwitchTitle : {

  },
  bodyBlockRowSwitch : {

  },

});

export default CasLeagueStatusScreen;