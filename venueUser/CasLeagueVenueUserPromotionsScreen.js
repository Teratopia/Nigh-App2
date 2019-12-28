import React, {useState} from 'react';
import { View, StyleSheet, FlatList, Text, Button, TextInput, Modal, DatePickerIOS, SafeAreaView, ScrollView } from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';
import VenueNetworking from '../networking/venueNetworking';    //
import Colors from '../constants/colors';       //
import CasLeagueVenueUserPromotionEdit from '../components/CasLeagueVenueUserPromotionEdit';    //
import CasLeagueVenueUserPromotionView from '../components/CasLeagueVenueUserPromotionView';    //
import CasLeagueSearchVenuePromotionLeaguePlacePrize from '../components/CasLeagueSearchVenuePromotionLeaguePlacePrize';
import moment from 'moment';

const CasLeagueVenueUserPromotionsScreen = props => {

    const [promotionToEdit, setPromotionToEdit] = useState(null); 
    const [leagueTimeFrame, setLeagueTimeFrame] = useState(null); 
    const [viewLeagueStartDatePicker, setViewLeagueStartDatePicker] = useState(false); 
    const [league, setLeague] = useState(props.venueUser.activeLeague || {}); 
    const [pushNotification, setPushNotification] = useState(props.venueUser.pushNotificationPromotion);

    /*
    _id : mongoose.Schema.Types.ObjectId,
    venueId : String,
    createDate : Date,
    startDate : Date,
    endDate : Date,
    firstPlacePrizeTitle : String,
    firstPlacePrizeDescription : String,
    firstPlacePrizeImageId : String,
    firstPlaceWinnerId : String,
    secondPlacePrizeTitle : String,
    secondPlacePrizeDescription : String,
    secondPlacePrizeImageId : String,
    secondPlaceWinnerId : String,
    thirdPlacePrizeTitle : String,
    thirdPlacePrizeDescription : String,
    thirdPlacePrizeImageId : String,
    thirdPlaceWinnerId : String,
    timeFrame : String
    */

    if(!leagueTimeFrame){
        props.venueUser.activeLeague && props.venueUser.activeLeague.timeFrame ?
        setLeagueTimeFrame(props.venueUser.activeLeague.timeFrame) : 
        setLeagueTimeFrame('monthly');
    }

    const setPushNotificationAndUpdateUser = value => {
        let venClone = {...props.venueUser};
        venClone.pushNotificationPromotion = value;
        VenueNetworking.updateVenue(venClone, venue => {
            props.setVenueUser(venue);
            //setPushNotification(value);
        });
    }

    const saveNewPromotion = (newPromotionImage, newPromotion) => {
        console.log('saveNewPromotion 2 = ');
        var clone = {...newPromotion};
        clone.toDate = clone.toDate.toString();
        clone.fromDate = clone.fromDate.toString();
        console.log('saveNewPromotion clone = ', clone);
        VenueNetworking.upsertVenuePromotion(
            newPromotionImage, 
            props.venueUser._id, 
            clone, 
            res => {
            console.log('upsertVenuePromotion res = ', res);
            props.setVenueUser(res.venue);
            setPromotionToEdit(null);
        }, error => {
            console.log('error = ', error);
        });
    }
    
    const deletePromotion = (promotionId) => {
        VenueNetworking.deletePromotion(
            props.venueUser._id, 
            promotionId,
            res => {
            console.log('deletePromotion res = ', res);
            props.setVenueUser(res.venue);
        }, error => {
            console.log('error = ', error);
        });
    }

    const capFirstLetter = word => {
        return word.replace(/^\w/, c => c.toUpperCase());
    }

    const editPrize = (place, field, value) => {
        var fieldName = '';
        let clone = {...league};
        if(field === 'title' || field === 'description'){
            if(place === 1){
                fieldName += 'firstPlacePrize' + capFirstLetter(field);
            } else if (place === 2){
                fieldName += 'secondPlacePrize' + capFirstLetter(field);
            } else if (place === 3){
                fieldName += 'thirdPlacePrize' + capFirstLetter(field);
            }
        } else {
            fieldName = field;
        }
        clone[fieldName] = value;
        console.log('clone league = ', clone);
        if(field === 'timeFrame' || field === 'startDate') {
            if(clone.timeFrame === 'weekly'){
                clone.endDate = moment(clone.startDate).add(7, 'days').toDate();
            } else if(clone.timeFrame === 'fortnightly'){
                clone.endDate = moment(clone.startDate).add(14, 'days').toDate();
            } else if(clone.timeFrame === 'monthly'){
                clone.endDate = moment(clone.startDate).add(1, 'months').toDate();
            }
        }
            let venClone = {...props.venueUser};
            venClone.activeLeague = clone;
            VenueNetworking.updateVenue(venClone, res => {
                console.log('editPrize res = ', res);
                setLeague(clone);
                props.setVenueUser(res);
                //setPushNotification(value);
            });
    }

    return (
          <View style={styles.screen}>
            <ModalHeader 
            title="PROMOTIONS"
            leftIcon="new-message" 
            leftIconFunction={() => {props.setCurrentScreen('FEEDBACK')}}
            rightIcon="logout" 
            rightIconFunction={() => {props.setVenueUser(null)}}
            rightIconLibrary="AntDesign"
            />
            <SafeAreaView 
            //style={styles.screen}
            style={{width : '100%', 
            //alignItems : 'center'
        }}
            >
            <ScrollView 
                
                //showsHorizontalScrollIndicator={false}
                //directionalLockEnabled={true}
                //alwaysBounceHorizontal={false}
                //centerContent={true}
                //contentContainerStyle={{justifyContent : 'center', alignItems : 'center'}}
                >
            <View style={{alignItems : 'center', marginBottom : 62}}>

            

            <View style={styles.headerView}>
                <Text style={{fontSize : 18, fontWeight : '600'}}>Notification</Text>
            </View>
            <View style={styles.inputFormTextInput}>
                <TextInput 
                    placeholder='Ad shown on push notification (max 42 chars)'
                    maxLength={42}
                    onSubmitEditing={e => {setPushNotificationAndUpdateUser(e.nativeEvent.text)}}
                    style={{flex : 1, textAlign : 'center', color : Colors.quasiBlack}}
                    placeholderTextColor={Colors.inactiveGrey}
                    defaultValue={props.venueUser.pushNotificationPromotion}
                    //value={pushNotification}
                />
            </View>

            <View style={styles.headerView}>
                <Text style={{fontSize : 18, fontWeight : '600'}}>League Settings</Text>
            </View>

            <View style={styles.headerView}>
                <Text style={{fontSize : 14, fontWeight : '400', color : Colors.inactiveGrey}}>Time Frame</Text>
            </View>
            <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                <View style={league.timeFrame === 'weekly' ? styles.activeButton : styles.inactiveButton}>
                    <Button onPress={() => {editPrize(null, 'timeFrame', 'weekly')}} title="Weekly" color="white"/>
                </View>
                <View style={league.timeFrame === 'fortnightly' ? styles.activeButton : styles.inactiveButton}>
                    <Button onPress={() => {editPrize(null, 'timeFrame', 'fortnightly')}} title="Fortnightly" color="white"/>
                </View>
                <View style={league.timeFrame === 'monthly' ? styles.activeButton : styles.inactiveButton}>
                    <Button onPress={() => {editPrize(null, 'timeFrame', 'monthly')}} title="Monthly" color="white"/>
                </View>
            </View>

            <View style={styles.headerView}>
                <Text style={{fontSize : 14, fontWeight : '400', color : Colors.inactiveGrey}}>Beginning Date</Text>
            </View>
            <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                <View style={styles.activeButton}>
                    <Button onPress={() => {setViewLeagueStartDatePicker(true)}} title={moment(league.startDate).format("MMM Do YYYY")} color="white"/>
                </View>
            </View>

            {
                viewLeagueStartDatePicker ?
                <Modal>
                    <View style={{flex : 1}}/>
                        <DatePickerIOS 
                            mode="date"
                            date={new Date(league.startDate)}
                            onDateChange={newDate => {editPrize(null, 'startDate', newDate)}}
                            //maximumDate={fieldToEdit === 'fromDate' ? newPromotion.toDate : newPromotion.toDate.addDays(365)}
                            //minimumDate={fieldToEdit === 'toDate' ? newPromotion.fromDate : new Date()}
                        />
                        <Button title="SET DATE" onPress={() => {setViewLeagueStartDatePicker(false)}} />
                    <View style={{flex : 1}}/>
                </Modal>
                :
                null
            }

            <CasLeagueSearchVenuePromotionLeaguePlacePrize 
                prizeTitle='First' 
                prizeNumber={1} 
                editPrize={editPrize} 
                title={league.firstPlacePrizeTitle}
                description={league.firstPlacePrizeDescription}
                imageId={league.firstPlacePrizeImageId}
                />
            <CasLeagueSearchVenuePromotionLeaguePlacePrize 
                prizeTitle='Second' 
                prizeNumber={2} 
                editPrize={editPrize} 
                title={league.secondPlacePrizeTitle}
                description={league.secondPlacePrizeDescription}
                imageId={league.secondPlacePrizeImageId}
                />
            <CasLeagueSearchVenuePromotionLeaguePlacePrize 
                prizeTitle='Third' 
                prizeNumber={3} 
                editPrize={editPrize} 
                title={league.thirdPlacePrizeTitle}
                description={league.thirdPlacePrizeDescription}
                imageId={league.thirdPlacePrizeImageId}
                />

            <View style={styles.headerView}>
                <Text style={{fontSize : 18, fontWeight : '600'}}>Pop Ups</Text>
            </View>
            
            <CasLeagueVenueUserPromotionEdit 
                savePromotion={saveNewPromotion} 
            />
            <View style={{flexDirection : 'row'}}>
                <FlatList 
                    style={{
                        flex : 1
                    }}
                    data={ props.venueUser.venuePromotions } 
                    keyExtractor={(item, index) => 'key'+index}
                    renderItem={itemData => (
                        itemData.item._id === promotionToEdit ?
                        <CasLeagueVenueUserPromotionEdit 
                            promotion={itemData.item}
                            savePromotion={saveNewPromotion} 
                            setPromotionToEdit={setPromotionToEdit}
                            deletePromotion={deletePromotion}
                        />
                        :
                        <CasLeagueVenueUserPromotionView 
                            promotion={itemData.item} 
                            setPromotionToEdit={setPromotionToEdit}
                        />
                    )}>            
                </FlatList>
            </View>     
            </View>
            </ScrollView>
            </SafeAreaView>       
        </View>
    );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    width : '100%',
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
  },
  headerView : {
    marginVertical : 4
  },
  promotionContainer : {
    width : '100%',
    backgroundColor : 'pink'
    //margin : 12,

  },
  promotionRowsContainer : {
      //width : '100%',
    margin : 8,
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    borderRadius : 8,
    padding : 4
  },
  promotionRowContainer : {
    flexDirection : 'row'
  },
  promotionRowContainerElement : {
    //borderWidth : 1,
    //borderColor : Colors.inactiveGrey,
    //borderRadius : 8,
    paddingHorizontal : 4,
    justifyContent : 'center',
    alignItems : 'center',
    flex : 2
  },
  promotionRowContainerElementHeaderText : {
      color : Colors.inactiveGrey,
      fontSize : 10,
      fontWeight : '500',
      textAlign : 'center'
  },
  promotionRowContainerElementValueText : {
    color : Colors.quasiBlack,
    fontSize : 12,
    fontWeight : '500',
    textAlign : 'center'
},
  modalContainer : {
      width : '100%',
      height : '100%',
      justifyContent : 'center',
      alignItems : 'center',
      //backgroundColor : 'green'
  },
  setDateButton : {
      borderWidth : 1,
      borderColor : Colors.inactiveGrey,
      borderRadius : 8,
      backgroundColor : Colors.activeTeal,
      marginTop : 12
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
  inputFormTextInput : {
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    margin : 4,
    marginHorizontal : 8,
    borderRadius : 8,
    //width : '100%',
    textAlign : 'center',
    padding : 8,
    flexDirection : 'row'
},

});

export default CasLeagueVenueUserPromotionsScreen;