import React, {useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import NavigationFooter from '../components/NavigationFooter';    //
import CasLeagueFriendsScreen from './CasLeagueFriendsScreen';
import CasLeagueStatusScreen from './CasLeagueStatusScreen';
import NavigationModal from '../components/NavigationModal';
import LoginScreen from './LoginScreen';                          //
import AdminScreen from './AdminScreen';
import UserProfileScreen from './UserProfileScreen';
import UserNetworking from '../networking/userNetworking';        //
import LocationTracker from '../components/LocationTracker';      //
import CasLeageVenueUserParentScreen from '../venueUser/CasLeageVenueUserParentScreen';
import CasLeagueSearchScreen from './CasLeagueSearchScreen';  //
import AsyncStorage from '@react-native-community/async-storage';
//import BgTracking from '../helpers/locationNotificationHelper';


//import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';


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
    if(theUser){
      props.socket.emit('userLogin', theUser._id);
      setUser(theUser);
      setCurrentScreen('SEARCH');
    }
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

  const logOut = async () => {
    props.socket.emit('userLogout', user._id);
    await AsyncStorage.setItem('@autoLogIn', 'false');
    setUser(null);
    setCurrentScreen(null);
    setViewNavModal(false);
    view = <LoginScreen 
              setUser={setTheUser} 
              venueCheck={venueCheck} 
              venueChecked={venueChecked} 
              setVenueUser={setVenueUser}/>;
  }

  let view = <LoginScreen 
               setUser={setTheUser} 
               venueCheck={venueCheck} 
               venueChecked={venueChecked} 
               setVenueUser={setVenueUser}/>;
  
  if(venueUser){
    view = <CasLeageVenueUserParentScreen 
             venueUser={venueUser} 
             setVenueUser={setVenueUser}/>
  } else if(currentScreen === 'STATUS'){
    view = <CasLeagueStatusScreen 
             leftIconFunction={toggleNavModal} 
             user={user} 
             updateParentList={updateUserStatus} 
             updateUserStatusToActive={updateUserStatusToActive} 
             setUser={setUser} 
             socket={props.socket}
             logOut={logOut}/>;
  } else if (currentScreen === 'SEARCH'){
    view = <CasLeagueSearchScreen 
             onEventSureSelection={setScreen} 
             leftIconFunction={toggleNavModal} 
             socket={props.socket}
             setUser={setUser} 
             user={user}/>;
  } else if (currentScreen === 'FRIENDS'){
    view = <CasLeagueFriendsScreen
             socket={props.socket}
             selectedEvent={selectedEvent} 
             leftIconFunction={toggleNavModal} 
             user={user} 
             setUser={setUser} 
             onCloseModal={setScreen}/>;
  } else if (currentScreen === 'ADMIN'){
    view = <AdminScreen 
             user={user} 
             onClose={closeAdmin}/>;
  } else if (currentScreen === 'PROFILE'){
    view = <UserProfileScreen 
             user={user} 
             leftIconFunction={toggleNavModal} 
             setScreen={setScreen} 
             setUser={setTheUser}/>;
  }

  let navView;
  if(viewNavModal){
    navView = <NavigationModal setScreen={setScreenFromNav} logOut={logOut} user={user}/>
  }

  if(!locTracker && user){
      setLocTracker(<LocationTracker user={user} setUser={setUser}/>);
  }

  /*
<BgTracking 
        //user={user} onStatusUpdate={updateStatusesToPassive}
        />



  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  const onSwipeLeft = () => {
    console.log('onSwipeLeft');
    currentScreen === 'STATUS' ? setCurrentScreen('SEARCH') : 
    currentScreen === 'SEARCH' ? setCurrentScreen('FRIENDS') : 
    currentScreen === 'FRIENDS' ? setCurrentScreen('STATUS') : 
    null;
  }

  const onSwipeRight = () => {
    console.log('onSwipeRight');
    currentScreen === 'STATUS' ? setCurrentScreen('FRIENDS') : 
    currentScreen === 'FRIENDS' ? setCurrentScreen('SEARCH') : 
    currentScreen === 'SEARCH' ? setCurrentScreen('STATUS') : 
    null;
  }
*/

  if(venueUser){
    return (
      <View style={{flex:1}}>
          <StatusBar barStyle="dark-content" />
          {view}
          <View style={{
            //marginBottom:24, 
            backgroundColor:'black'
            }}></View>
      </View>    
    );
  } else {
    return (

      <View style={{flex:1}}>
            <StatusBar barStyle="dark-content" />
            {view}
            {locTracker}
            <NavigationFooter currentScreen={currentScreen} selectionChange={setScreen}/>
            <View style={{
              //marginBottom:24, 
              backgroundColor:'black'
              }}></View>
            {navView}
      </View> 
         /*
        <View style={{flex:1}}>
        <GestureRecognizer
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        config={config}
        style={{
          flex: 1,
          //backgroundColor: this.state.backgroundColor
        }}
        >
            {view}
            {locTracker}
            <NavigationFooter currentScreen={currentScreen} selectionChange={setScreen}/>
            <View style={{
              //marginBottom:24, 
              backgroundColor:'black'
              }}></View>
            {navView}
        </GestureRecognizer>
      </View> 

         */
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