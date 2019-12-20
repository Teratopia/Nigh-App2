import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Colors from '../constants/colors';   //
import UNW from '../networking/userNetworking'; //
import Icon from 'react-native-vector-icons/Entypo';    //
import CompetitionNetworking from '../networking/competitionNetworking';    //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //


const FriendInteractionModalHeader = props => {
    const [imageSource, setImageSource] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const [blocked, setBlocked] = useState(null);
    const [competitionsChecked, setCompetitionsChecked] = useState(false);
    
    console.log('FriendInteractionModal init chosenFriend = ', props.chosenFriend);
    console.log('FriendInteractionModal init user = ', props.user);

    checkIfBlocked = (blocker, blockee) => {
        console.log('check if blocked blocked = '+blocked+', blockee._id = '+ blockee._id +', blocker.blockedFriendsIdList = ', blocker.blockedFriendsIdList);
        if(blocker.blockedFriendsIdList.length === 0) {
            setBlocked(false)
        } else {
            blocker.blockedFriendsIdList.forEach(id => {
                id === blockee._id ? setBlocked(true) : setBlocked(false);
            });
        }
    }

    if(blocked === null){
        console.log('check if blocked');
        checkIfBlocked(props.user, props.chosenFriend);
    }

    if(props.chosenFriend && !friendStatus){
        props.chosenFriend.statuses.forEach(status => {
            if(status.activityName === props.activityName){
                status.description ? setFriendStatus('"'+status.description+'"') : setFriendStatus('   ');
            }
        })
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    if(!imageSource){
        UNW.getUserProfileImage(props.chosenFriend._id, imgDoc => {
                console.log('getUserProfileImage success imgDoc = ', imgDoc);
                if(imgDoc.message === 'image not found'){
                    console.log('if no imgDoc message');
                    setImageSource(require('../images/defaultProfilePic1.jpeg'));
                } else {
                    setImageSource({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(imgDoc.image.source.data.data)});
                }
        }, err => {
            console.log('getUserProfileImage err = ', err);
        });
    }

    if(!props.friendVenue && props.chosenFriend.activeVenueId){
        props.chosenFriend.statuses.forEach(status => {
            if(status.activityName === 'BILLIARDS' && status.active && status.shareMyLocationWithFriends){
                VenueNetworking.getVenueById(props.chosenFriend.activeVenueId, venue => {
                    console.log('VenueNetworking.getVenueById venue = ', venue);
                    props.setFriendVenue(venue);
                }, err => {
                    console.log('VenueNetworking.getVenueById err = ', err);
                });
            }
        })
    }

    if(!props.userVenue && props.user.activeVenueId){
        props.user.statuses.forEach(status => {
            if(status.activityName === 'BILLIARDS' && status.active){
                VenueNetworking.getVenueById(props.user.activeVenueId, venue => {
                    console.log('VenueNetworking.getVenueById venue = ', venue);
                    props.setUserVenue(venue);
                }, err => {
                    console.log('VenueNetworking.getVenueById err = ', err);
                });
            }
        })
    }

    if(!props.competition && !competitionsChecked){
        setCompetitionsChecked(true);
        CompetitionNetworking.checkForCompetition(props.user._id, props.chosenFriend._id, res => {
            console.log('checkForCompetition res = ', res);
            if(res && res.competition){
                props.setCompetition(res.competition);
            }
        })
    }

    const initCompetition = () => {
        if(props.competition && !props.competition._id){
            props.setCompetition(null);
        } else if (props.competition && props.competition._id) {
            
        } else {
            console.log('friendVenue = ', props.friendVenue);
            var comp = {
                createDate : new Date(),
                endDate : null,
                challengerId : props.user._id,
                accepterId : props.chosenFriend._id,
                acceptedDate : null,
                venueId : props.user.activeVenueId,
                rules : {name : 'OTHER'},
                challengerResultClaim : null,
                accepterResultClaim : null,
                gameType : props.activityName,
                challengerConfirmed : false, 
                accepterConfirmed : false
            };
            if(props.friendVenue && props.friendVenue.houseRules){
                comp.rules = props.friendVenue.houseRules;
            }
            props.setCompetition(comp);
        }
    }

    const toggleBlocked = () => {
        UNW.toggleBlockFriend(props.user._id, props.chosenFriend._id, res => {
            console.log('toggleBlocked res = ', res);
            console.log('block res check');
            checkIfBlocked(res.user, props.chosenFriend);
            props.recheckBlocks(props.chosenFriend._id, res.user);
        });
    }

    const initDirectionsLink = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const initDirectionsLinkData = {
                source: {
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude
               },
               destination: {
                 latitude: props.friendVenue.location.coordinates[1],
                 longitude:  props.friendVenue.location.coordinates[0]
               },
               params: [
                 {
                   key: "travelmode",
                   value: "driving"        // may be "walking", "bicycling" or "transit" as well
                 },
                 {
                   key: "dir_action",
                   value: "navigate"       // this instantly initializes navigation using the given travel mode
                 }
               ],
               waypoints: []
             };
            console.log('getting directions, data = ', initDirectionsLinkData);
            getDirections(initDirectionsLinkData);
        }, err => {
            console.log(err);
        });
    }

    return <View style={styles.friendDetailsView}>
                    <View style={styles.friendDetailViewTopRow}>
                        <TouchableOpacity style={blocked ? {...styles.smallTopRowButton, backgroundColor : Colors.dangerRed} : styles.smallTopRowButton} onPress={toggleBlocked}>
                            <Icon name="block" size={20} color={blocked ? "white" : Colors.dangerRed}/>
                            {
                                blocked ? 
                                    <Text style={{fontSize : 8, color : "white"}}>Unblock</Text>
                                :
                                    <Text style={{fontSize : 10, color : "white"}}>Block</Text>
                            }
                            
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.topRowButton} 
                            onPress={initCompetition} 
                            disabled={ false
                                //blocked || !props.chosenFriend.activeVenueId || props.chosenFriend.activeVenueId !== props.user.activeVenueId
                            }
                        >
                            <Icon name="trophy" size={24} 
                            color={blocked ? 
                                Colors.dangerRed :
                                blocked || !props.chosenFriend.activeVenueId || props.chosenFriend.activeVenueId !== props.user.activeVenueId ? 
                                Colors.inactiveGrey
                                : Colors.activeTeal}/>
                            <Text style={{fontSize : 10, color : "white"}}>Challenge</Text>
                        </TouchableOpacity>
                        <Image
                            style={styles.imageStyle}
                            source={imageSource}
                        />
                        <TouchableOpacity 
                            style={styles.topRowButton} 
                            disabled={blocked || !props.friendVenue} 
                            onPress={initDirectionsLink}
                        >
                            <Icon name="direction" size={24} 
                                color={blocked ? 
                                    Colors.dangerRed :
                                    blocked || !props.friendVenue ?
                                    Colors.inactiveGrey
                                    : Colors.pendingBlue}/>
                            <Text style={{fontSize : 10, color : "white"}}>Directions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallTopRowButton} onPress={() => {props.setShowStats(previous => !previous)}}>
                            <Icon name="line-graph" size={20} color={Colors.gold}/>
                            <Text style={{fontSize : 10, color : "white"}}>Stats</Text>
                        </TouchableOpacity>
                    </View>
                    {
                    props.friendVenue ? 
                    //properName
                    <View style={styles.friendDetailsStatus}>
                        <Text style={{color : Colors.inactiveGrey, fontSize : 14}}>At {props.friendVenue.properName}</Text>
                    </View>
                    : null
                    }
                    {
                        friendStatus ? 
                        <View style={styles.friendDetailsStatus}>
                            <Text style={{color : Colors.inactiveGrey, fontSize : 14}}>{friendStatus}</Text>
                        </View>
                        : null
                    }
                </View>
}


