import React, {useState} from 'react';
import {Text, View, StyleSheet, FlatList, Modal, Button, TouchableOpacity} from 'react-native';
//import moment from 'module';
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import ModalHeader from '../components/ModalHeader';    //
import MatchNetworking from '../networking/matchNetworking';    //
import UNW from '../networking/userNetworking'; //
import Colors from '../constants/colors';   //
import Icon from 'react-native-vector-icons/Entypo';    //

import AddFriendModal from '../components/AddFriendModal';  //
import FriendListRow from '../components/FriendListRow';    //
import FriendRequestModal from '../components/FriendRequestModal';  //
import FriendInteractionModal from '../components/FriendInteractionModal';  //
//import { unwatchFile } from 'fs';

const CasLeagueFriendsScreen = props => {
    const [isInit, setIsInit] = useState(true);
    const [viewAddFriendModal, setViewAddFriendModal] = useState(false);
    const [friendRequestSelected, setFriendRequestSelected] = useState(false);
    const [chosenFriend, setChosenFriend] = useState();

    const [requestList, setRequestsList] = useState([]);
    const [activeFriendsList, setActiveFriendsList] = useState([]);
    const [inactiveFriendsList, setInactiveFriendsList] = useState([]);

    const [expandRequests, setExpandRequests] = useState(false);
    const [expandActive, setExpandActive] = useState(false);
    const [expandInactive, setExpandInactive] = useState(false);

    const closeAddFriendModal = () => {
        setFriendRequestSelected(null);
        setViewAddFriendModal(false);
        setIsInit(true);
    }

    const recheckBlocks = (blockedId, user) => {
        var actClone = [...activeFriendsList];
        var inactClone = [...inactiveFriendsList];
        actClone.forEach(friend => {
            blockedId === friend._id ? friend.isBlocked ? friend.isBlocked = false : friend.isBlocked = true : null;
        })
        setActiveFriendsList(actClone);
        inactClone.forEach(friend => {
            blockedId === friend._id ? friend.isBlocked ? friend.isBlocked = false : friend.isBlocked = true : null;
        })
        setInactiveFriendsList(inactClone);
        props.setUser(user);
    }

    let modalView;
    if (viewAddFriendModal){
        modalView = <AddFriendModal onClose={closeAddFriendModal} user={props.user}/>
    } else if (friendRequestSelected){
        modalView = <FriendRequestModal onClose={closeAddFriendModal} user={props.user} friendRequest={friendRequestSelected}/>
    } else if (chosenFriend){
        modalView = <FriendInteractionModal 
                        socket={props.socket}
                        onClose={setChosenFriend} 
                        user={props.user} chosenFriend={chosenFriend} 
                        recheckBlocks={recheckBlocks} 
                        activityName="BILLIARDS"/>
    }

    if(isInit){
        UNW.getAllFriendRequestsForUser(props.user._id, frs => {
            console.log('getAllFriendRequestsForUser frs = ', frs);
            frs.requests && frs.requests.length > 0 ? setExpandRequests(true) : null;
            setRequestsList(frs.requests);
        }, err => {
            console.log('getAllFriendRequestsForUser err = ', err);
        });
        UNW.getUserFriends(props.user._id, res => {
            console.log('getUserFriends res = ', res);
            var inactive = [];
            var active = [];
            res.friends.forEach(friend => {
                props.user.blockedFriendsIdList.forEach(id => {
                    id === friend._id ? friend.isBlocked = true : friend.isBlocked = false;
                })
                if(friend.isActive){
                    friend.statuses.forEach(status => {
                        if(status.activityName === "BILLIARDS"){
                            if(status.active){
                                active.push(friend);
                            } else {
                                inactive.push(friend);
                            }
                        }
                    })
                } else {
                    inactive.push(friend);
                }
            })
            inactive.length > 0 ? setExpandInactive(true) : null;
            setInactiveFriendsList(inactive);
            active.length > 0 ? setExpandActive(true) : null;
            setActiveFriendsList(active);
        }, err => {
            console.log('getUserFriends err = ', err);
        });
        setIsInit(false);

    }

    return (
        <View style={{flex:1}}>
            <View style={styles.viewContainer}>
                <ModalHeader 
                title="FRIENDS"
                leftIcon="menu" 
                leftIconFunction={props.leftIconFunction}
                rightIcon="add-user" 
                rightIconFunction={() => {setViewAddFriendModal(true)}}
                style={{
                    marginBottom: 0,
                    borderBottomWidth : 'black',
                    borderBottomWidth : 1,
                }}
                />
                <TouchableOpacity onPress={() => {setExpandRequests(previous => !previous)}} style={{...styles.accordionHeader, backgroundColor : Colors.pendingBlue}}>
                    <View style={styles.accordionHeaderTitle}>
                        <Text style={styles.accordionHeaderTitleText}>Requests - {requestList.length}</Text>
                    </View>
                    <View>
                        <Icon name={expandRequests ? "minus" : "list"} size={14} color="white" />
                    </View>
                </TouchableOpacity>

{   requestList && requestList.length > 0 && expandRequests ? 
                <View style={styles.resultListView}>
                                <FlatList 
                                //style={{height:'100%'}}
                                data={requestList} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    
                                        itemData.item.requestee._id === props.user._id ? 
                                        <FriendListRow user={itemData.item.requester} activityName="BILLIARDS" onPress={() => {setFriendRequestSelected(itemData.item)}}/> 
                                        :
                                        <FriendListRow user={itemData.item.requestee} activityName="BILLIARDS" details="Pending"/>
                                    
                                )}>
                                </FlatList>
                </View>
    :null
}

                <TouchableOpacity onPress={() => {setExpandActive(previous => !previous)}} style={{...styles.accordionHeader, backgroundColor : Colors.activeTeal}}>
                    <View style={styles.accordionHeaderTitle}>
                        <Text style={styles.accordionHeaderTitleText}>Active - {activeFriendsList.length}</Text>
                    </View>
                    <View>
                        <Icon name={expandActive ? "minus" : "list"} size={14} color="white" />
                    </View>
                </TouchableOpacity>

                
{   activeFriendsList && activeFriendsList.length > 0 && expandActive ? 
                <View style={styles.resultListView}>
                                <FlatList 
                                //style={{height:'100%'}}
                                data={activeFriendsList} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    <FriendListRow user={itemData.item} activityName="BILLIARDS" onPress={() => {setChosenFriend(itemData.item)}}/> 
                                )}>
                                </FlatList>
                </View>
    :null
}

                <TouchableOpacity onPress={() => {setExpandInactive(previous => !previous)}} style={{...styles.accordionHeader}}>
                    <View style={styles.accordionHeaderTitle}>
                        <Text style={styles.accordionHeaderTitleText}>Inactive - {inactiveFriendsList.length}</Text>
                    </View>
                    <View>
                        <Icon name={expandInactive ? "minus" : "list"} size={14} color="white" />
                    </View>
                </TouchableOpacity>
                
