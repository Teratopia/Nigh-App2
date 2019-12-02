import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';       //
import Icon from 'react-native-vector-icons/Entypo';        //

const CasLeagueVenueUserPromotionView = props => {

    return (
            <TouchableOpacity style={styles.promotionContainer} onPress={() => props.setPromotionToEdit(props.promotion._id)}>
                <View style={styles.promotionRowsContainer}>
                    <View style={{...styles.promotionRowContainer, marginTop : 4}}>
                        <View style={{...styles.promotionRowContainerElement, flex : 2}}>
                            <Text style={styles.promotionRowContainerElementHeaderText}>Name</Text>
                        </View>
                        <View style={{...styles.promotionRowContainerElement, flex : 1}}>
                            <Text style={styles.promotionRowContainerElementHeaderText}>Image</Text>
                        </View>
                        <View style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementHeaderText}>From</Text>
                        </View>
                        <View style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementHeaderText}>To</Text>
                        </View>
                    </View>
                    <View style={styles.promotionRowContainer}>
                        <View style={{...styles.promotionRowContainerElement, flex : 2}}>
                            <Text style={styles.promotionRowContainerElementValueText}>{props.promotion.name}</Text>
                            {
                                props.promotion.isActive ?
                                <Text style={styles.promotionRowContainerElementValueText}>(Active)</Text>
                                : null
                            }
                        </View>
                        <View style={{...styles.promotionRowContainerElement, flex : 1}}>
                            {
                                props.promotion.imageId ? 
                                <Icon name="check" size={14} color={Colors.activeTeal} />
                                :
                                <Icon name="cross" size={14} color={Colors.dangerRed} />
                            }
                        </View>
                        <View style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementValueText}>
                                {props.promotion.fromDate instanceof Date ? 
                                props.promotion.fromDate.toUTCString() : 
                                new Date(props.promotion.fromDate).toUTCString()}
                            </Text>
                        </View>
                        <View style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementValueText}>
                                {props.promotion.toDate instanceof Date ? 
                                props.promotion.toDate.toUTCString() : 
                                new Date(props.promotion.toDate).toUTCString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  promotionContainer : {
    width : '100%',
    //margin : 12,
  },
  promotionRowsContainer : {
      //width : '100%',
    margin : 8,
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    borderRadius : 8,
    padding : 4,
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

export default CasLeagueVenueUserPromotionView;