import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';       //
import Colors from '../constants/colors';   //
import UserNetworking from '../networking/userNetworking';  //
import CompetitionNetworking from '../networking/competitionNetworking';    //
import Icon from 'react-native-vector-icons/Entypo';    //

//TODO: MAKE TEXT AND ROW STYLES DRY

const VenueLeaderboardTable = props => {

    const [scoresList, setScoresList] = useState(null);
    const [sortDirection, setSortDirection] = useState(-1);
    const [sortField, setSortField] = useState('place');

    if(!scoresList){
        /*
        CompetitionNetworking.getVenueCompetitionHistory(props.venueUser._id, null, null, res => {
            console.log('getVenueCompetitionHistory res = ', res);
            setCompetitions(res.competitions);
        }, err => {
            console.log('getVenueCompetitionHistory err = ', err);
        });
        */
        CompetitionNetworking.getLeaderboardInfo(props.venueUser._id, props.fromDate, props.toDate, res => {
            console.log('getLeaderboardInfo res = ', res);
            //setCompetitions(res.competitions);
            setScoresList(res.scoresList);
        }, err => {
            console.log('getLeaderboardInfo err = ', err);
        });
    }

    const selectSortField = (selectedSortField) => {
        console.log('sortDirection 1 = ', sortDirection);
        var direction = -1;
        if(sortField === selectedSortField){
            direction = -1*sortDirection;
            setSortDirection(direction);
        } else {
            setSortField(selectedSortField);
            setSortDirection(direction);
        }
        console.log('sortDirection 2 = ', sortDirection);
        var slClone = [...scoresList];
        console.log('direction = ', direction);
        if(selectedSortField === 'place'){
            slClone.sort((a, b) => {
                return direction*(a.place - b.place);
            });
        } else if (selectedSortField === 'username'){
            slClone.sort((a, b) => {
                var val = (a.user.username.toUpperCase() < b.user.username.toUpperCase()) ? -1 : 1;
                return direction*val;
            });
        } else if (selectedSortField === 'totalWL'){
            slClone.sort((a, b) => {
                var val = 0;
                if(a.losses === 0 && b.losses ===0){
                    val = a.totalWins > b.totalWins ? 1 : -1;
                } else if(a.losses === 0){
                    val = 1;
                } else if(b.losses === 0){
                    val = -1; 
                } else {
                    val = a.totalWins/a.totalLosses > b.totalWins/b.totalLosses ? 1 : -1;
                }
                return direction*val;
            });
        } else if (selectedSortField === 'raceWL'){
            slClone.sort((a, b) => {
                var val = a.score/a.uniqueUsersPlayed > b.score/b.uniqueUsersPlayed ? 1 : -1;
                return direction*val;
            });
        }
        console.log('slClone = ', slClone);
        setScoresList(slClone);
    }

return (
    <View style={{...styles.parentView, ...props.style}}>
                <View style={styles.tableContainer}>
                    <View 
                        onPress={() => {showModal(itemData.item)}} 
                        style={{flexDirection : 'row', borderBottomColor : Colors.inactiveGrey, borderBottomWidth : 1, justifyContent : 'space-evenly', marginHorizontal : 12}}>
                        <TouchableOpacity onPress={() => {selectSortField('place')}} style={{...styles.columnHeader}}>
                            {   sortField === 'place' ? 
                                <View style={{width : 14}}/>
                                : 
                                null
                            }
                            <Text style={styles.headerFont}>Place</Text>
                            {   sortField === 'place' ? 
                                sortDirection === -1 ?
                                    <Icon name="chevron-down" size={14} color={Colors.quasiBlack}/>
                                :
                                    <Icon name="chevron-up" size={14} color={Colors.quasiBlack}/>
                                : 
                                    null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {selectSortField('username')}} style={{...styles.columnHeader, flex : 3}}>
                            {   sortField === 'username' ? 
                                    <View style={{width : 14}}/>
                                    : 
                                    null
                            }
                            <Text style={styles.headerFont}>Player</Text>
                            {   sortField === 'username' ? 
                                sortDirection === -1 ?
                                    <Icon name="chevron-down" size={14} color={Colors.quasiBlack}/>
                                :
                                    <Icon name="chevron-up" size={14} color={Colors.quasiBlack}/>
                                : 
                                    null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {selectSortField('totalWL')}} style={{...styles.columnHeader, flex : 2}}>
                            {   sortField === 'totalWL' ? 
                                    <View style={{width : 14}}/>
                                    : 
                                    null
                            }
                            <Text style={styles.headerFont}>W/L</Text>
                            {   sortField === 'totalWL' ? 
                                sortDirection === -1 ?
                                    <Icon name="chevron-down" size={14} color={Colors.quasiBlack}/>
                                :
                                    <Icon name="chevron-up" size={14} color={Colors.quasiBlack}/>
                                : 
                                    null
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {selectSortField('raceWL')}} style={{...styles.columnHeader, flex : 2}}>
                            {   sortField === 'raceWL' ? 
                                    <View style={{width : 14}}/>
                                    : 
                                    null
                            }
                            <Text style={styles.headerFont}>Races Won</Text>
                            {   sortField === 'raceWL' ? 
                                sortDirection === -1 ?
                                    <Icon name="chevron-down" size={14} color={Colors.quasiBlack}/>
                                :
                                    <Icon name="chevron-up" size={14} color={Colors.quasiBlack}/>
                                : 
                                    null
                            }
                        </TouchableOpacity>

                    </View>
                    <View style={{flex : 4, marginHorizontal : 12}}>
                        {
                            scoresList ? 
                            /*
                            <FlatList 
                                data={scoresList} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    <TouchableOpacity 
                                        onPress={() => {}} 
                                        style={{width : '100%', flexDirection : 'row', borderBottomColor : Colors.quasiBlack, borderBottomWidth : 1, justifyContent : 'space-evenly', paddingTop : 4}}>
                                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.place}</Text>
                                        </View>
                                        <View style={{flex : 3, justifyContent : 'flex-start', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.user.username}</Text>
                                        </View>
                                        <View style={{flex : 2, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.totalWins}/{itemData.item.totalLosses}</Text>
                                        </View>
                                        <View style={{flex : 2, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.score}/{itemData.item.uniqueUsersPlayed}</Text>
                                        </View>
                                        
                                    </TouchableOpacity>
                                )}>
                            </FlatList>
                            */
                                    scoresList.map(score => {
                                        return <TouchableOpacity 
                                                    onPress={props.onRowPress ? () => {props.onRowPress(score)} : null} 
                                                    style={
                                                        score.user._id === props.userId ? 
                                                        {...styles.scoreRow, backgroundColor : Colors.activeTeal} : 
                                                        props.userFriendsIds.includes(score.user._id) ? 
                                                        {...styles.scoreRow, backgroundColor : Colors.pendingBlue} :
                                                        styles.scoreRow}
                                                >
                                                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                                        <Text style={score.user._id === props.userId || props.userFriendsIds.includes(score.user._id) ? styles.activeScoreRowText : null}>
                                                            {score.place}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex : 3, justifyContent : 'flex-start', alignItems : 'center', paddingVertical : 4}}>
                                                        <Text style={score.user._id === props.userId || props.userFriendsIds.includes(score.user._id) ? styles.activeScoreRowText : null}>
                                                            {score.user.username}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex : 2, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                                        <Text style={score.user._id === props.userId || props.userFriendsIds.includes(score.user._id) ? styles.activeScoreRowText : null}>
                                                            {score.totalWins}/{score.totalLosses}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex : 2, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                                        <Text style={score.user._id === props.userId || props.userFriendsIds.includes(score.user._id) ? styles.activeScoreRowText : null}>
                                                            {score.score}/{score.uniqueUsersPlayed}
                                                        </Text>
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                    })                                    
                            :
                            null
                        }
                    
                    </View>
                </View>
                
            </View>
)
                    }

const styles = StyleSheet.create({
    screen : {
      flex:1,
      alignItems: 'center',
      marginTop: getStatusBarHeight(),
    },
    parentView : {
        flex : 1,
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    tableContainer : {
      flex : 1,
      width : '100%',
      height : '100%',
      justifyContent : 'center',
      //alignItems : 'center'
    },
    tableFilterContainer : {
        //flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        //alignItems : 'flex-end',
        //width : '100%',
        //paddingBottom : 20,
        //height : 56
    },
    headerFont : {
        fontWeight : '600', 
        fontSize : 16
    },
    columnHeader : {
        flex : 1, 
        justifyContent : 'center', 
        alignItems : 'center', 
        flexDirection : 'row'
    },
    scoreRow : {
        width : '100%', 
        flexDirection : 'row', 
        borderBottomColor : Colors.quasiBlack, 
        borderBottomWidth : 1, 
        justifyContent : 'space-evenly', 
        paddingTop : 4
    },
    activeScoreRowText : {
        color : 'white',
        fontWeight : '600'
    }
    
  
  });
  
  export default VenueLeaderboardTable;