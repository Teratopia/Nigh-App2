import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, Image, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
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
import CasLeagueVenueUserHouseRulesEdit from '../venueUser/CasLeagueVenueUserHouseRulesEdit';

const FriendInteractionModalCompetitionView = props => {

    const calculateCompetitionCountdownStart = () => {
        var foo = (10 * 60 * 1000) - (new Date() - new Date(props.competition.createDate));
        console.log('foo = '+foo);
        if(foo > 0){
            return foo/1000;
        } else {
            deleteChallenge();
            return 0;
        }
    }

    const setRules = name => {
        var compClone = {...props.competition};
        if(name === 'HOUSE' && props.userVenue === props.friendVenue && props.userVenue.houseRules){
            compClone.rules = props.userVenue.houseRules;
        } else {
            compClone.rules.name = name;
        }
        props.setCompetition(compClone);
    }

    const postChallenge = () => {
        let clone = {...props.competition};
        clone.createDate = new Date();
        CompetitionNetworking.requestCompetition(clone, res => {
            console.log('postChallenge res = ', res);
            props.setCompetition(res.competition);
        })
    }

    const deleteChallenge = () => {
        CompetitionNetworking.deleteChallenge(props.competition._id, res => {
            console.log('deleteChallenge res = ', res);
            props.setCompetition(null);
        })
    }
    
    const acceptChallenge = () => {
        CompetitionNetworking.acceptChallenge(props.competition._id, res => {
            console.log('acceptChallenge res = ', res);
            props.setCompetition(res.competition);
        });
    }

    const finishChallenge = selection => {
        competition.challengerId === props.user._id ? competition.challengerResultClaim = selection : competition.accepterResultClaim = selection;
        CompetitionNetworking.updateChallenge(props.competition, res => {
            console.log('updateChallenge res = ', res);
            props.setCompetition(res.competition);
        });
    }

    const confirmChallenge = () => {
        CompetitionNetworking.confirmChallenge(props.user._id, props.competition._id, res => {
            console.log('confirmChallenge res = ', res);
            props.setCompetition(null);
        });
    }
 
    if(props.competition && !props.competition._id && !props.competition.acceptedDate){
    return <View style={styles.competitionView}>
        <View style={styles.competitionHeader}>
            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge Competition</Text>
        </View>
        <View style={styles.competitionViewButtonRow}>
            {
                props.user.premiums && props.user.premiums.apaBilliards ?
                <View style={props.competition.rules.name === 'APA' ? styles.activeButton : styles.inactiveButton}>
                    <Button title="APA" onPress={() => {setRules('APA')}} color="white" style={{fontSize : 12}}/>
                </View>
                :
                null
            }
            {
                props.user.premiums && props.user.premiums.bcaBilliards ?
                <View style={props.competition.rules.name === 'BCA' ? styles.activeButton : styles.inactiveButton}>
                    <Button title="BCA" onPress={() => {setRules('BCA')}} color="white" style={{fontSize : 12}}/>
                </View>
                :
                null
            }
            
            <View style={props.competition.rules.name === 'HOUSE' ? styles.activeButton : styles.inactiveButton}>
                <Button title="HOUSE" onPress={() => {setRules('HOUSE')}} color="white" style={{fontSize : 12}}/>
            </View>
            <View style={props.competition.rules.name === 'OTHER' ? styles.activeButton : styles.inactiveButton}>
                <Button title="OTHER" onPress={() => {setRules('OTHER')}} color="white" style={{fontSize : 12}}/>
            </View>
        </View>
        {
            //friendVenue && friendVenue.houseRules && competition.rules.name === 'HOUSE' ?
            props.userVenue && props.userVenue.houseRules && props.competition.rules.name === 'HOUSE' ?
                <CasLeagueVenueUserHouseRulesEdit venueUser={props.userVenue} style={{flex : 0, marginTop : 0}}/>                     
            :
            null
        }
        

        <View style={{...styles.competitionViewButtonRow, marginVertical : 0}}>
            <View style={{...styles.activeButton}}>
                <Button title="POST!" onPress={postChallenge} color="white" style={{fontSize : 12}}/>
            </View>
        </View>
    </View>
    } else if (props.competition && props.competition._id && !props.competition.acceptedDate && props.competition.challengerId === props.user._id){

    return <View style={styles.competitionView}>
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
        <View style={{...styles.competitionViewButtonRow, marginVertical : 0}}>
            <View style={{...styles.inactiveButton, width : '100%'}}>
                <Button title="RETRACT CHALLENGE" onPress={deleteChallenge} color="white" style={{fontSize : 12}}/>
            </View>
        </View>
    </View>
    } else if(props.competition && props.competition._id && !props.competition.acceptedDate && props.competition.accepterId === props.user._id){

    
    return <View style={styles.competitionView}>
        <View style={styles.competitionHeader}>
            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge - {props.competition.rules.name} Rules</Text>
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
    } else if (props.competition && props.competition._id && props.competition.accepterId && props.competition.acceptedDate){
    return <View style={styles.competitionView}>
        <View style={styles.competitionHeader}>
            <Text style={{fontSize : 18, fontWeight : '700', color : Colors.quasiBlack}}>Challenge in Progress</Text>
        </View>
        <View style={{marginTop : 8, marginBottom : 4, justifyContent : 'center', alignItems : 'center'}}>
            
        </View>
        <View style={styles.competitionChallengeButtonRow}>

                <View style={
                    props.competition.challengerResultClaim === props.competition.accepterResultClaim && props.competition.accepterResultClaim === 'win' ?
                    {...styles.activeButton, width : '30%', backgroundColor : Colors.dangerRed} :
                    props.user._id === props.competition.challengerId && props.competition.accepterResultClaim === 'loss' && props.competition.challengerResultClaim === 'win' ?
                    {...styles.activeButton, width : '30%'} :
                    props.user._id === props.competition.accepterId && props.competition.accepterResultClaim === 'win' && props.competition.challengerResultClaim === 'loss' ?
                    {...styles.activeButton, width : '30%'} :
                    props.user._id === props.competition.accepterId && props.competition.accepterResultClaim === 'win' ?
                    {...styles.goldButton, width : '30%'} :
                    props.user._id === props.competition.challengerId && props.competition.challengerResultClaim === 'win' ?
                    {...styles.goldButton, width : '30%'} :
                    {...styles.inactiveButton, width : '30%'}
                }>
                    <Button title="I WON" onPress={()=>{finishChallenge('win')}} color="white" style={{fontSize : 12}}/>
                </View>

                <View style={
                    props.competition.challengerResultClaim === props.competition.accepterResultClaim && props.competition.accepterResultClaim === 'loss' ?
                    {...styles.activeButton, width : '30%', backgroundColor : Colors.dangerRed} :
                    props.user._id === props.competition.challengerId && props.competition.accepterResultClaim === 'win' && props.competition.challengerResultClaim === 'loss' ?
                    {...styles.activeButton, width : '30%'} :
                    props.user._id === props.competition.accepterId && props.competition.accepterResultClaim === 'loss' && props.competition.challengerResultClaim === 'win' ?
                    {...styles.activeButton, width : '30%'} :
                    props.user._id === props.competition.accepterId && props.competition.accepterResultClaim === 'loss' ?
                    {...styles.goldButton, width : '30%'} :
                    props.user._id === props.competition.challengerId && props.competition.challengerResultClaim === 'loss' ?
                    {...styles.goldButton, width : '30%'} :
                    {...styles.inactiveButton, width : '30%'}
                }>                                
                    <Button title="I LOST" onPress={()=>{finishChallenge('loss')}} color="white" style={{fontSize : 12}}/>
                </View>

                <View style={
                    props.competition.challengerResultClaim === props.competition.accepterResultClaim && props.competition.accepterResultClaim === 'ignore' ?
                    {...styles.activeButton, width : '30%'} :
                    props.user._id === props.competition.challengerId && props.competition.challengerResultClaim === 'ignore'?
                    {...styles.goldButton, width : '30%'} :
                    props.user._id === props.competition.accepterId && props.competition.accepterResultClaim === 'ignore'?
                    {...styles.goldButton, width : '30%'} :
                    {...styles.inactiveButton, width : '30%'}
                }>   
                    <Button title="IGNORE" onPress={()=>{finishChallenge('ignore')}} color="white" style={{fontSize : 12}}/>
                </View>
                
        </View>

        <View style={{...styles.activeButton, width : '50%', marginTop : 8}}>   
                    <Button title="CONFIRM" disabled={props.user._id === props.competition.challengerId ? !props.competition.challengerResultClaim : !props.competition.accepterResultClaim} 
                    onPress={confirmChallenge} 
                    color="white" 
                    style={{fontSize : 12}}/>
                </View>
        
    </View>
    } else {
        return null;
    }
    

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

export default FriendInteractionModalCompetitionView;