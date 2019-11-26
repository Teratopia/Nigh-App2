import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, Image, ImageBackground, ScrollView} from 'react-native';
import Colors from '../constants/colors';

const WarningMessageModal = props => {

    return (

        <Modal visible={true} transparent={true}>
            <View style={styles.shadowBox}>
                <View style={styles.modalView}>
                    {
                        props.title ? 
                        <View style={{justifyContent : 'center', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : Colors.inactiveGrey}}>
                                <View style={styles.addressTextView}>
                                    <Text style={{...styles.addressText, fontSize : 22, fontWeight : '700', color : Colors.quasiBlack}}>{props.title}</Text>
                                </View>
                        </View>
                        :
                        null
                    }
                        
                    {
                        props.description ? 
                        <View style={{justifyContent : 'center', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : Colors.inactiveGrey}}>
                                <View style={styles.addressTextView}>
                                    <Text style={{...styles.addressText, fontSize : 14, color : Colors.inactiveGrey}}>{props.description}</Text>
                                </View>
                        </View>
                        :
                        null
                    }
                        
                    <View style={{marginTop : 8, minWidth : 200, justifyContent : 'center', alignItems : 'center'}}>
                        <View style={styles.inactiveButton}>
                            <Button title="CLOSE" onPress={() => {props.onClose(null)}} color="white"/>
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
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dangerRed,
        margin : 16
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
        marginVertical : 4,
        textAlign : 'center',

    },
    addressText : {
        fontWeight : '500', 
        fontSize : 12, 
        color : Colors.inactiveGrey,
        textAlign : 'center',
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

export default WarningMessageModal;