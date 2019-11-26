import React, {useState} from 'react';
import {View} from 'react-native';
import UserNetworking from '../networking/userNetworking';

function trackLocation(user, onStatusUpdate) {
    console.log('& trackLocation 1 user = ', user);
    var dist = 50;
    var then = new Date().getTime();
    navigator.geolocation.watchPosition(watchId => {
        var now = new Date().getTime();
        if(user && now - then > 3728){
            UserNetworking.updateUserLocation(user._id, watchId.coords.latitude, watchId.coords.longitude, res => {
                console.log('userLocationUpdated res = ', res);
                UserNetworking.setAllUserStatusesToPassive(user._id, res => {
                console.log('& updateUserStatuses res = ', res);
                onStatusUpdate(res);
                });
            }, err => {
                console.log('userLocationUpdated err = ');
                console.log(err);
            });
        } else {
            console.log('LocationTracker else');
        }  
        then = now;
    }, error => {
        console.log('error watching location');
        console.log(error);
    }, {
        distanceFilter : dist
    });
}

function setAllStatusesToPassive(statuses){
    console.log('& setAllStatusesToPassive 1 statuses = ', statuses);
    console.log(statuses);
    var noChangeToStatuses = true;
    statuses.forEach(function(status){
        
        if(status.active){
            status.active = false;
            noChangeToStatuses = false;
        }
    });
    if(noChangeToStatuses){
        return null;
    } else {
        return statuses;
    }
    
}

export default {trackLocation};