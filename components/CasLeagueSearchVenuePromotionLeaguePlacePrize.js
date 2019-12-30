import React, {useState} from 'react';
import {Text, View, TextInput, Button, DatePickerIOS, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';    //
import ImageNetworking from '../networking/imageNetworking';    //
import Colors from '../constants/colors';       //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Icon from 'react-native-vector-icons/Entypo';    //
import {encode as btoa} from 'base-64';     //

const CasLeagueSearchVenuePromotionLeaguePlacePrize = props => {

    const [img, setImg] = useState();
    const [showImg, setShowImg] = useState();

    const launchImagePicker = () => {
        console.log('launchImagePicker');
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            console.log('image picker response = ', response);
            if (response.uri) {
                ImageNetworking.uploadImageAndReturnId(response, res => {
                    let fieldName = props.prizeTitle.toLowerCase() + 'PlacePrizeImageId';
                    props.editPrize(null, fieldName, res.id);
                    setShowImg(false)
                }, err => {
                    console.log('uploadImageAndReturnId err = ', err)
                });
            }
        });
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const showImage = () => {
        ImageNetworking.getImageById(
            props.imageId,
            res => {
            console.log('getImageById res = ', res);
            if(res.image && res.image.source && res.image.source.data){
                setImg({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data)});
                setShowImg(true);
            }
        }, error => {
            console.log('error = ', error);
        });
    }


return <View style={{width : '100%', alignItems : 'center'}}>
            <View style={styles.headerView}>
                <Text style={{fontSize : 14, fontWeight : '400', color : Colors.inactiveGrey}}>
                    {props.prizeTitle} Place Prize
                </Text>
            </View>
            <View style={styles.inputFormTextInput}>
                <TextInput 
                    placeholder='Prize Title (max 42 chars)'
                    placeholderTextColor={Colors.inactiveGrey}
                    maxLength={42}
                    onSubmitEditing={e => {props.editPrize(props.prizeNumber, 'title', e.nativeEvent.text)}}
                    style={{
                        flex : 1, 
                        color : Colors.quasiBlack,
                         textAlign : 'center'
                    }}
                    defaultValue={props.title}
                    returnKeyType="done"
                />
            </View>
            <View style={styles.inputFormTextInput}>
                <TextInput 
                    placeholder='Prize Description (max 144 chars)'
                    placeholderTextColor={Colors.inactiveGrey}
                    maxLength={144}
                    onSubmitEditing={e => {props.editPrize(props.prizeNumber, 'description', e.nativeEvent.text)}}
                    style={{
                        flex : 1, 
                        color : Colors.quasiBlack,
                        //textAlign : 'center', 
                        minHeight : 42
                    }}
                    multiline={true}
                    defaultValue={props.description}
                    returnKeyType="done"
                />
            </View>
            <View style={{flexDirection : 'row', marginHorizontal : 4}}>
                <View style={props.imageId ? styles.activeButton : styles.inactiveButton}>
                    {
                        props.imageId ? 
                        <Button onPress={() => {showImage()}} title="Image" color="white"/>
                        :   
                        <Button onPress={() => {launchImagePicker()}} title="Image" color="white"/>
                    }
                </View>
            </View>

            {
                showImg ? 
                <Modal>
                    <View 
                        //onPress={() => {setShowImg(false)}}
                        style={{
                            flex : 1,
                            width : '100%',
                            alignItems : 'center',
                            justifyContent : 'center',
                            paddingVertical : getStatusBarHeight(),
                            backgroundColor : 'black',
                        }}
                        >
                        <Image source={img} 
                        style={{
                            flex : 5,
                            //width : '100%',
                            //alignItems : 'center',
                            //justifyContent : 'center'
                            resizeMode='contain'
                        }}
                        />
                        <View style={{flexDirection : 'row', marginHorizontal : 4, flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                            <View style={styles.activeButton}>
                                <Button onPress={() => {launchImagePicker()}} title="Change" color="white"/>
                            </View>
                            <View style={styles.inactiveButton}>
                                <Button onPress={() => {setShowImg(false)}} title="Cancel" color="white"/>
                            </View>
                        </View>
                    </View>
                </Modal>
                :
                null
            }
        </View>

}


const styles = StyleSheet.create({

    headerView : {
      marginVertical : 4
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
  }
});

export default CasLeagueSearchVenuePromotionLeaguePlacePrize;
