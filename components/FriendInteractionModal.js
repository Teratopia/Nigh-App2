import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, Image, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';   //
import SocketGiftedChat from '../components/SocketGiftedChat';
import MatchNetworking from '../networking/matchNetworking';    //
import UNW from '../networking/userNetworking'; //
import GCH from '../helpers/giftedChatHelper';  //
import Icon from 'react-native-vector-icons/Entypo';    //
import CompetitionNetworking from '../networking/competitionNetworking';    //
import CountDown from 'react-native-countdown-component';   //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //


const FriendInteractionModal = props => {
    const [match, setMatch] = useState();
    const [messages, setMessages] = useState();
    const [imageSource, setImageSource] = useState(null);
    const [friendStatus, setFriendStatus] = useState(null);
    const [competition, setCompetition] = useState(null);
    const [blocked, setBlocked] = useState(null);
    const [historyStats, setHistoryStats] = useState(null);
    const [showStats, setShowStats] = useState(false);
    const [friendVenue, setFriendVenue] = useState(null);
    
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
        console.log('block if check');
        checkIfBlocked(props.user, props.chosenFriend);
    }

    if(props.chosenFriend && !friendStatus){
        props.chosenFriend.statuses.forEach(status => {
            if(status.activityName === props.activityName){
                status.description ? setFriendStatus('"'+status.description+'"') : setFriendStatus('   ');
            }
        })
    }

    /*
createDate : Date,
    endDate : Date,
    acceptedDate : Date,
    challengerId : String,
    accepterId : String,
    venueId : String,
    rules : {},
    challengerResultClaim : String,
    accepterResultClaim : String,
    gameType : String,
    challengerConfirmed : Boolean,
    accepterConfirmed : Boolean
    */

    function formatCompetitionHistoryStats(competitions){
        var stats = {};
        stats.totalGames = competitions.length;
        var confirmedWins = 0;
        var confirmedLosses = 0;
        var confirmedIgnores = 0;
        var contested = 0;
        var totTimePlayed = 0;
        competitions.forEach(comp => {
            if(comp.challengerId === props.user._id){
                if(comp.challengerResultClaim === 'win' && comp.accepterResultClaim === 'loss'){
                    confirmedWins++;
                    //totTimePlayed += comp.endDate - comp.acceptedDate;
                } else if (comp.challengerResultClaim === 'loss' && comp.accepterResultClaim === 'win'){
                    confirmedLosses++;
                    //totTimePlayed += comp.endDate - comp.acceptedDate;
                } else if (comp.challengerResultClaim === 'ignore' && comp.accepterResultClaim === 'ignore'){
                    confirmedIgnores++;
                } else {
                    contested++;
                }
            } else {
                if(comp.challengerResultClaim === 'loss' && comp.accepterResultClaim === 'win'){
                    confirmedWins++;
                    //totTimePlayed += comp.endDate - comp.acceptedDate;
                } else if (comp.challengerResultClaim === 'win' && comp.accepterResultClaim === 'loss'){
                    confirmedLosses++;
                    //totTimePlayed += comp.endDate - comp.acceptedDate;
                } else if (comp.challengerResultClaim === 'ignore' && comp.accepterResultClaim === 'ignore'){
                    confirmedIgnores++;
                } else {
                    contested++;
                }
            }
        });
        var stats = {
            gamesPlayed : competitions.length,
            confirmedWins : confirmedWins,
            confirmedLosses : confirmedLosses,
            confirmedIgnores : confirmedIgnores,
            contested : contested,
        }
        return stats;
    }

    if(!historyStats){
        CompetitionNetworking.getCompetitionHistory(props.user._id, props.chosenFriend._id, res => {
            console.log('getCompetitionHistory res = ', res);
            if(res.competitions){
                setHistoryStats(formatCompetitionHistoryStats(res.competitions));
            }
        }, err => {
            console.log('getCompetitionHistory err = ', err);
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

    if(!friendVenue && props.chosenFriend.activeVenueId){
        props.chosenFriend.statuses.forEach(status => {
            if(status.activityName === 'BILLIARDS' && status.active && status.shareMyLocationWithFriends){
                VenueNetworking.getVenueById(props.chosenFriend.activeVenueId, venue => {
                    console.log('VenueNetworking.getVenueById venue = ', venue);
                    setFriendVenue(venue);
                }, err => {
                    console.log('VenueNetworking.getVenueById err = ', err);
                });
            }
        })
    }

    if(!competition){
        CompetitionNetworking.checkForCompetition(props.user._id, props.chosenFriend._id, res => {
            console.log('checkForCompetition res = ', res);
            if(res && res.competition){
                setCompetition(res.competition);
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

    const initCompetition = () => {
        if(competition && !competition._id){
            setCompetition(null);
        } else if (competition && competition._id) {
            
        } else {
            setCompetition({
                createDate : new Date(),
                endDate : null,
                challengerId : props.user._id,
                accepterId : props.chosenFriend._id,
                acceptedDate : null,
                venueId : props.user.activeVenueId,
                rules : {name : 'APA'},
                challengerResultClaim : null,
                accepterResultClaim : null,
                gameType : props.activityName,
                challengerConfirmed : false, 
                accepterConfirmed : false
            });
        }
    }

    const setRules = name => {
        var compClone = {...competition};
        compClone.rules.name = name;
        setCompetition(compClone);
    }

    const postChallenge = () => {
        CompetitionNetworking.requestCompetition(competition, res => {
            console.log('postChallenge res = ', res);
            setCompetition(res.competition);
        })
    }

    const deleteChallenge = () => {
        CompetitionNetworking.deleteChallenge(competition._id, res => {
            console.log('deleteChallenge res = ', res);
            setCompetition(null);
        })
    }
    
    const acceptChallenge = () => {
        CompetitionNetworking.acceptChallenge(competition._id, res => {
            console.log('acceptChallenge res = ', res);
            setCompetition(res.competition);
        });
    }

    const finishChallenge = selection => {
        competition.challengerId === props.user._id ? competition.challengerResultClaim = selection : competition.accepterResultClaim = selection;
        CompetitionNetworking.updateChallenge(competition, res => {
            console.log('updateChallenge res = ', res);
            setCompetition(res.competition);
        });
    }

    const confirmChallenge = () => {
        CompetitionNetworking.confirmChallenge(props.user._id, competition._id, res => {
            console.log('confirmChallenge res = ', res);
            setCompetition(null);
        });
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
                 latitude: friendVenue.location.coordinates[1],
                 longitude:  friendVenue.location.coordinates[0]
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

    const calculateCompetitionCountdownStart = () => {
        var foo = (10 * 60 * 1000) - (new Date() - new Date(competition.createDate));
        console.log('foo = '+foo);
        if(foo > 0){
            return foo/1000;
        } else {
            deleteChallenge();
            return 0;
        }
    }

    return (
        <Modal visible={true} animationType="slide" transparent={false}>
            <View style={styles.modalView}>
                <View style={{justifyContent : 'space-between', flexDirection : 'row', width : '100%', alignItems : 'center'}}>
                    <View style={{width : 32}}/>
                    <Text style={{fontSize : 16, fontWeight : '600', color : Colors.quasiBlack}}>{props.chosenFriend.username}</Text>
                    <TouchableOpacity onPress={() => {props.onClose(null)}} style={{marginRight : 14}}>
                        <Icon name="cross" size={18} color="black" />
                    </TouchableOpacity>
                    
                </View>
                <View style={styles.friendDetailsView}>
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
                        <TouchableOpacity style={styles.topRowButton} onPress={initCompetition} disabled={blocked}>
                            <Icon name="trophy" size={24} color={blocked ? Colors.dangerRed : Colors.activeTeal}/>
                            <Text style={{fontSize : 10, color : "white"}}>Challenge</Text>
                        </TouchableOpacity>
                        <Image
                            style={styles.imageStyle}
                            source={imageSource}
                        />
                        <TouchableOpacity 
                            style={styles.topRowButton} 
                            disabled={blocked || !friendVenue} 
                            onPress={initDirectionsLink}
                        >
                            <Icon name="direction" size={24} color={blocked ? Colors.dangerRed : Colors.pendingBlue}/>
                            <Text style={{fontSize : 10, color : "white"}}>Directions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.smallTopRowButton} onPress={() => {setShowStats(previous => !previous)}}>
                            <Icon name="line-graph" size={20} color={Colors.gold}/>
                            <Text style={{fontSize : 10, color : "white"}}>Stats</Text>
                        </TouchableOpacity>
                    </View>
                    {
                    friendVenue ? 
                    //properName
                    <View style={styles.friendDetailsStatus}>
                        <Text style={{color : Colors.inactiveGrey, fontSize : 14}}>At {friendVenue.properName}</Text>
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
                
                {
                    showStats && historyStats && !competition ? 
                    <View style={{...styles.competitionView, flex : 1}}>
                        <View style={styles.competitionHeader}>
                            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Game History Statistics</Text>
                        </View>
                        <View style={styles.competitionViewButtonRow}>
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontWeight : '500', fontSize : 12, color : Colors.inactiveGrey}}>
                                    Played
                                </Text>
                                <Text style={{fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                    {historyStats.gamesPlayed}
                                </Text>
                            </View>
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontWeight : '500', fontSize : 12, color : Colors.inactiveGrey}}>
                                    Won
                                </Text>
                                <Text style={{fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                    {historyStats.confirmedWins}
                                </Text>
                            </View>
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontWeight : '500', fontSize : 12, color : Colors.inactiveGrey}}>
                                    Lost
                                </Text>
                                <Text style={{fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                    {historyStats.confirmedLosses}
                                </Text>
                            </View>
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontWeight : '500', fontSize : 12, color : Colors.inactiveGrey}}>
                                    Ignored
                                </Text>
                                <Text style={{fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                    {historyStats.confirmedIgnores}
                                </Text>
                            </View>
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <Text style={{fontWeight : '500', fontSize : 12, color : Colors.inactiveGrey}}>
                                    Contested
                                </Text>
                                <Text style={{fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                    {historyStats.contested}
                                </Text>
                            </View>
                        </View>
                    </View>
                    :
                    null

                }
                {
                    !competition ? 
                    null :
                    competition && !competition._id && !competition.acceptedDate ? 
                    <View style={styles.competitionView}>
                        <View style={styles.competitionHeader}>
                            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge Competition</Text>
                        </View>
                        <View style={styles.competitionViewButtonRow}>
                            <View style={competition.rules.name === 'APA' ? styles.activeButton : styles.inactiveButton}>
                                <Button title="APA" onPress={() => {setRules('APA')}} color="white" style={{fontSize : 12}}/>
                            </View>
                            <View style={competition.rules.name === 'BCA' ? styles.activeButton : styles.inactiveButton}>
                                <Button title="BCA" onPress={() => {setRules('BCA')}} color="white" style={{fontSize : 12}}/>
                            </View>
                            <View style={competition.rules.name === 'HOUSE' ? styles.activeButton : styles.inactiveButton}>
                                <Button title="HOUSE" onPress={() => {setRules('HOUSE')}} color="white" style={{fontSize : 12}}/>
                            </View>
                            <View style={competition.rules.name === 'OTHER' ? styles.activeButton : styles.inactiveButton}>
                                <Button title="OTHER" onPress={() => {setRules('OTHER')}} color="white" style={{fontSize : 12}}/>
                            </View>
                        </View>
                        <View style={{...styles.activeButton, width : '100%'}}>
                            <Button title="POST!" onPress={postChallenge} color="white" style={{fontSize : 12}}/>
                        </View>
                    </View>
                    : competition._id && !competition.acceptedDate && competition.challengerId === props.user._id ? 
                    <View style={styles.competitionView}>
                        <View style={styles.competitionHeader}>
                            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge Pending</Text>
                        </View>
                        <View style={{marginTop : 8, marginBottom : 4, justifyContent : 'center', alignItems : 'center'}}>
                            <CountDown
                                until={calculateCompetitionCountdownStart()}
                                size={14}
                                digitStyle={{backgroundColor: Colors.quasiBlack}}
                                digitTxtStyle={{color: "white"}}
                                timeToShow={['M', 'S']}
                                timeLabels={{m: 'MM', s: 'SS'}}
                                showSeparator
                                onFinish={()=>{}}
                            />
                        </View>
                        
                        <View style={{...styles.inactiveButton, width : '100%'}}>
                            <Button title="RETRACT CHALLENGE" onPress={deleteChallenge} color="white" style={{fontSize : 12}}/>
                        </View>
                    </View>
                    : competition._id && !competition.acceptedDate && competition.accepterId === props.user._id ? 
                    <View style={styles.competitionView}>
                        <View style={styles.competitionHeader}>
                            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge - {competition.rules.name} Rules</Text>
                        </View>
                        <View style={{marginTop : 8, marginBottom : 4, justifyContent : 'center', alignItems : 'center'}}>
                            <CountDown
                                until={calculateCompetitionCountdownStart()}
                                size={14}
                                digitStyle={{backgroundColor: Colors.quasiBlack}}
                                digitTxtStyle={{color: "white"}}
                                timeToShow={['M', 'S']}
                                timeLabels={{m: 'MM', s: 'SS'}}
                                showSeparator
                                onFinish={()=>{}}
                            />
                        </View>
                        <View style={styles.competitionChallengeButtonRow}>
                            <View style={{...styles.activeButton, width : '40%'}}>
                                <Button title="ACCEPT" onPress={acceptChallenge} color="white" style={{fontSize : 12}}/>
                            </View>
                            <View style={{...styles.inactiveButton, width : '40%'}}>
                                <Button title="REJECT" onPress={deleteChallenge} color="white" style={{fontSize : 12}}/>
                            </View>
                        </View>
                        
                    </View>
                    : competition._id && competition.accepterId && competition.acceptedDate ? 
                    <View style={styles.competitionView}>
                        <View style={styles.competitionHeader}>
                            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge in Progress</Text>
                        </View>
                        <View style={{marginTop : 8, marginBottom : 4, justifyContent : 'center', alignItems : 'center'}}>
                            
                        </View>
                        <View style={styles.competitionChallengeButtonRow}>

                                <View style={
                                    competition.challengerResultClaim === competition.accepterResultClaim && competition.accepterResultClaim === 'win' ?
                                    {...styles.activeButton, width : '30%', backgroundColor : Colors.dangerRed} :
                                    props.user._id === competition.challengerId && competition.accepterResultClaim === 'loss' && competition.challengerResultClaim === 'win' ?
                                    {...styles.activeButton, width : '30%'} :
                                    props.user._id === competition.accepterId && competition.accepterResultClaim === 'win' && competition.challengerResultClaim === 'loss' ?
                                    {...styles.activeButton, width : '30%'} :
                                    props.user._id === competition.accepterId && competition.accepterResultClaim === 'win' ?
                                    {...styles.goldButton, width : '30%'} :
                                    props.user._id === competition.challengerId && competition.challengerResultClaim === 'win' ?
                                    {...styles.goldButton, width : '30%'} :
                                    {...styles.inactiveButton, width : '30%'}
                                }>
                                    <Button title="I WON" onPress={()=>{finishChallenge('win')}} color="white" style={{fontSize : 12}}/>
                                </View>

                                <View style={
                                    competition.challengerResultClaim === competition.accepterResultClaim && competition.accepterResultClaim === 'loss' ?
                                    {...styles.activeButton, width : '30%', backgroundColor : Colors.dangerRed} :
                                    props.user._id === competition.challengerId && competition.accepterResultClaim === 'win' && competition.challengerResultClaim === 'loss' ?
                                    {...styles.activeButton, width : '30%'} :
                                    props.user._id === competition.accepterId && competition.accepterResultClaim === 'loss' && competition.challengerResultClaim === 'win' ?
                                    {...styles.activeButton, width : '30%'} :
                                    props.user._id === competition.accepterId && competition.accepterResultClaim === 'loss' ?
                                    {...styles.goldButton, width : '30%'} :
                                    props.user._id === competition.challengerId && competition.challengerResultClaim === 'loss' ?
                                    {...styles.goldButton, width : '30%'} :
                                    {...styles.inactiveButton, width : '30%'}
                                }>                                
                                    <Button title="I LOST" onPress={()=>{finishChallenge('loss')}} color="white" style={{fontSize : 12}}/>
                                </View>

                                <View style={
                                    competition.challengerResultClaim === competition.accepterResultClaim && competition.accepterResultClaim === 'ignore' ?
                                    {...styles.activeButton, width : '30%'} :
                                    props.user._id === competition.challengerId && competition.challengerResultClaim === 'ignore'?
                                    {...styles.goldButton, width : '30%'} :
                                    props.user._id === competition.accepterId && competition.accepterResultClaim === 'ignore'?
                                    {...styles.goldButton, width : '30%'} :
                                    {...styles.inactiveButton, width : '30%'}
                                }>   
                                    <Button title="IGNORE" onPress={()=>{finishChallenge('ignore')}} color="white" style={{fontSize : 12}}/>
                                </View>
                                
                        </View>

                        <View style={{...styles.activeButton, width : '50%', marginTop : 8}}>   
                                    <Button title="CONFIRM" disabled={props.user._id === competition.challengerId ? !competition.challengerResultClaim : !competition.accepterResultClaim} 
                                    onPress={confirmChallenge} 
                                    color="white" 
                                    style={{fontSize : 12}}/>
                                </View>
                        
                    </View>
                    : null
                }
                
                <View style={styles.chatView}>
                    {sgc}
                </View>
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
        flex : 3,
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
        flex: 7,
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
        flex : 3,
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
        borderRadius : 8
    },
    activeButton : {  
        borderWidth : 1, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        width : '24%',
        fontSize : 12,
        borderRadius : 8
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