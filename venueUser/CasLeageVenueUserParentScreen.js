import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import CasLeagueVenueUserHomeScreen from './CasLeagueVenueUserHomeScreen';  //
import CasLeagueVenueUserStatsScreen from './CasLeagueVenueUserStatsScreen';  //
import CasLeagueVenueUserPromotionsScreen from './CasLeagueVenueUserPromotionsScreen';  //
import CasLeagueVenueUserNavigationFooter from './CasLeagueVenueUserNavigationFooter';  //
import CasLeagueFeedbackScreen from '../screens/CasLeagueFeedbackScreen';

//setParentStatus


const CasLeageVenueUserParentScreen = props => {

  const [currentScreen, setCurrentScreen] = useState('Settings');
  
  if(currentScreen === 'FEEDBACK'){
    view =  <CasLeagueFeedbackScreen
                //toggleNavModal={toggleNavModal} 
                setScreen={setCurrentScreen}
                venueUser={props.venueUser} 
            />
  } else if(currentScreen === 'Settings'){
    view =  <CasLeagueVenueUserHomeScreen 
              venueUser={props.venueUser} 
              setVenueUser={props.setVenueUser}
              setCurrentScreen={setCurrentScreen}
            />;
  } else if (currentScreen === 'Statistics'){
    view =  <CasLeagueVenueUserStatsScreen 
              venueUser={props.venueUser} 
              setVenueUser={props.setVenueUser}
              setCurrentScreen={setCurrentScreen}
            />
  } else if (currentScreen === 'Promotions'){
    view =  <CasLeagueVenueUserPromotionsScreen 
              venueUser={props.venueUser} 
              setVenueUser={props.setVenueUser}
              setCurrentScreen={setCurrentScreen}
            />
  }

  const logOut = () => {
    props.setVenueUser(null);
  }

  return (
    <View style={styles.screen}>
          {view}
          <CasLeagueVenueUserNavigationFooter 
            currentScreen={currentScreen} 
            setParentStatus={setCurrentScreen} 
          />
    </View>    
  );
}

const styles = StyleSheet.create({
  screen : {
    flex:1, 
    //backgroundColor : 'pink'
  }
});

export default CasLeageVenueUserParentScreen;