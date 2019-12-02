import React, {useState} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';
import VenueNetworking from '../networking/venueNetworking';    //
import Colors from '../constants/colors';       //
import CasLeagueVenueUserPromotionEdit from '../components/CasLeagueVenueUserPromotionEdit';    //
import CasLeagueVenueUserPromotionView from '../components/CasLeagueVenueUserPromotionView';    //

const CasLeagueVenueUserPromotionsScreen = props => {

    const [promotionToEdit, setPromotionToEdit] = useState(null); 


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

    return (
          <View style={styles.screen}>
            <ModalHeader 
            title="PROMOTIONS"
            leftIcon="new-message" 
            leftIconFunction={() => {}}
            rightIcon="logout" 
            rightIconFunction={() => {props.setVenueUser(null)}}
            rightIconLibrary="AntDesign"
            />
            
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
    );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    width : '100%',
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
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
  }

});

export default CasLeagueVenueUserPromotionsScreen;