import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, SafeAreaView, ScrollView, Linking, Image} from 'react-native';
import Colors from '../constants/colors';   //
import UserNetworking from '../networking/userNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import {encode as btoa} from 'base-64';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import VenueLeaderboardTable from './VenueLeaderboardTable';
import ImageNetworking from '../networking/imageNetworking';
import moment from 'moment';
import VenueSelectionModalFriendList from './VenueSelectionModalFriendList';
import VenueSelectionModalHeader from './VenueSelectionModalHeader';
import VenueSelectionLeagueInfo from './VenueSelectionLeagueInfo';
import AddFriendModal from './AddFriendModal';
import FriendInteractionModal from './FriendInteractionModal';

const VenueSelectionModal = props => {

    const [friendInteractionModal, setFriendInteractionModal] = useState();

    const addVenueToUserFavorites = () => {
        UserNetworking.addVenueIdToFavorites(props.user._id, props.venue._id, res => {
            console.log('addVenueToUserFavorites res = ', res);
            props.setUser(res.user);
        }, err => {
            console.log('addVenueToUserFavorites err = ', err);
        });
    }

    const removeVenueFromUserFavorites = () => {
        UserNetworking.removeVenueIdFromFavorites(props.user._id, props.venue._id, res => {
            console.log('removeVenueIdFromFavorites res = ', res);
            props.setUser(res.user);
        }, err => {
            console.log('removeVenueIdFromFavorites err = ', err);
        });
    }

    /*
if (viewAddFriendModal){
        modalView = <AddFriendModal onClose={closeAddFriendModal} user={props.user}/>
    } else if (friendRequestSelected){
        modalView = <FriendRequestModal onClose={closeAddFriendModal} user={props.user} friendRequest={friendRequestSelected}/>
    } else if (chosenFriend){
        modalView = <FriendInteractionModal 
                        socket={props.socket}
                        onClose={setChosenFriend} 
                        user={props.user} 
                        chosenFriend={chosenFriend} 
                        recheckBlocks={recheckBlocks} 
                        activityName="BILLIARDS"/>
*/

    const onLeaderboardRowPress = score => {
        //add addFriendModal preset search value
        if(props.user.friendsIdList.includes(score.user._id)){
            setFriendInteractionModal(
                <FriendInteractionModal 
                    socket={props.socket}
                    onClose={() => {setFriendInteractionModal(null)}} 
                    user={props.user} 
                    chosenFriend={score.user} 
                    recheckBlocks={() => {}} 
                    activityName="BILLIARDS"/>
            )
        } else {
            setFriendInteractionModal(
                <AddFriendModal 
                    onClose={() => {setFriendInteractionModal(null)}} 
                    user={props.user}
                    initUserSelected={score.user}/>
            )
        }
    }

    return <Modal animation="fade">
                <SafeAreaView style={styles.parentView}>

                    <VenueSelectionModalHeader 
                        venue={props.venue} 
                        setSelectedVenue={props.setSelectedVenue}
                        recLoc={props.recLoc}
                        user={props.user}
                        checkInVenue={props.checkInVenue}
                        noPromotionPopUp={props.noPromotionPopUp}
                    />

                    <ScrollView style={{paddingBottom : 24}}>

                    {
                        props.venue.activeLeague && props.venue.activeLeague.firstPlacePrizeTitle ? 
                        <VenueSelectionLeagueInfo
                            venue={props.venue} 
                            setSelectedVenue={props.setSelectedVenue}
                            recLoc={props.recLoc}
                            user={props.user}
                        />
                        :
                        //<View style={{flex : 1}}/>
                        null
                    }
                    <Text style={props.venue.activeLeague && props.venue.activeLeague.firstPlacePrizeTitle ? styles.subHeader : {...styles.subHeader, marginTop : 12}}>
                        Leaderboard
                    </Text>
                    {
                        
                        props.venue.activeLeague && props.venue.activeLeague.firstPlacePrizeTitle ? 
                        <VenueLeaderboardTable 
                            venueUser={props.venue} 
                            userId={props.user._id}
                            userFriendsIds={props.user.friendsIdList}
                            onRowPress={onLeaderboardRowPress}
                            //fromDate={props.venue.activeLeague.startDate}
                            //toDate={props.venue.activeLeague.endDate}
                        />
                        :
                        <VenueLeaderboardTable 
                            venueUser={props.venue} 
                            userId={props.user._id}
                            userFriendsIds={props.user.friendsIdList}
                            onRowPress={onLeaderboardRowPress}
                        />

                        
                    }

                    <View style={{height : 48}}/>

                    </ScrollView>

                    <View style={{width : '100%'}}>
                    {
                        props.user.venueFavoritesIdList && props.user.venueFavoritesIdList.includes(props.venue._id) ?
                        <View style={styles.inactiveButton}>
                            <Button title="REMOVE FROM FAVORITES" onPress={removeVenueFromUserFavorites} color="white"/>
                        </View>
                        :
                        //<Text>asdfasd</Text>
                        
                        <View style={styles.activeButton}>
                            <Button title="ADD TO FAVORITES" onPress={addVenueToUserFavorites} color="white"/>
                        </View>
                        
                    }
                    
                    <View style={styles.inactiveButton}>
                        <Button title="CLOSE" onPress={() => {props.setSelectedVenue(null)}} color="white"/>
                    </View>
                    </View>

                </SafeAreaView>
                    
                    
                {
                    friendInteractionModal
                }
            </Modal>
}


const styles = StyleSheet.create({
    parentView : {
        flex : 1,
        //justifyContent : 'center',
        alignItems : 'center',
        marginTop : getStatusBarHeight(),
        //backgroundColor : 'blue',
        width : '100%'
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
    activeButton : {
        //width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
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