{   inactiveFriendsList && inactiveFriendsList.length > 0 && expandInactive ? 
                <View style={styles.resultListView}>
                                <FlatList 
                                //style={{height:'100%'}}
                                data={inactiveFriendsList} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    <FriendListRow user={itemData.item} activityName="BILLIARDS" onPress={() => {setChosenFriend(itemData.item)}}/> 
                                )}>
                                </FlatList>
                </View>
    :null
}
{
    /*
    <View style={{marginBottom: 20}}></View>
    */
}
                
                {modalView}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewContainer : {
        flex: 1,
        marginTop: getStatusBarHeight(),
        alignContent: 'center'
    },
    flatListContainer : {
        flex: 1,
        paddingHorizontal: 8
    },
    flatListItemView : {
        height:40,
        flexDirection : 'row',
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottomColor: Colors.activeTeal, 
        borderBottomWidth: 1
    },
    flatListText: {
        color: Colors.inactiveGrey
    },
    accordionHeader : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding : 4,
        paddingHorizontal : 16,
        width : '100%',
        backgroundColor : Colors.inactiveGrey,
        borderBottomWidth : Colors.activeTeal,
        borderBottomWidth : 1,
        //borderBottomColor : 'white'
        
    },
    accordionHeaderTitleText : {
        color : 'white',
        fontSize : 14,
        fontWeight : '500'
    },
    userRow : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding : 4,
        paddingHorizontal : 16,
        backgroundColor : Colors.quasiBlack,
        borderBottomColor : 'black',
        borderBottomWidth : 1
    },
    userRowName : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    userRowNameText : {
        fontSize : 18,
        fontWeight : '700',
        color : 'white',
        textAlign : 'center'
        //color : Colors.activeTeal,
        //color : Colors.inactiveGrey,
        //textShadowColor : 'white',
        //textShadowOffset : {width : 1, height : 0},
        //textShadowRadius : 0,
        
    },
    userRowTilesView : {
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
        width : '50%'
    },
    userRowTile : {
        padding : 4,
        //flex : 1,
        //borderWidth : 1,
        //borderColor : 'white',
        //backgroundColor : 'black',
        //borderRadius : 4,
        marginHorizontal: 2,
        //width : '30%',
        alignItems : 'center',
        justifyContent : 'center'
    }
});

export default CasLeagueFriendsScreen;