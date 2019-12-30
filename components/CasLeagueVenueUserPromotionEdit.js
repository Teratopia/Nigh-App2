import React, {useState} from 'react';
import {Text, View, TextInput, Button, DatePickerIOS, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';    //
import VenueNetworking from '../networking/venueNetworking';    //
import Colors from '../constants/colors';       //
import Icon from 'react-native-vector-icons/Entypo';    //
import {encode as btoa} from 'base-64';     //

const CasLeagueVenueUserPromotionEdit = props => {

    const [fieldToEdit, setFieldToEdit] = useState(null);
    const [newPromotionImage, setNewPromotionImage] = useState(null);
    const [viewImageModal, setViewImageModal] = useState(false);
    const [newPromotion, setNewPromotion] = useState(props.promotion ? props.promotion : {
        name : 'New Promotion',
        fromDate : new Date(),
        toDate : addDays(new Date(), 1),
        isActive : false
    });

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }

    const choosePromotionImage = () => {
        if(!viewImageModal && newPromotionImage){
            console.log('choosePromotionImage 1');
            setViewImageModal(true);
        } else {
            console.log('choosePromotionImage 2');
            setViewImageModal(false);
            const options = {
                noData: true,
            }
            ImagePicker.launchImageLibrary(options, response => {
                console.log('image picker response = ', response);
                if (response.uri) {
                    setNewPromotionImage(response);
                }
            });
        }        
    }

    updateNewPromotion = (field, value, keepModalOpen) => {
        var clone = {...newPromotion};
        clone[field] = value;
        setNewPromotion(clone);
        if(!keepModalOpen){
            setFieldToEdit(null);
        }
    }

    saveNewPromotion = () => {
        console.log('saveNewPromotion 1');
        props.savePromotion(newPromotionImage, newPromotion);
        if(!newPromotion._id){
            setNewPromotion({
                name : 'New Promotion',
                fromDate : new Date(),
                toDate : addDays(new Date(), 1),
                isActive : false
            });
            setNewPromotionImage(null);
        }
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };
    
    const getVenuePromotionImage = () => {
        VenueNetworking.getVenuePromotionImage(
            props.promotion,
            res => {
            console.log('getVenuePromotionImage res = ', res);
            if(res.image && res.image.source && res.image.source.data){
                setNewPromotionImage({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data)});
            }
        }, error => {
            console.log('error = ', error);
        });
    }

    if(!newPromotionImage && props.promotion && props.promotion.imageId){
        getVenuePromotionImage();
    }

    return (
            <View style={styles.promotionContainer}>
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

                            <TouchableOpacity onPress={() => {setFieldToEdit('name')}} style={{...styles.promotionRowContainerElement, flex : 2}}>
                                {
                                    fieldToEdit === 'name' ? 
                                    <TextInput style={{...styles.promotionRowContainerElement, 
                                        width : '100%',
                                        borderWidth : 1,
                                        borderColor : Colors.inactiveGrey,
                                        borderRadius : 8,
                                        textAlign : 'center',
                                        marginVertical : 8,
                                        color : Colors.quasiBlack
                                    }}
                                        placeholderTextColor={Colors.inactiveGrey}
                                        defaultValue={newPromotion.name}
                                        onSubmitEditing={e => {updateNewPromotion('name', e.nativeEvent.text)}}
                                        returnKeyType="done"
                                    />
                                    :
                                    <Text style={styles.promotionRowContainerElementValueText}>{newPromotion.name}</Text>
                                }
                            </TouchableOpacity>
                        
                        <TouchableOpacity onPress={choosePromotionImage} style={{...styles.promotionRowContainerElement, flex : 1}}>
                            {
                                newPromotionImage || ( props.promotion && props.promotion.imageId ) ? 
                                <Icon name="check" size={14} color={Colors.activeTeal} onPress={choosePromotionImage} />
                                :
                                <Icon name="cross" size={14} color={Colors.dangerRed} onPress={props.promotion && props.promotion.imageId ? getVenuePromotionImage : choosePromotionImage} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setFieldToEdit('fromDate')}} style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementValueText}>
                                {newPromotion.fromDate instanceof Date ? 
                                newPromotion.fromDate.toUTCString() : 
                                new Date(newPromotion.fromDate).toUTCString()}
                            
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {setFieldToEdit('toDate')}} style={styles.promotionRowContainerElement}>
                            <Text style={styles.promotionRowContainerElementValueText}>
                                {newPromotion.toDate instanceof Date ? 
                                newPromotion.toDate.toUTCString() : 
                                new Date(newPromotion.toDate).toUTCString()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.promotionRowContainer}>
                        {
                            props.promotion && props.promotion._id ? 
                            <View style={{...styles.promotionRowContainer, flex : 3}}>
                                <TouchableOpacity 
                                    style={styles.activeButton}
                                    onPress={saveNewPromotion} color="white"
                                >
                                    <Text style={{fontSize : 14, color : 'white'}}>SAVE</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={newPromotion.isActive ? styles.activeButton : {...styles.activeButton, backgroundColor : Colors.inactiveGrey}}
                                    onPress={newPromotion.isActive ? () => {updateNewPromotion('isActive', false)} : () => {updateNewPromotion('isActive', true)}} color="white"
                                >
                                    <Text style={{fontSize : 14, color : 'white'}}>{newPromotion.isActive ? "ACTIVE" : "INACTIVE"}</Text>
                                </TouchableOpacity>
                                {
                                /*
                                <TouchableOpacity 
                                    style={{...styles.activeButton, backgroundColor : Colors.inactiveGrey}}   
                                    onPress={getVenuePromotionImage}                                 
                                >
                                    <Text style={{fontSize : 14, color : 'white'}}>IMAGE</Text>
                                </TouchableOpacity>
                                */
                                }
                                <TouchableOpacity 
                                    style={{...styles.activeButton, backgroundColor : Colors.inactiveGrey}}   
                                    onPress={() => props.setPromotionToEdit(null)}                             
                                >
                                    <Text style={{fontSize : 14, color : 'white'}}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{...styles.activeButton, backgroundColor : Colors.dangerRed}}   
                                    onPress={() => {props.deletePromotion(props.promotion._id)}}                             
                                >
                                    <Text style={{fontSize : 14, color : 'white'}}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.activeButton}>
                                <Button title="SAVE" onPress={saveNewPromotion} color="white"/>
                            </View>
                        }
                    </View>
                </View>
                {
                fieldToEdit === 'toDate' || fieldToEdit === 'fromDate' ?
                <Modal>
                    <View style={{flex : 1}}/>
                        <DatePickerIOS 
                            date={newPromotion[fieldToEdit] instanceof Date ? 
                                newPromotion[fieldToEdit] : 
                                new Date(newPromotion[fieldToEdit])}
                            onDateChange={newDate => {updateNewPromotion(fieldToEdit, newDate, true)}}
                            //maximumDate={fieldToEdit === 'fromDate' ? newPromotion.toDate : newPromotion.toDate.addDays(365)}
                            //minimumDate={fieldToEdit === 'toDate' ? newPromotion.fromDate : new Date()}
                        />
                        <Button title="SET DATE" onPress={() => {setFieldToEdit(null)}} />
                    <View style={{flex : 1}}/>
                </Modal>
                :
                null
            }
            {
                newPromotionImage && viewImageModal ? 
                <Modal>
                    <View style={{flex : 1, justifyContent : 'center', alignItems : 'center'}}/>
                        <Image source={newPromotionImage} 
                        style={{flex : 8}}
                        />
                        <View style={{flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                            <Button title="CLOSE" onPress={() => {setViewImageModal(false)}} />
                            <Button title="CHANGE" onPress={choosePromotionImage} />
                        </View>
                        
                    <View style={{flex : 1}}/>
                </Modal> : 
                null
            }

            </View>

            
            
            
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
      backgroundColor : Colors.activeTeal,
      justifyContent : 'center',
      alignItems : 'center'
  }

});

export default CasLeagueVenueUserPromotionEdit;