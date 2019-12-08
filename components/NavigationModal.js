import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, TouchableOpacity, Image} from 'react-native';
import Colors from '../constants/colors';   //
import AsyncStorage from '@react-native-community/async-storage';
//import TestNetworking from '../networking/testNetworking';
const fs = require('react-native-fs');


const NavigationModal = props => {

    const [profilePic, setProfilePic] = useState(null);

    //import GuessGameHeader from './components/GuessGameHeader';
    const resetProfilePic = () => {
        var path = fs.CachesDirectoryPath+'/'+props.user._id+'profilePicture.jpeg';
        fs.exists(path).then( exists => {
            if(exists){
                setProfilePic({uri : path});
            } else {
                setProfilePic(require('../images/defaultProfilePic1.jpeg'));
            }
          });
    }

    if(!profilePic){
        resetProfilePic();
    }

    logOut = async () => {
        props.logOut();
    }

    return (
        <Modal visible={true} transparent={true}>
            <TouchableOpacity style={styles.modalView} onPress={() => {props.setScreen(null)}}>
                <View style={styles.navView}>
                            <TouchableOpacity onPress={() => {props.setScreen('PROFILE')}} style={styles.profileHeader}>
                                <Image style={{height : 62, width : 62, borderRadius : 31, borderColor: Colors.activeTeal, borderWidth : 2}}
                                source={profilePic}
                                />
                            </TouchableOpacity>
                            <View style={styles.buttonView}>
                                <Button title="PROFILE" onPress={() => {props.setScreen('PROFILE')}}/>
                            </View>
                            <View style={styles.buttonView}>
                                <Button title="STATUS" onPress={() => {props.setScreen('STATUS')}}/>
                            </View>
                            <View style={styles.buttonView}>
                                <Button title="SEARCH" onPress={() => {props.setScreen('SEARCH')}}/>
                            </View>
                            <View style={styles.buttonView}>
                                <Button title="FRIENDS" onPress={() => {props.setScreen('FRIENDS')}}/>
                            </View>
                            <View style={styles.buttonView}>
                                <Button title="ABOUT" onPress={() => {props.setScreen('ABOUT')}}/>
                            </View>
                            <View style={styles.buttonView}>
                                <Button title="ADMIN" onPress={() => {props.setScreen('ADMIN')}}/>
                            </View>
                            <View style={{...styles.buttonView}}>
                                <Button title="SETTINGS" onPress={() => {props.setScreen('SETTINGS')}}/>
                            </View>
                            <View style={{...styles.buttonView, borderBottomWidth : 0}}>
                                <Button title="LOG OUT" onPress={logOut}/>
                            </View>
                    </View>
                
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        width: '100%',
        height : '100%',
        justifyContent: 'center',
    },
    navView : {
        height : '62%',
        width : '50%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', 
        borderWidth: 1,
        borderColor: Colors.inactiveGrey,
        borderTopRightRadius : 4,
        borderBottomRightRadius : 4,
        shadowColor : 'black',
        shadowOffset : {width : -10, height : 10},
        shadowRadius : 4,
        shadowOpacity : .5,
        paddingHorizontal : 20
    },
    profileHeader : {
        flex : 2,
        justifyContent : 'center',
        alignItems : 'center',
        borderBottomWidth : 1,
        borderBottomColor : Colors.inactiveGrey,
    },
    buttonView : {
        flex : 1,
        width : '100%',
        borderBottomWidth : 1,
        borderBottomColor : Colors.inactiveGrey,
        justifyContent : 'center',
        alignItems : 'center',
    }
});

export default NavigationModal;