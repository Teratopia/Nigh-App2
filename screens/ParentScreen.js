import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import NavigationFooter from '../components/NavigationFooter';    //
//import CasLeagueFriendsScreen from './CasLeagueFriendsScreen';
import CasLeagueStatusScreen from './CasLeagueStatusScreen';
//import NavigationModal from '../components/NavigationModal';
import LoginScreen from './LoginScreen';                          //
//import AdminScreen from './AdminScreen';
//import UserProfileScreen from './UserProfileScreen';
import UserNetworking from '../networking/userNetworking';        //
import LocationTracker from '../components/LocationTracker';      //
//import CasLeageVenueUserParentScreen from '../venueUser/CasLeageVenueUserParentScreen';
//import CasLeagueSearchScreen from './CasLeagueSearchScreen';



const ParentScreen = props => {

  //UserNetworking.deleteAllUsers();
  const [locTracker, setLocTracker] = useState();
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewNavModal, setViewNavModal] = useState(false);
  const [venueChecked, setVenueChecked] = useState(false);
  const [venueUser, setVenueUser] = useState(null);

  

  const setTheUser = theUser => {
    console.log('set the user, ', theUser);
    setUser(theUser);
    setCurrentScreen('SEARCH');
  }

  console.log('test1');

  const setScreen = (selection, eventSelected) => {
    setSelectedEvent(eventSelected);
    setCurrentScreen(selection);
  }

  const updateUserStatus = (currentStatuses) => {
    UserNetworking.updateUserStatuses(user._id, currentStatuses, updatedUser => {
        console.log('& updateUserStatus from Status Screen, on Parent, updatedUser = ', updatedUser);
      setUser(updatedUser);
    });
  }

  const updateUserStatusToActive = (currentStatuses, venueId) => {
    UserNetworking.updateUserStatusToActive(user._id, currentStatuses, venueId, updatedUser => {
        console.log('& updateUserStatusToActive from Status Screen, on Parent, updatedUser = ', updatedUser);
      setUser(updatedUser);
    });
  }

  const toggleNavModal = () => {
    setViewNavModal(!viewNavModal);

  }

  const onAdminNav = () => {
    //todo move to nav screen
    toggleNavModal();
    setScreen('ADMIN');
  }

  const setScreenFromNav = screen => {
    console.log('setScreenFromNav 1, screen = '+screen);
    toggleNavModal();
    if(screen){
      setScreen(screen);
    } else {
      //setScreen(currentScreen);
    }
  }

  const venueCheck = () => {
    setVenueChecked(previous => !previous);
    console.log('venueCheck value = '+venueCheck);
  }

  const closeAdmin = () => {
    //todo move to nav screen
    setScreen('SEARCH');
  }

  let view = <LoginScreen setUser={setTheUser} venueCheck={venueCheck} venueChecked={venueChecked} setVenueUser={setVenueUser}/>;
  
  if(venueUser){
    //view = <CasLeageVenueUserParentScreen venueUser={venueUser} setVenueUser={setVenueUser}/>
  } else if(currentScreen === 'STATUS'){
    view = <CasLeagueStatusScreen leftIconFunction={toggleNavModal} user={user} updateParentList={updateUserStatus} updateUserStatusToActive={updateUserStatusToActive}/>;
  } else if (currentScreen === 'SEARCH'){
    //view = <CasLeagueSearchScreen onEventSureSelection={setScreen} leftIconFunction={toggleNavModal} user={user}/>;
  } else if (currentScreen === 'FRIENDS'){
    //view = <CasLeagueFriendsScreen selectedEvent={selectedEvent} leftIconFunction={toggleNavModal} user={user} setUser={setUser} onCloseModal={setScreen}/>;
  } else if (currentScreen === 'ADMIN'){
    //view = <AdminScreen user={user} onClose={closeAdmin}/>;
  } else if (currentScreen === 'PROFILE'){
    //view = <UserProfileScreen user={user} leftIconFunction={toggleNavModal} setScreen={setScreen} setUser={setTheUser}/>;
  }

  const logOut = () => {
    setUser(null);
    setCurrentScreen(null);
    setViewNavModal(false);
    view = <LoginScreen setUser={setTheUser}/>;
  }

  let navView;
  if(viewNavModal){
    //navView = <NavigationModal setScreen={setScreenFromNav} logOut={logOut} user={user}/>
  }

  const updateStatusesToPassive = (user) => {
      console.log('& updateStatusesToPassive user = ', user);
      console.log(user);
      setUser(user);
  }

  if(!locTracker && user){
      setLocTracker(<LocationTracker user={user} onStatusUpdate={updateStatusesToPassive}/>);
  }

  if(venueUser){
    return (
      <View style={{flex:1}}>
          {view}
          <View style={{marginBottom:24, backgroundColor:'black'}}></View>
      </View>    
    );
  } else {
    return (
      <View style={{flex:1}}>
            {view}
            {locTracker}
            <NavigationFooter currentScreen={currentScreen} selectionChange={setScreen}/>
            <View style={{marginBottom:24, backgroundColor:'black'}}></View>
            {navView}
      </View>    
    );
  }
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 12
    //backgroundColor: 'yellow'
  }
});

export default ParentScreen;