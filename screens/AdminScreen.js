import React from 'react';
import { View, Text, StyleSheet, Modal, Button } from 'react-native';
import UserNetworking from '../networking/userNetworking';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { showMessage } from "react-native-flash-message";

import moment from 'moment';

const AdminScreen = props => {
    console.log('move user 1, user:');
    console.log(props.user);
    

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
        console.log('before show message');
        showMessage({
            message: "Hello World",
  description: "This is our second message",
  type: "success",
        });
        console.log('after show message');

        const fireDate = moment()
        .add(5, 'seconds')
        .toDate()
        .toISOString();
        console.log('');
        console.log('');
        console.log('%%%%    fireDate = ', fireDate);
        console.log('');
        console.log('');
        PushNotificationIOS.scheduleLocalNotification({
            alertBody : 'test', 
            alertTitle : 'test', 
            fireDate : fireDate
        });
        

        //PushNotificationIOS.presentLocalNotification({alertBody : 'TEST'});
    }

    return (
        <View style={{height: '100%', backgroundColor : 'white'}}>
            <Modal visible={true} transparent={false} animationType='fade'>
                <View style={{padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Notification Token: {props.user.pnToken}</Text>
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