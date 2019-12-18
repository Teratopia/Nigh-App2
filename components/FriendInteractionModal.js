import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import Colors from '../constants/colors';   //
import SocketGiftedChat from '../components/SocketGiftedChat';
import MatchNetworking from '../networking/matchNetworking';    //
import UNW from '../networking/userNetworking'; //
import GCH from '../helpers/giftedChatHelper';  //
import Icon from 'react-native-vector-icons/Entypo';    //
import CompetitionNetworking from '../networking/competitionNetworking';    //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import FriendInteractionModalCompetitionView from './FriendInteractionModalCompetitionView';
import FriendInteractionModalStatsView from './FriendInteractionModalStatsView';
import FriendInteractionModalHeader from './FriendInteractionModalHeader';


const FriendInteractionModal = props => {
    const [match, setMatch] = useState();
    const [messages, setMessages] = useState();
    const [imageSource, setImageSource] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [blocked, setBlocked] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [friendVenue, setFriendVenue] = useState(null);
    const [userVenue, setUserVenue] = useState(null);
    
    console.log('FriendInteractionModal init chosenFriend = ', props.chosenFriend);
    console.log('FriendInteractionModal init user = ', props.user);

    if(props.chosenFriend && !friendStatus){
        props.chosenFriend.statuses.forEach(status => {
            if(status.activityName === props.activityName){
                status.description ? setFriendStatus('"'+status.description+'"') : setFriendStatus('   ');
            }
        })
    }

    if(!match){
        MatchNetworking.createOrFetchMatch(props.user._id, props.chosenFriend._id, null, retValMatch => {
            console.log('create or fetch match, retVal = ');
            console.log(retValMatch);
            GCH.reformatMessages(retValMatch).then(res => {
                console.log('GCH res = ', res);
                setMessages(res);
                setMatch(retValMatch);
            });
        }, err => {
            console.log('create or fetch match, err = ');
            console.log(retValMatch, err);
        });
    }
    
    let sgc =  null;
    if(match && messages){
        console.log('match not null', match);
        console.log('messages not null', messages);
        sgc = <SocketGiftedChat 
                socket={props.socket}
                chat={match} 
                user={props.user} 
                messages={messages}/>
    }

    return (
        <Modal visible={true} animationType="slide" transparent={false}>
            <View style={styles.modalView}>
                <View style={{justifyContent : 'space-between', flexDirection : 'row', width : '100%', alignItems : 'center', paddingBottom : 12}}>
                    <View style={{width : 38}}/>
                    <Text style={{fontSize : 22, fontWeight : '600', color : Colors.quasiBlack}}>{props.chosenFriend.username}</Text>
                    <TouchableOpacity onPress={() => {props.onClose(null)}} style={{marginRight : 14}}>
                        <Icon name="cross" size={24} color="black" />
                    </TouchableOpacity>
                    
                </View>
                <FriendInteractionModalHeader
                    user={props.user}
                    chosenFriend={props.chosenFriend}
                    activityName={props.activityName}
                    friendVenue={friendVenue}
                    competition={competition}
                    userVenue={userVenue}
                    setUserVenue={setUserVenue}
                    setCompetition={setCompetition}
                    setShowStats={setShowStats}
                    setFriendVenue={setFriendVenue}
                    recheckBlocks={props.recheckBlocks}
                />               

                <FriendInteractionModalStatsView 
                    user={props.user}
                    chosenFriend={props.chosenFriend}
                    showStats={showStats}
                />

                <FriendInteractionModalCompetitionView 
                    competition={competition}
                    setCompetition={setCompetition}
                    userVenue={userVenue}
                    friendVenue={friendVenue}
                    user={props.user}
                />
                
                {
                    !competition || competition._id || !competition.rules || competition.rules.name !== 'HOUSE' ?
                    <View style={styles.chatView}>
                        {sgc}
                    </View>
                    :
                    null
                }
                

            </View>
        </Modal>
    );
}
//<GChat test={props.test} chat={props.chat} user={props.user}/>

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
        flex: 1,
        //height : 640,
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

export default FriendInteractionModal;