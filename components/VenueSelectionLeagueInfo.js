import React, {useState} from 'react';
import {View, StyleSheet, Text, Modal, TouchableOpacity, Image} from 'react-native';
import Colors from '../constants/colors';   //
import {encode as btoa} from 'base-64';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import ImageNetworking from '../networking/imageNetworking';
import moment from 'moment';

const VenueSelectionLeagueInfo = props => {

    const [firstPlaceImage, setFirstPlaceImage] = useState();
    const [secondPlaceImage, setSecondPlaceImage] = useState();
    const [thirdPlaceImage, setThirdPlaceImage] = useState();
    const [activePlaceImage, setActivePlaceImage] = useState();

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    const setAndShowPrizeImage = (place, id) => {
        console.log('6');
        console.log('setAndShowPrizeImage id = ', id);
        if(!id){
            return;
        }
        
        if(place === 'first' && firstPlaceImage){
            setActivePlaceImage(firstPlaceImage);
        } else if(place === 'second' && secondPlaceImage){
            setActivePlaceImage(secondPlaceImage);
        } else if(place === 'third' && thirdPlaceImage){
            setActivePlaceImage(thirdPlaceImage);
        } else {
            console.log('before get image by id');
            ImageNetworking.getImageById(
                id,
                res => {
                console.log('getImageById res = ', res);
                var imgSrc = {uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data)};
                switch (place) {
                    case 'first' : 
                        setFirstPlaceImage(imgSrc);
                    break;
                    case 'second' : 
                        setSecondPlaceImage(imgSrc)
                    break;
                    case 'third' : 
                        setThirdPlaceImage(imgSrc);
                    break;
                }
                setActivePlaceImage(imgSrc);
            }, error => {
                console.log('error = ', error);
            });
        }
    }


    return <View style={{margin : 12}}>

                <Text style={styles.subHeader}>
                    League
                </Text>
                <Text style={styles.prizeHeader}>
                    End Date
                </Text>
                <Text style={{...styles.prizeTitle, color : Colors.quasiBlack}}>
                    {moment(props.venue.activeLeague.endDate).format("MMM Do YYYY")}
                </Text>

            <TouchableOpacity 
                onPress={() => {setAndShowPrizeImage('first', props.venue.activeLeague.firstPlacePrizeImageId)}} 
                style={{...styles.prizeTouchContainer}}
                disabled={!props.venue.activeLeague.firstPlacePrizeImageId}
            >
            <Text style={{...styles.prizeHeader, color : Colors.gold}}>
                        First Place Prize
                </Text>
                <Text style={styles.prizeTitle}>
                        {props.venue.activeLeague.firstPlacePrizeTitle}
                </Text>
                {
                    props.venue.activeLeague.firstPlacePrizeDescription ?
                    <Text style={styles.prizeDescription}>
                        {props.venue.activeLeague.firstPlacePrizeDescription}
                    </Text>
                    :
                    null
                } 
            </TouchableOpacity>
            {
                props.venue.activeLeague.secondPlacePrizeTitle ? 
                <TouchableOpacity 
                    onPress={() => {setAndShowPrizeImage('second', props.venue.activeLeague.secondPlacePrizeImageId)}} 
                    style={{...styles.prizeTouchContainer, borderColor : Colors.silver}}
                    disabled={!props.venue.activeLeague.secondPlacePrizeImageId}
                >
                    <Text style={{...styles.prizeHeader, color : Colors.silver}}>
                            Second Place Prize
                    </Text>
                    <Text style={styles.prizeTitle}>
                            {props.venue.activeLeague.secondPlacePrizeTitle}
                    </Text>
                    {
                        props.venue.activeLeague.secondPlacePrizeDescription ? 
                        <Text style={styles.prizeDescription}>
                            {props.venue.activeLeague.secondPlacePrizeDescription}
                        </Text>
                        :
                        null
                    }
                </TouchableOpacity>
            :
            null
            }

            {
                props.venue.activeLeague.thirdPlacePrizeTitle ? 

                <TouchableOpacity 
                    onPress={() => {setAndShowPrizeImage('third', props.venue.activeLeague.thirdPlacePrizeImageId)}} 
                    style={{...styles.prizeTouchContainer, borderColor : Colors.bronze}}
                    disabled={!props.venue.activeLeague.thirdPlacePrizeImageId}
                >
                    <Text style={{...styles.prizeHeader, color : Colors.bronze}}>
                            Third Place Prize
                    </Text>
                    <Text style={styles.prizeTitle}>
                            {props.venue.activeLeague.thirdPlacePrizeTitle}
                    </Text>
                    {
                        props.venue.activeLeague.thirdPlacePrizeDescription ? 
                        <Text style={styles.prizeDescription}>
                            {props.venue.activeLeague.thirdPlacePrizeDescription}
                        </Text>
                        :
                        null
                    }
                </TouchableOpacity>
            :
            null
            }
            {
                
                activePlaceImage ? 
                <Modal animationType='slide'>
                    <TouchableOpacity 
                        onPress={() => {setActivePlaceImage(null)}}
                        style={{
                            flex : 1,
                            width : '100%',
                            alignItems : 'center',
                            justifyContent : 'center',
                            paddingVertical : getStatusBarHeight(),
                            backgroundColor : 'black',
                        }}
                        activeOpacity={1}
                        >
                        <Image source={activePlaceImage} 
                        style={{
                            flex : 5,
                            width : '100%',
                            //alignItems : 'center',
                            //justifyContent : 'center'
                        }}
                        />
                    </TouchableOpacity>
                </Modal>
                :
                null
                
            }
            </View>

}

const styles = StyleSheet.create({
    parentView : {
        flex : 1,
        justifyContent : 'center',
        marginVertical : getStatusBarHeight(),
        //marginVertical : 100
    },
    subHeader : {
        fontWeight : '600',
        fontSize : 22,
        textAlign : 'center',
        marginBottom : 4
    },
    prizeTouchContainer : {
        justifyContent : 'center', 
        alignItems : 'center', 
        marginVertical : 4,
        //marginHorizontal : 8,
        padding : 4,
        borderColor : Colors.gold,
        borderWidth : 1,
        borderRadius : 8,
        backgroundColor : Colors.quasiBlack
    },
    prizeHeader : {
        fontSize : 12,
        color : Colors.inactiveGrey,
        marginTop : 2,
        textAlign : 'center'
    },
    prizeTitle : {
        fontSize : 16,
        //color : Colors.quasiBlack,
        color : 'white',
        fontWeight : '600',
        marginVertical : 2,
        textAlign : 'center'

    },
    prizeDescription : {
        fontSize : 14,
        //color : Colors.quasiBlack,
        color : 'white',
        fontWeight : '500',
        marginBottom : 2,
        textAlign : 'center'
    }
});

export default VenueSelectionLeagueInfo;