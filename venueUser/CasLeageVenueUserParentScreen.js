import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import CasLeagueVenueUserHomeScreen from './CasLeagueVenueUserHomeScreen';  //
import CasLeagueVenueUserStatsScreen from './CasLeagueVenueUserStatsScreen';  //
import CasLeagueVenueUserPromotionsScreen from './CasLeagueVenueUserPromotionsScreen';  //
import CasLeagueVenueUserNavigationFooter from './CasLeagueVenueUserNavigationFooter';  //

//setParentStatus


const CasLeageVenueUserParentScreen = props => {

  const [currentScreen, setCurrentScreen] = useState('Settings');
  
 if(currentScreen === 'Settings'){
    view = <CasLeagueVenueUserHomeScreen venueUser={props.venueUser} setVenueUser={props.setVenueUser}/>;
  } else if (currentScreen === 'Statistics'){
    view = <CasLeagueVenueUserStatsScreen venueUser={props.venueUser} setVenueUser={props.setVenueUser}/>
  } else if (currentScreen === 'Promotions'){
    view = <CasLeagueVenueUserPromotionsScreen venueUser={props.venueUser} setVenueUser={props.setVenueUser}/>
  }

  const logOut = () => {
    props.setVenueUser(null);
  }

  return (
    <View style={styles.screen}>
          {view}
          <CasLeagueVenueUserNavigationFooter setParentStatus={setCurrentScreen} />
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