const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        width: '100%',
        marginTop: getStatusBarHeight(),
        marginBottom : 24
        //backgroundColor: 'blue'
    },
    friendDetailsView : {
        //flex : 3,
        justifyContent : 'center',
        alignItems : 'center',
    },
    friendDetailViewTopRow : {
        height : 100,
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        alignItems : 'center',
        width : '100%',
    },
    topRowButton : {
        width: 76, 
        height: 76, 
        borderRadius: 38, 
        borderWidth: 1, 
        borderColor: Colors.activeTeal,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.quasiBlack
    },
    smallTopRowButton : {
        width: 48, 
        height: 48, 
        borderRadius: 24, 
        borderWidth: 1, 
        borderColor: Colors.activeTeal,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : Colors.quasiBlack
    },
    friendDetailsStatus : {
        marginBottom : 4,
        textAlign : 'center',
        justifyContent : 'center',
        alignItems : 'center',
    },
    chatView : {
        //flex: 1,
        height : 640,
        borderTopWidth : 1,
        borderColor : Colors.inactiveGrey,

    },
    imageStyle : {
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        borderWidth: 1, 
        borderColor: Colors.activeTeal
    },
    titleHeaderView : {
        paddingBottom: 12,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        width: '100%',
        alignItems: 'center'
    },
    titleHeader: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500'
    },
    detailView: {
        flex: 1,
        alignItems: 'center',
        padding: 12,      
        width: '100%',
        borderBottomColor: 'white',
        borderBottomWidth: 1,

    },
    detailText: {
        fontSize: 14,
        color: 'white',
        marginVertical: 4,
        justifyContent: 'center'
    },
    buttonView: {
        width: '100%',
        //flex:1,
        height: 38,
        alignContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 12
    },
    nopeButton : {
        backgroundColor: Colors.activeTeal,
        width: '40%',
        height: 40
    },
    sureButton : {
        backgroundColor: Colors.activeTeal,
        width: '40%',
        height: 40
    },
    imageStyle : {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginBottom: 6, 
        borderWidth: 1, 
        borderColor: Colors.activeTeal
    },
    competitionView : {
        borderTopWidth : 1,
        borderTopColor : Colors.inactiveGrey,
        //flex : 1,
        alignItems: 'center',
        justifyContent : 'center',
        padding: 12,      
        width: '100%',
    },
    competitionViewButtonRow : {
        flexDirection : 'row', 
        alignItems : 'center', 
        justifyContent : 'space-evenly',
        width : '100%',
        marginVertical : 8
    },
    inactiveButton : {  
        borderWidth : 1, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        width : '24%',
        fontSize : 12,
        borderRadius : 8,
        flex : 1,
        marginHorizontal : 4
    },
    activeButton : {  
        borderWidth : 1, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        width : '24%',
        fontSize : 12,
        borderRadius : 8,
        flex : 1,
        marginHorizontal : 4
    },
    goldButton : {  
        borderWidth : 1, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.gold,
        width : '24%',
        fontSize : 12,
        borderRadius : 8
    },
    blueButton : {  
        borderWidth : 1, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.pendingBlue,
        width : '24%',
        fontSize : 12,
        borderRadius : 8
    },
    competitionChallengeButtonRow : {
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        alignItems : 'center',
        width : '100%'
    },
    neutralIcon : {
        fontSize : 10, color : "white"
    },
    activeIcon : {
        fontSize : 10, color : Colors.activeTeal
    },
    inactiveIcon : {
        fontSize : 10, color : Colors.inactiveGrey
    },
    dangerIcon : {
        fontSize : 10, color : Colors.dangerRed
    },
    
    
});

export default FriendInteractionModalHeader;