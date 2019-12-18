import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, TouchableOpacity, FlatList, Linking, Image} from 'react-native';
import Colors from '../constants/colors';   //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import {encode as btoa} from 'base-64';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import VenueLeaderboardTable from './VenueLeaderboardTable';
import ImageNetworking from '../networking/imageNetworking';
import moment from 'moment';
import VenueSelectionModalFriendList from './VenueSelectionModalFriendList';
import VenueSelectionModalHeader from './VenueSelectionModalHeader';
import VenueSelectionLeagueInfo from './VenueSelectionLeagueInfo';




const VenueSelectionModal = props => {


    return <Modal animation="fade">
                <View style={styles.parentView}>

                    <VenueSelectionModalHeader 
                        venue={props.venue} 
                        setSelectedVenue={props.setSelectedVenue}
                        recLoc={props.recLoc}
                        user={props.user}
                        checkInVenue={props.checkInVenue}
                    />

                    {
                        props.venue.activeLeague && props.venue.activeLeague.firstPlacePrizeTitle ? 
                        <VenueSelectionLeagueInfo
                            venue={props.venue} 
                            setSelectedVenue={props.setSelectedVenue}
                            recLoc={props.recLoc}
                            user={props.user}
                        />
                        :
                        <View style={{height : 12}}/>
                    }
                    <Text style={styles.subHeader}>
                        Leaderboard
                    </Text>
                    {
                        props.venue.activeLeague && props.venue.activeLeague.firstPlacePrizeTitle ? 
                        <VenueLeaderboardTable 
                            venueUser={props.venue} 
                            //fromDate={props.venue.activeLeague.startDate}
                            //toDate={props.venue.activeLeague.endDate}
                        />
                        :
                        <VenueLeaderboardTable 
                            venueUser={props.venue} 
                        />
                    }

                    <View style={styles.inactiveButton}>
                        <Button title="CLOSE" onPress={() => {props.setSelectedVenue(null)}} color="white"/>
                    </View>
                </View>
            </Modal>
}


const styles = StyleSheet.create({
    parentView : {
        flex : 1,
        justifyContent : 'center',
        marginVertical : getStatusBarHeight(),
        //marginVertical : 100
    },
    inactiveButton : {
        //width : '100%', 
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        marginVertical : 4,
        marginHorizontal : 12
    },
    subHeader : {
        fontWeight : '600',
        fontSize : 22,
        textAlign : 'center',
        marginBottom : 4
    },
    prizeTouchContainer : {
        justifyContent : 'center', 
        alignItems : 'center', 
        margin : 4,
        marginHorizontal : 8,
        padding : 4,
        borderColor : Colors.gold,
        borderWidth : 1,
        borderRadius : 8,
    },
    prizeHeader : {
        fontSize : 12,
        color : Colors.inactiveGrey,
        marginTop : 2,
        textAlign : 'center'
    },
    prizeTitle : {
        fontSize : 16,
        color : Colors.quasiBlack,
        fontWeight : '600',
        marginVertical : 2,
        textAlign : 'center'
    },
    prizeDescription : {
        fontSize : 14,
        color : Colors.quasiBlack,
        fontWeight : '500',
        marginBottom : 2,
        textAlign : 'center'
    }
});

export default VenueSelectionModal;

/*
const styles = StyleSheet.create({
    modalView: {
        alignItems: 'center',
        justifyContent : 'center',
        //width:'62%', 
        //maxHeight:'62%',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.activeTeal
    },
    shadowBox : {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        width : '100%',
        height : '100%',
        alignItems : 'center',
        justifyContent : 'center'
    },
    addressTextView : {
        marginVertical : 4
    },
    addressText : {
        fontWeight : '500', 
        fontSize : 12, 
        color : Colors.inactiveGrey
    },
    activeButton : {
        width : '100%', 
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        marginVertical : 4,
        minWidth : 200, 
    },
    inactiveButton : {
        width : '100%', 
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        marginVertical : 4,
        minWidth : 200, 
    },
    prizeTouchContainer : {
        justifyContent : 'center', 
        alignItems : 'center', 
        margin : 4,
        marginHorizontal : 8,
        padding : 4,
        borderColor : Colors.gold,
        borderWidth : 1,
        borderRadius : 8,
    },
    prizeHeader : {
        fontSize : 12,
        color : Colors.inactiveGrey,
        marginTop : 2,
        textAlign : 'center'
    },
    prizeTitle : {
        fontSize : 16,
        color : Colors.quasiBlack,
        fontWeight : '600',
        marginVertical : 2,
        textAlign : 'center'
    },
    prizeDescription : {
        fontSize : 14,
        color : Colors.quasiBlack,
        fontWeight : '500',
        marginBottom : 2,
        textAlign : 'center'
    }
    
    
});
*/