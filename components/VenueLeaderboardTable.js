import React, {useState} from 'react';
import {Text, View, Button, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';       //
import Colors from '../constants/colors';   //
import UserNetworking from '../networking/userNetworking';  //
import CompetitionNetworking from '../networking/competitionNetworking';    //

const VenueLeaderboardTable = props => {

    const [competitions, setCompetitions] = useState(null);
    const [sortDirection, setSortDirection] = useState('Descending');
    const [sortField, setSortField] = useState('Total Wins');
    const [formattedResults, setFormattedResults] = useState(null);

    if(!competitions){
        CompetitionNetworking.getVenueCompetitionHistory(props.venueUser._id, null, null, res => {
            console.log('getVenueCompetitionHistory res = ', res);
            setCompetitions(res.competitions);
        }, err => {
            console.log('getVenueCompetitionHistory err = ', err);
        });
    }

    if(!formattedResults){
        formatResults();
    }
    
    function formatResults(){
        var foo = {};
        if(competitions){
            competitions.forEach(comp => {
                if(comp.accepterResultClaim === 'win' && comp.challengerResultClaim === 'loss'){
                    if(foo[comp.accepterId]){
                        foo[comp.accepterId].wins ? foo[comp.accepterId].wins++ : foo[comp.accepterId].wins = 1;
                        foo[comp.challengerId].losses ? foo[comp.challengerId].losses++ : foo[comp.challengerId].losses = 1;
                    } else {
                        foo[comp.accepterId] = {userId : comp.accepterId, wins : 1};
                        foo[comp.challengerId] = {userId : comp.challengerId, losses : 1};
                    }
                } else if (comp.challengerResultClaim === 'win' && comp.accepterResultClaim === 'loss'){
                    if(foo[comp.challengerId]){
                        foo[comp.challengerId].wins ? foo[comp.challengerId].wins++ : foo[comp.challengerId].wins = 1;
                        foo[comp.accepterId].losses ? foo[comp.accepterId].losses++ : foo[comp.accepterId].losses = 1;
                    } else {
                        foo[comp.challengerId] = {userId : comp.challengerId, wins : 1};
                        foo[comp.accepterId] = {userId : comp.accepterId, losses : 1};
                    }
                }
            });
            console.log('foo 1 = ', foo);
            UserNetworking.getMultipleUsersById(Object.keys(foo), res => {
                var retVal = [];
                res.users.forEach(user => {
                    foo[user._id].user = user;
                    foo[user._id].losses === 0 ? foo[user._id].wlratio = 0 : foo[user._id].wlratio = foo[user._id].wins/foo[user._id].losses;
                    retVal.push(foo[user._id]);
                });
                console.log('retVal 2 = ', retVal);
                setFormattedResults(retVal);
            }, err => {
                console.log('getMultipleUsersById err = ', err);
            })
        }
    }

    const selectSortField = (e) => {
        setSortField(e);
        var sortField = e === 'Total Wins' ? 'wins' : 'wlratio';
        var frClone = [...formattedResults];
        frClone.sort((a, b) => {
            if(a[sortField] > b[sortField]){
                return sortDirection === 'Ascending' ? 1 : -1;
            } else if (a[sortField] < b[sortField]){
                return sortDirection === 'Ascending' ? -1 : 1;
            } else {
                return 0;
            }
        });
        setFormattedResults(frClone);
    }



return (
    <View style={styles.parentView}>
                <View style={styles.tableContainer}>
                    <View style={styles.tableFilterContainer}>
                        {
                            /*
                        <Text style={{fontSize : 16}}>Sort </Text>
                        <TouchableOpacity onPress={() => {setSortDirection(sortDirection === 'Descending' ? 'Ascending' : 'Descending')}}>
                        <Text style={{fontSize : 16, color : Colors.activeTeal}}>{sortDirection}</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize : 16}}> By </Text>
                        
                        <Dropdown
                            containerStyle={{
                                width : 170, 
                                height : 40, 
                                justifyContent : 'center', 
                                padding : 0,
                                margin : 0
                            }}
                            textColor={Colors.activeTeal}
                            value={sortField}
                            data={[
                                    {value : "Total Wins"},
                                    {value : "Win Loss Ratio"},
                                    //{value : "Win/Loss Ratio"},
                                    //{value : "Contested Games"},
                            ]}
                            onChangeText={e => {selectSortField(e)}}
                            />
                                */
                        }
                        <Button title={sortField} onPress={() => { selectSortField(sortField === 'Total Wins' ? 'Win Loss Ratio' : 'Total Wins') }} />
                    </View>
                    <View 
                        onPress={() => {showModal(itemData.item)}} 
                        style={{flexDirection : 'row', borderBottomColor : Colors.inactiveGrey, borderBottomWidth : 1, justifyContent : 'space-evenly', marginHorizontal : 12}}>
                        <View style={{flex : 2, justifyContent : 'flex-start', alignItems : 'center'}}>
                            <Text>Player</Text>
                        </View>
                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Text>Wins</Text>
                        </View>
                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Text>Losses</Text>
                        </View>
                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                            <Text>W/L</Text>
                        </View>
                        

                    </View>
                    <View style={{flex : 4, marginHorizontal : 12}}>
                        {
                            formattedResults ? 
                            <FlatList 
                                data={formattedResults} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    <TouchableOpacity 
                                        onPress={() => {showModal(itemData.item)}} 
                                        style={{width : '100%', flexDirection : 'row', borderBottomColor : Colors.quasiBlack, borderBottomWidth : 1, justifyContent : 'space-evenly', paddingTop : 4}}>
                                        <View style={{flex : 2, justifyContent : 'flex-start', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.user.username}</Text>
                                        </View>
                                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.wins}</Text>
                                        </View>
                                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.losses}</Text>
                                        </View>
                                        <View style={{flex : 1, justifyContent : 'center', alignItems : 'center', paddingVertical : 4}}>
                                            <Text>{itemData.item.wlratio.toFixed(2)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}>
                            </FlatList>
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
    }
    
  
  });
  
  export default VenueLeaderboardTable;