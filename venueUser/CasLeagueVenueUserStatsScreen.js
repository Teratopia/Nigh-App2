import React from 'react';
import { View, StyleSheet, } from 'react-native';
import ModalHeader from '../components/ModalHeader';  //
import { getStatusBarHeight } from 'react-native-status-bar-height';  //
import VenueLeaderboardTable from '../components/VenueLeaderboardTable';  //

const CasLeagueVenueUserStatsScreen = props => {

    return (
          <View style={styles.screen}>
            <ModalHeader 
            title="STATISTICS"
            leftIcon="new-message" 
            leftIconFunction={() => {}}
            rightIcon="logout" 
            rightIconFunction={() => {props.setVenueUser(null)}}
            rightIconLibrary="AntDesign"
            />
            <VenueLeaderboardTable venueUser={props.venueUser} />
          </View>
    );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
  },

});

export default CasLeagueVenueUserStatsScreen;