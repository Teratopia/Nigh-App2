import React, {useState} from 'react';
import { View, StyleSheet, Text, Button, Modal, DatePickerIOS, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import ModalHeader from '../components/ModalHeader';  //
import { getStatusBarHeight } from 'react-native-status-bar-height';  //
import VenueLeaderboardTable from '../components/VenueLeaderboardTable';  //
import Colors from '../constants/colors';       //
import moment from 'moment';
import CompetitionNetworking from '../networking/competitionNetworking';    //
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit'


const CasLeagueVenueUserStatsScreen = props => {
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [dateToEdit, setDateToEdit] = useState();
  const [gamesPlayedTimeFrame, setLocalGamesPlayedTimeFrame] = useState('month');
  const [gameHistory, setGameHistory] = useState();
  const [isInit, setIsInit] = useState(false);

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  function getDates(startDate, stopDate, includeAll) {
      var dateArray = new Array();
      var currentDate = startDate;
      while (currentDate <= stopDate) {
          var num = new Date(currentDate).getDate();
          if(includeAll && num % 2 === 1){
            dateArray.push(num);
          }
          if(num % 2 === 0){
            dateArray.push(num);
          }
          currentDate = currentDate.addDays(1);
      }
      return dateArray;
  }

  function formatLabels(value, now){
    var labels = [];
    var before = null;
    if(value === 'week'){
      labels = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
      var dayNum = moment().day();
      var previous = labels.splice(dayNum, (7-dayNum));
      previous.push(...labels);
      labels = previous;
      before = moment().subtract(7, 'days').toDate();
    } else if (value === 'month'){
      before = moment().subtract(1, 'months').toDate();
      labels = getDates(before, now);
      console.log('formatLabels before = ', before);
    } else if (value === 'quarter'){
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      before = moment().subtract(3, 'months');
      labels = labels.splice(before.month(), 4);
      before = before.toDate();
    } else if (value === 'allTime'){
      //now = null;
    }
    return {labels : labels, beforeDate : before};
  }

  function formatCompetitionHistory(value, comps, labels, before, now){
    var retVal = {};
    console.log('formatCompetitionHistory 1 before = ', before);
    console.log('formatCompetitionHistory 1 now = ', now);
    if(value === 'month'){
      labels = getDates(before, now, true);
    } else if(value === 'quarter'){
      var firstMonth = before.getMonth();
      labels = [firstMonth, firstMonth+1, firstMonth+2, firstMonth+3];
    }

    labels.forEach(label => {
      console.log('for each label = ', label);
      retVal[label] = 0;

    });
    console.log('labels in format, ', labels);
    console.log('after labels in format retVal, ', retVal);
    if(value === 'week'){
      comps.forEach(comp => {
        var dayNum = new Date(comp.createDate).getDay();
        retVal[['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'][dayNum]] += 1;
      });
    } else if(value === 'month'){
      comps.forEach(comp => {
        var dateNum = new Date(comp.createDate).getDate();
        console.log('dateNum = ', dateNum);

        retVal[dateNum] += 1;
      });
    } else if(value === 'quarter'){
      comps.forEach(comp => {
        var monthNum = new Date(comp.createDate).getMonth();
        console.log('monthNum = ', monthNum);
        retVal[monthNum] += 1;
      });
    }
    var retValArray = Object.values(retVal);
    console.log('retValArray 1 = ', retValArray);
    if(value === 'quarter' && retValArray.length === 5){
      retValArray.splice(4, 1);
    } else if (value === 'month'){
      var nowDate = now.getDate();
      var modChunk = retValArray.splice(nowDate, retValArray.length);
      console.log('modChunk = ', modChunk);
      modChunk.push(...retValArray);
      retValArray = modChunk;
    }
    console.log('retValArray 2 = ', retValArray);
    var highestValue = 0;
    retValArray.forEach(val => {
      val > highestValue ? highestValue = val : null;
    })

    return {
      values : retValArray,
      highestValue : highestValue
    }

  }

  const setGamesPlayedTimeFrame = value => {
    setLocalGamesPlayedTimeFrame(value);
    var now = moment().toDate();
    var labelsAndBefore = formatLabels(value, now);
    var before = labelsAndBefore.beforeDate;
    var labels = labelsAndBefore.labels;
    console.log('setGamesPlayedTimeFrame labels = ', labels);
    console.log('setGamesPlayedTimeFrame before = ', before);
    
    CompetitionNetworking.getVenueCompetitionHistory(props.venueUser._id, before, now, res => {
      console.log('getVenueCompetitionHistory res = ', res);
      var vals = formatCompetitionHistory(value, res.competitions, labels, before, now);
      console.log('before = ', before);
      console.log('now = ', now);
      console.log('labels = ', labels);
      console.log('vals = ', vals);
      //setCompetitions(res.competitions);
      setGameHistory({
        labels: labels,
        datasets: [
          {
            data: vals.values,
            strokeWidth: 2, // optional
          },
        ],
      });
    }, err => {
        console.log('getVenueCompetitionHistory err = ', err);
    });
    
  }

  if(!isInit && !gameHistory){
    setGamesPlayedTimeFrame(gamesPlayedTimeFrame);
    setIsInit(true);
  }

    return (
          <SafeAreaView style={styles.screen}>
            <ModalHeader 
            title="ANALYTICS"
            leftIcon="new-message" 
            leftIconFunction={() => {props.setCurrentScreen('FEEDBACK')}}
            rightIcon="logout" 
            rightIconFunction={() => {props.setVenueUser(null)}}
            rightIconLibrary="AntDesign"
            />
          <ScrollView>
          <View style={{flexDirection : 'row', marginHorizontal : 4, marginTop : 8}}>
                <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                  <Text style={{fontSize : 18, fontWeight : '600'}}>Rankings</Text>
                </View>
          </View>
          <View style={{marginBottom : 12, width : '100%'}}>
            <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                  <Text>From</Text>
                </View>
                <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                  <Text>To</Text>
                </View>
            </View>
            <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                <View style={fromDate ? styles.activeButton : styles.inactiveButton}>
                    <Button onPress={() => {setDateToEdit('from')}} title={fromDate ? moment(fromDate).format("MMM Do YYYY") : 'START'} color="white"/>
                </View>
                <View style={toDate ? styles.activeButton : styles.inactiveButton}>
                    <Button onPress={() => {setDateToEdit('to')}} title={toDate ? moment(toDate).format("MMM Do YYYY") : 'END'} color="white"/>
                </View>
              </View>
            </View>
            {dateToEdit ?
                <Modal>
                    <View style={{flex : 1}}/>
                        <DatePickerIOS 
                            mode="date"
                            date={dateToEdit === 'from' ? fromDate || new Date() : toDate || new Date()}
                            onDateChange={newDate => {dateToEdit === 'from' ? setFromDate(newDate) : setToDate(newDate)}}
                            //maximumDate={fieldToEdit === 'fromDate' ? newPromotion.toDate : newPromotion.toDate.addDays(365)}
                            //minimumDate={fieldToEdit === 'toDate' ? newPromotion.fromDate : new Date()}
                        />
                        <Button title="SET DATE" onPress={() => {setDateToEdit(null)}} />
                    <View style={{flex : 1}}/>
                </Modal>
                :
              null}
            <VenueLeaderboardTable 
              venueUser={props.venueUser} 
              fromDate={fromDate} 
              toDate={toDate} 
              //style={{maxHeight : 400}}
              />

            
            {
              gameHistory ? 
              <View style={{justifyContent : 'center', width : '100%'}}>
                <View style={{flexDirection : 'row', marginHorizontal : 4, marginVertical : 8}}>
                  <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}>
                    <Text style={{fontSize : 18, fontWeight : '600'}}>Games Played</Text>
                  </View>
                </View>
                <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                  <View style={gamesPlayedTimeFrame === 'week' ? styles.activeButton : styles.inactiveButton}>
                        <Button onPress={() => {setGamesPlayedTimeFrame('week')}} title="Week" color="white"/>
                    </View>
                    <View style={gamesPlayedTimeFrame === 'month' ? styles.activeButton : styles.inactiveButton}>
                        <Button onPress={() => {setGamesPlayedTimeFrame('month')}} title="Month" color="white"/>
                    </View>
                    <View style={gamesPlayedTimeFrame === 'quarter' ? styles.activeButton : styles.inactiveButton}>
                        <Button onPress={() => {setGamesPlayedTimeFrame('quarter')}} title="Quarter" color="white"/>
                    </View>
                </View>
                <LineChart
                  data={gameHistory}
                  width={Dimensions.get('window').width-16} // from react-native
                  height={(Dimensions.get('window').width-16)*.618}
                  yAxisLabel={''}
                  chartConfig={{
                    backgroundColor: Colors.quasiBlack,
                    backgroundGradientFrom: Colors.pendingBlue,
                    backgroundGradientTo: Colors.dangerRed,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    marginHorizontal : 8,
                    marginBottom : 16,
                    borderRadius: 16
                  }}
                />
              </View>
              : null
            }
          </ScrollView>
          </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    width : '100%',
    marginTop: getStatusBarHeight(),
  },
  activeButton : {
      borderWidth : 1,
      borderColor : Colors.inactiveGrey,
      borderRadius : 8,
      margin : 4,
      flex : 1,
      backgroundColor : Colors.activeTeal
  },
  inactiveButton : {
      borderWidth : 1,
      borderColor : Colors.activeTeal,
      borderRadius : 8,
      margin : 4,
      flex : 1,
      backgroundColor : Colors.inactiveGrey
  },

});

export default CasLeagueVenueUserStatsScreen;