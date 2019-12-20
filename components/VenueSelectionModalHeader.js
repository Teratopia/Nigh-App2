import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Linking, Modal, TouchableOpacity, Image} from 'react-native';
import Colors from '../constants/colors';   //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import VenueSelectionModalFriendList from './VenueSelectionModalFriendList';
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import {encode as btoa} from 'base-64';     //

const VenueSelectionModalHeader = props => {

    const [priceHeader, setPriceHeader] = useState();
    const [priceAverage, setPriceAverage] = useState();
    const [checkedInUsers, setCheckedInUsers] = useState();
    const [friendsToShowAtThisVenue, setFriendsToShowAtThisVenue] = useState();
    const [googleInfo, setGoogleInfo] = useState();
    const [promotionImage, setPromotionImage] = useState();
    const [showPromotionModal, setShowPromotionModal] = useState();
    const [promotionImagesChecked, setPromotionImagesChecked] = useState();
    
    if(!priceAverage){
        console.log('4');
        var tables = props.venue.poolTables;
        var hourlyTot = 0;
        var perGameTot = 0;
        var hourlySum = 0;
        var perGameSum = 0;
        tables.forEach(table => {
            if(table.priceUnit === 'Per Game'){
                perGameSum += table.price;
                perGameTot += 1;
            } else {
                hourlySum += table.price;
                hourlyTot += 1;
            }
        });
        var hourlyAve = hourlySum/hourlyTot;
        var perGameAve = perGameSum/perGameTot;

        if(hourlyAve > 0){
            setPriceHeader('Avg. Price Per Hour');
            setPriceAverage('$'+hourlyAve.toFixed(2));
        } else {
            setPriceHeader('Avg. Price Per Game');
            setPriceAverage('$'+perGameAve.toFixed(2));
        }
    }

    if(!checkedInUsers){
        console.log('2');
        VenueNetworking.getPlayersCheckedIntoVenue(props.venue._id, null, users=> {
            console.log('VenueNetworking.getPlayersCheckedIntoVenue users = ', users);
            setCheckedInUsers(users);
            var friends = props.user.friendsIdList;
            var ftsatv = [];
            users.forEach(user => {
                friends.forEach(id => {
                    if(user._id === id){
                        user.statuses.forEach(status => {
                            if(status.activityName === 'BILLIARDS' && status.shareMyLocationWithFriends){
                                ftsatv.push(user);
                            }
                        })
                    }
                })
            })
            console.log('before set friend to show ftsatv = ', ftsatv);
            setFriendsToShowAtThisVenue(ftsatv);
        }, err => {
            console.log('VenueNetworking.getPlayersCheckedIntoVenue err = ', err);
        })
    }

    const initDirectionsLink = () => {
        const initDirectionsLinkData = {
            source: {
             latitude: props.recLoc.latitude,
             longitude: props.recLoc.longitude
           },
           destination: {
             latitude: props.venue.location.coordinates[1],
             longitude: props.venue.location.coordinates[0]
           },
           params: [
             {
               key: "travelmode",
               value: "driving"        // may be "walking", "bicycling" or "transit" as well
             },
             {
               key: "dir_action",
               value: "navigate"       // this instantly initializes navigation using the given travel mode
             }
           ],
           waypoints: []
         };
        console.log('getting directions, data = ', initDirectionsLinkData);
        getDirections(initDirectionsLinkData);
    }

    function openSite(url){
        let link = url || googleInfo.website;
        Linking.canOpenURL(link)
        .then((supported) => {
            if (!supported) {
                console.log("Can't handle url: " + link);
            } else {
                return Linking.openURL(link);
            }
        })
        .catch((err) => console.error('An error occurred', err));
    }

    const openWebsite = () => {
        if(!googleInfo){
            console.log('1');
            VenueNetworking.getVenueDetails(props.venue.googlePlaceId, details => {
                console.log('details = ', details);
                if(details.result && details.result.website){
                    var formattedWebsite = details.result.website.replace('http://', '').replace('https://', '');
                    formattedWebsite[formattedWebsite.length-1] === '/' ? 
                    formattedWebsite = formattedWebsite.substring(0, formattedWebsite.length -1)
                     : null;
                     details.result.formattedWebsite = formattedWebsite;
                }
                setGoogleInfo(details.result);
                openSite(details.result.website);
            });
        } else {
            openSite();
        }
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    if(!promotionImagesChecked && !promotionImage && props.venue.venuePromotions.length > 0){
        setPromotionImagesChecked(true);
        var now = new Date().getTime();
        var resPro = null;
        props.venue.venuePromotions.forEach(promotion => {
            if(promotion.isActive && new Date(promotion.fromDate).getTime() < now && new Date(promotion.toDate).getTime() > now){
                resPro = promotion;
            }
        });
        if(resPro){
            VenueNetworking.getVenuePromotionImage(
                resPro,
                res => {
                    console.log('getVenuePromotionImage callback 1');
                //console.log('getVenuePromotionImage res = ', res);
                if(res.image && res.image.source && res.image.source.data){
                    console.log('getVenuePromotionImage callback 2');
                    
                    setPromotionImage({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data)});
                    if(!props.checkInVenue && !props.noPromotionPopUp){
                        setShowPromotionModal(true);
                    }
                    
                }
            }, error => {
                console.log('error = ', error);
            });
        }
    }

    return <View style={styles.parentView}>
                <Text style={styles.properNameText}>
                    {props.venue.properName}
                </Text>
                <View style={styles.headersRow}>
                    <View style={styles.headerValueColumn}>
                        <Text style={styles.headerText}>
                            No. Tables
                        </Text>
                        <Text style={styles.valueText}>
                            {props.venue.poolTables.length}
                        </Text>
                    </View>
                    <View style={styles.headerValueColumn}>
                        <Text style={styles.headerText}>
                            {priceHeader}
                        </Text>
                        <Text style={styles.valueText}>
                            {priceAverage}
                        </Text>
                    </View>
                    
                    {
                        checkedInUsers && checkedInUsers.length > 0 ?
                        <View style={styles.headerValueColumn}>
                            <Text style={styles.headerText}>
                                Users Checked In
                            </Text>
                            <Text style={styles.valueText}>
                                {checkedInUsers.length}
                            </Text>
                        </View>
                        :
                        null
                    }
                </View>
                <View style={styles.headersRow}>
                    <TouchableOpacity onPress={() => {openWebsite()}} style={{...styles.inactiveButton, flex : 1}}>
                        <Text style={{fontSize : 16, padding : 4, color : 'white'}}>WEBSITE</Text>
                    </TouchableOpacity>
                        {
                            props.checkInVenue ? 
                                <TouchableOpacity onPress={props.checkInVenue} style={{...styles.activeButton, flex : 1}}>
                                    <Text style={{fontSize : 16, padding : 4, color : 'white'}}>CHECK IN</Text>
                                </TouchableOpacity>
                            :
                                <TouchableOpacity onPress={() => {initDirectionsLink()}} style={{...styles.inactiveButton, flex : 1}}>
                                    <Text style={{fontSize : 16, padding : 4, color : 'white'}}>DIRECTIONS</Text>
                                </TouchableOpacity>
                        }
                    {
                        promotionImage ?
                        <TouchableOpacity onPress={() => {setShowPromotionModal(true)}} style={{...styles.inactiveButton, flex : 1}}>
                            <Text style={{fontSize : 16, padding : 4, color : 'white'}}>PROMO</Text>
                        </TouchableOpacity>
                        :
                        null
                    }
                </View>
                {
                    /*
                    friendsToShowAtThisVenue && friendsToShowAtThisVenue.length > 0 ?
                        <View style={{marginTop : 8}}>
                            
                            <View style={{marginHorizontal : 12, borderWidth : 1, borderColor : Colors.inactiveGrey}}>
                                <VenueSelectionModalFriendList friendsToShowAtThisVenue={friendsToShowAtThisVenue}/>
                            </View>
                        </View>
                    :
                    null
                    */
                }
                {
                showPromotionModal && promotionImage ? 
                    <Modal animated="slide">
                        <TouchableOpacity 
                            onPress={() => {setShowPromotionModal(false)}}
                            style={{
                                flex : 1,
                                width : '100%',
                                alignItems : 'center',
                                justifyContent : 'center',
                                paddingVertical : getStatusBarHeight(),
                                backgroundColor : 'black'
                            }}
                            activeOpacity={1}
                            >
                            <Image source={promotionImage} 
                            style={{
                                flex : 1,
                                width : '100%',
                                alignItems : 'center',
                                justifyContent : 'center'
                            }}
                            />
                        </TouchableOpacity>
                    </Modal> : 
                    null
                }
            </View>   
}


const styles = StyleSheet.create({
    parentView : {
        //flex : 1,
        justifyContent : 'center',
        borderBottomColor : Colors.inactiveGrey,
        borderBottomWidth : 1,
        marginHorizontal : 8,
        paddingBottom : 12,
        //backgroundColor : 'yellow',
        width : '100%'
    },
    properNameText : {
        fontWeight : '800',
        fontSize : 28,
        textAlign : 'center',
        marginVertical : 8
    },
    headersRow : {
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        paddingHorizontal : 12
    },
    headerText : {
        fontSize : 10,
        textAlign : 'center',
        marginVertical : 4
    },
    valueText : {
        fontWeight : '700',
        fontSize : 16,
        textAlign : 'center',
        marginVertical : 4
    },
    headerValueColumn : {
        flex : 1
    },
    subHeader : {
        fontWeight : '600',
        fontSize : 22,
        textAlign : 'center',
        marginBottom : 4
    },
    activeButton : {
        //width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        marginVertical : 4,
        marginHorizontal : 12
    },
    inactiveButton : {
        //width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        marginVertical : 4,
        marginHorizontal : 4
    },
    friendListView : {
        maxHeight : 42
    }
});

export default VenueSelectionModalHeader;