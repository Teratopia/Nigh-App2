import VenueNetworking from '../networking/venueNetworking';
import React, {useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
const geolib = require('geolib');

const LocationTracker = props => {
    console.log('Location Tracker init');
    const [isInit, setIsInit] = useState(false);
    const [userBilliardsSettings, setUserBilliardsSettings] = useState();
    const [venuesWithinOneMile, setVenuesWithinOneMile] = useState();

    /* depricated
    if(props.user && props.user._id){
        LocationHelper.trackLocation(props.user, props.onStatusUpdate);

    }
    return null;
    */
   const updateUser = () => {
            props.user.statuses.forEach(status => {
                if(status.activityName === 'BILLIARDS'){
                    console.log('status === BILLIARDS status = ', status);
                    if( status.friendsAreNear ||
                        status.aPoolTableIsNear ||
                        status.anActiveUserIsNear){
                            setUserBilliardsSettings(status);
                            pullVenues(null, status);
                    }
                }
            });
            setIsInit(true);
    }

    const pullVenues = (watchId, status) => {
        watchId ? Geolocation.clearWatch(watchId) : null;
        Geolocation.getCurrentPosition(position => {
            console.log('pull venues set mile search center position = ', position);
            VenueNetworking.queryVenues(position.coords.latitude, position.coords.longitude, 5280, res => {
                watchForChange(position.coords, res.venues, status);
            }, err => {
                console.log('queryVenues err = ', err);
            })
        }, err => {
            console.log('pull venues error = ', err);
        })
    }

    const formatNotificationDetails = (statusSettings, res) => {
        var tableChunk = res.venue.poolTables.length === 1 ? '1 table!' : '' + res.venue.poolTables.length + ' tables!';
        var body = '' + res.venue.properName+' nearby has '+tableChunk+' ';

        if(statusSettings.friendsAreNear && res.friendsAtVenue.length > 0){
            body += '\n';
            if(res.friendsAtVenue.length === 1){
                body += '' + res.friendsAtVenue[0].username + ' is checked in! '
            } else {
                body += '' + res.friendsAtVenue.length + ' friends are checked in! '
            }
        } 
        if(statusSettings.anActiveUserIsNear){
            body += '\n';
            if(res.nonFriendsAtVenue.length > 0){
                body += '' + res.nonFriendsAtVenue.length + ' total active users.';
            }
        } 

        console.log('body = ', body);
        
        PushNotificationIOS.presentLocalNotification({alertBody : body});
    }

    const watchForChange = (searchCenter, venues, status) => {
        let venueList;
        let statusSettings;
        console.log('venuesWithinOneMile = ', venuesWithinOneMile);
        console.log('venues = ', venues);
        userBilliardsSettings ? statusSettings = userBilliardsSettings : statusSettings = status;
        console.log('statusSettings = ', statusSettings);
        venuesWithinOneMile ? venueList = venuesWithinOneMile : venueList = venues;
        Geolocation.watchPosition(watchId => {
            //TODO: UPDATE STATUSES TO PASSIVE IF ACTIVE AND LEAVING VENUE
            console.log('watchForChange watchId = ', watchId);
            console.log('watchForChange searchCenter = ', searchCenter);
            var meters = geolib.getDistance(
                {latitude : searchCenter.latitude, longitude : searchCenter.longitude},
                {latitude : watchId.coords.latitude, longitude : watchId.coords.longitude});
            if(meters > 1200){
                pullVenues(watchId);
            } else {
                //check venues within one mile for within 50 feet that have not already been notified
                var venueHits = [];
                console.log('venueList = ', venueList);
                venueList.forEach(venue => {
                    console.log('venue.notified = ', venue.notified);
                    console.log('geolib get dist = ', geolib.getDistance(
                        {latitude : venue.location.coordinates[1], longitude : venue.location.coordinates[0]},
                        {latitude : watchId.coords.latitude, longitude : watchId.coords.longitude}));
                    if(!venue.notified &&
                        geolib.getDistance(
                            {latitude : venue.location.coordinates[1], longitude : venue.location.coordinates[0]},
                            {latitude : watchId.coords.latitude, longitude : watchId.coords.longitude}) < 30){
                        venueHits.push(venue._id);
                        //get venueDetails based on user settings,
                        VenueNetworking.getVenueNotificationInfoById(venue._id, statusSettings, props.user.friendsIdList, res => {
                            //push notification to user, 
                            console.log('getVenueNotificationInfoById success res = ', res);
                            formatNotificationDetails(statusSettings, res);
                        }, err => {
                            console.log('getVenueNotificaitonInfoById error = ', err);
                        });
                    }
                });
                //set notified venues to true
                var venueListClone = [...venueList];
                venueListClone.forEach(venClone => {
                    venueHits.includes(venClone._id) ? venClone.notified = true : null;
                });
                setVenuesWithinOneMile(venueListClone);
            }
                        
        }, err => {
            console.log('Geolocation.watchPosition error = ', err);
        },
            {distanceFilter : 15}
        );
    }
    if(!isInit && props.user){  
        updateUser();
    }

    return null;
}

export default LocationTracker;