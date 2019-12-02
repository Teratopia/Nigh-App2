import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal} from 'react-native';
import Colors from '../constants/colors';   //

const CasLeagueVenueUserInitSetupMapMarkerModal = props => {

    const [imageSource, setImageSource] = useState(null);

    console.log('CasLeagueVenueUserInitSetupMapMarkerModal init');

    let addLineOne, addLineTwo, addLineThree;
    if(props.googlePlace.formatted_address){
        var address = props.googlePlace.formatted_address.split(',');
        address[0] ? addLineOne = address[0] : null;
        address[1] && address[2] ? addLineTwo = address[1].trim()+','+address[2] : null;
        address[3] ? addLineThree = address[3].trim() : null;
    }

    return (

        <Modal visible={true} transparent={true}>
            <View style={styles.shadowBox}>
                <View style={styles.modalView}>

                        <View style={styles.addressTextView}>
                            <Text style={{...styles.addressText, fontSize : 22, fontWeight : '700'}}>{props.googlePlace.name}</Text>
                        </View>
                        <View style={styles.addressTextView}>
                            <Text style={styles.addressText}>{addLineOne}</Text>
                        </View>
                        <View style={{...styles.addressTextView, marginVertical : 0}}>
                            <Text style={styles.addressText}>{addLineTwo}</Text>
                        </View>
                        <View style={styles.addressTextView}>
                            <Text style={styles.addressText}>{addLineThree}</Text>
                        </View>
                        <View style={{marginTop : 8, minWidth : 200, justifyContent : 'center', alignItems : 'center'}}>
                            <View style={styles.activeButton}>
                                <Button title="CONFIRM" onPress={props.confirmVenue} color="white"/>
                            </View>
                            <View style={styles.inactiveButton}>
                                <Button title="CLOSE" onPress={() => {props.setSelectedGooglePlace(null)}} color="white"/>
                            </View>
                        </View>

                </View>

            </View>
        </Modal>

        
    );
}

const styles = StyleSheet.create({
    modalView: {
        alignItems: 'center',
        justifyContent : 'center',
        //width:'62%', 
        //maxHeight:'62%',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.activeTeal
    },
    shadowBox : {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        width : '100%',
        height : '100%',
        alignItems : 'center',
        justifyContent : 'center'
    },
    addressTextView : {
        marginVertical : 4
    },
    addressText : {
        color : Colors.quasiBlack,
        fontSize : 16,
        fontWeight : '500'
    },
    activeButton : {
        width : '100%', 
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        marginVertical : 4,
        minWidth : 200, 
    },
    inactiveButton : {
        width : '100%', 
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        marginVertical : 4,
        minWidth : 200, 
    }
    
    
});

export default CasLeagueVenueUserInitSetupMapMarkerModal;