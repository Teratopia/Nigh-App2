import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Colors from '../constants/colors';   //
import CompetitionNetworking from '../networking/competitionNetworking';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //

const FriendInteractionModalStatsView = props => {
    const [historyStats, setHistoryStats] = useState(null);
    const [socketInit, setSocketInit] = useState(false);

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

    function resetStats(){
        CompetitionNetworking.getCompetitionHistory(props.user._id, props.chosenFriend._id, res => {
            console.log('getCompetitionHistory res = ', res);
            if(res.competitions){
                setHistoryStats(formatCompetitionHistoryStats(res.competitions));
            }
        }, err => {
            console.log('getCompetitionHistory err = ', err);
        })
    }

    if(!historyStats){
        resetStats();
    }

    if(!socketInit){
        setSocketInit(true);
        props.socket.on('stats update', () => {
            console.log('socket reset stats');
            resetStats();
        });
    }

    if(props.showStats && historyStats){
    return <View style={{...styles.competitionView}}>
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

export default FriendInteractionModalStatsView;