import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Button } from 'react-native';
import UserNetworking from '../networking/userNetworking';
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const AdminScreen = props => {
    console.log('move user 1, user:');
    console.log(props.user);

    PushNotificationIOS.requestPermissions();

    PushNotificationIOS.addEventListener('register', function(token){
        console.log('You are registered and the device token is: ', token)
       });

    const moveUserNorth = () => {
        moveUser(props.user._id, props.user.location.coordinates[1]+.001, props.user.location.coordinates[0], 'NORTH');
    }
    const moveUserSouth = () => {
        moveUser(props.user._id, props.user.location.coordinates[1]-.001, props.user.location.coordinates[0], 'SOUTH');
    }
    const moveUserEast = () => {
        moveUser(props.user._id, props.user.location.coordinates[1], props.user.location.coordinates[0]+.001, 'EAST');
    }
    const moveUserWest = () => {
        moveUser(props.user._id, props.user.location.coordinates[1], props.user.location.coordinates[0]-.001, 'WEST');
    }

    const moveUser = (id, lat, long, direction) => {
        console.log('move user 1. lat, long:');
        console.log(lat);
        console.log(long);

        UserNetworking.updateUserLocation(id, lat, long, updatedUser => {
            console.log('UPDATED USER, sent '+direction+':');
            console.log(updatedUser);
        },
        err => {
            console.log(err);
        });

    }

    const testPushNotification = () => {
        PushNotificationIOS.presentLocalNotification({alertBody : 'TEST'});
    }

    return (
        <View style={{height: '100%', backgroundColor : 'white'}}>
            <Modal visible={true} transparent={false} animationType='fade'>
                <View style={{padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Button title="Move North" onPress={moveUserNorth}/>
                    <Button title="Move East" onPress={moveUserEast}/>
                    <Button title="Move South" onPress={moveUserSouth}/>
                    <Button title="Move West" onPress={moveUserWest}/>
                    <Button title="Notification" onPress={testPushNotification}/>
                    <Button title="Close" onPress={props.onClose}/>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    
});

export default AdminScreen;