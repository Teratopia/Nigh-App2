import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, TouchableOpacity, Image} from 'react-native';
import ModalHeader from '../components/ModalHeader';
import GChat from '../components/GiftedChat';
import Colors from '../constants/colors';   //
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

    const testNet = () => {
        //TestNetworking();
    }

    const closeModal = () => {
        props.setScreen(null);
    }
    const pressStatus = () => {
        props.setScreen('STATUS');
    }
    const pressProfile = () => {
        props.setScreen('PROFILE');
    }
    const pressSearch = () => {
        props.setScreen('SEARCH');
    }
    const pressChat = () => {
        props.setScreen('FRIENDS');
    }
    const pressAdmin = () => {
        props.setScreen('ADMIN');
    }

    return (
        <Modal visible={true} transparent={true}>
            <TouchableOpacity style={styles.modalView} onPress={closeModal}>
                <View style={styles.navView}>
                    <TouchableOpacity onPress={pressProfile} style={{height : 62, width : 62, marginTop : 18}}>
                        <Image style={{height : 62, width : 62, borderRadius : 31, borderColor: Colors.activeTeal, borderWidth : 2}}
                        source={profilePic}
                        />
                    </TouchableOpacity>
                    <View style={styles.buttonColumn}>
                    <View style={styles.buttonView}>
                            <Button title="PROFILE" onPress={pressProfile}/>
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="STATUS" onPress={pressStatus}/>
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="SEARCH" onPress={pressSearch}/>
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="FRIENDS" onPress={pressChat}/>
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="ABOUT" onPress={()=>{}}/>
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="ADMIN" onPress={pressAdmin}/>
                        </View>
                        <View style={{...styles.buttonView}}>
                            <Button title="SETTINGS" onPress={testNet}/>
                        </View>
                        <View style={{...styles.buttonView, borderBottomWidth : 0}}>
                            <Button title="LOG OUT" onPress={props.logOut}/>
                        </View>
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
        //height: '62%',
        //backgroundColor: 'blue',
        justifyContent: 'center',
        //alignItems: 'center'
    },
    navView : {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: '50%',
        width: '62%',
        borderWidth: 1,
        borderColor: Colors.inactiveGrey,
        borderTopRightRadius : 4,
        borderBottomRightRadius : 4,
        shadowColor : 'black',
        shadowOffset : {width : 10, height : 10},
        shadowRadius : 4,
        shadowOpacity : .5,
        paddingHorizontal : 20
    },
    buttonColumn : {
        flex : 3,
        alignItems: 'center',
        width : '100%',
        //backgroundColor : 'red'
    },
    topColumn : {
        flex : 1,
        alignItems: 'center',
        width : '100%',
        //backgroundColor : 'blue'
    },
    buttonView : {
        width : '100%',
        borderBottomWidth : 1,
        borderBottomColor : Colors.inactiveGrey,
    }
});

export default NavigationModal;