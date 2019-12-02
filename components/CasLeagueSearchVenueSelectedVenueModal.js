import React, {useState} from 'react';
import {View, StyleSheet, Text, Button, Modal, TouchableOpacity, FlatList, Linking, Image} from 'react-native';
import Colors from '../constants/colors';   //
import VenueNetworking from '../networking/venueNetworking';    //
import getDirections from 'react-native-google-maps-directions';    //
import {encode as btoa} from 'base-64';     //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import VenueLeaderboardTable from './VenueLeaderboardTable';

const CasLeagueSearchVenueSelectedVenueModal = props => {

    const [googleInfo, setGoogleInfo] = useState(null);
    const [promotionImage, setPromotionImage] = useState(null);
    const [showPromotionModal, setShowPromotionModal] = useState(null);
    const [checkInUsers, setCheckInUsers] = useState(null);
    const [friendsToShowAtThisVenue, setFriendsToShowAtThisVenue] = useState([]);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    
    const averages = determinePriceAve(props.venue.poolTables);

    console.log('CasLeagueSearchVenueSelectedVenueModal init venue = ', props.venue);
    if(!googleInfo){
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
        });
    }

    if(!checkInUsers){
        VenueNetworking.getPlayersCheckedIntoVenue(props.venue._id, null, users=> {
            console.log('VenueNetworking.getPlayersCheckedIntoVenue users = ', users);
            setCheckInUsers(users);
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

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
    };

    if(!promotionImage && props.venue.venuePromotions.length > 0){
        console.log('props.venue = ', props.venue);
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
                console.log('getVenuePromotionImage res = ', res);
                if(res.image && res.image.source && res.image.source.data){
                    setPromotionImage({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data)});
                    if(!props.checkInVenue){
                        setShowPromotionModal(true);
                    }
                }
            }, error => {
                console.log('error = ', error);
            });
        }
        setPromotionImage({});
    }

    function determinePriceAve(tables){
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
        return {
            hourlyAve : hourlyAve,
            perGameAve : perGameAve,
            hourlyTot : hourlyTot,
            perGameTot :perGameTot,
        }
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

    openWebsite = () => {
        Linking.canOpenURL(googleInfo.website)
        .then((supported) => {
            if (!supported) {
            console.log("Can't handle url: " + googleInfo.website);
            } else {
            return Linking.openURL(googleInfo.website);
            }
        })
        .catch((err) => console.error('An error occurred', err));
    }

    return (

        <Modal visible={true} transparent={true}>
            <View style={styles.shadowBox}>
                <View style={styles.modalView}>
                        {
                            googleInfo ? 
                            <View style={{justifyContent : 'center', alignItems : 'center', borderBottomWidth : 1, borderBottomColor : Colors.inactiveGrey}}>
                                
                                <View style={styles.addressTextView}>
                                    <Text style={{...styles.addressText, fontSize : 22, fontWeight : '700', color : Colors.quasiBlack}}>{googleInfo.name}</Text>
                                </View>
                                
                                
                                <View style={{...styles.addressTextView, marginBottom : 0}}>
                                    <Text style={styles.addressText}>{googleInfo.address_components[0].long_name} {googleInfo.address_components[1].long_name}</Text>
                                </View>
                                {
                                    googleInfo.website ? 
                                    <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                        <View style={{...styles.addressTextView, marginBottom : 0}}>
                                            <Text style={styles.addressText}>{googleInfo.address_components[3].long_name}, {googleInfo.address_components[5].long_name}</Text>
                                        </View>
                                        <View style={{...styles.addressTextView}}>
                                            <TouchableOpacity onPress={openWebsite}>
                                                <Text style={{...styles.addressText, color : 'blue'}}>
                                                    {googleInfo.formattedWebsite}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    <View style={{...styles.addressTextView}}>
                                        <Text style={styles.addressText}>{googleInfo.address_components[3].long_name}, {googleInfo.address_components[5].long_name}</Text>
                                    </View>
                                }
                                
                                
                            </View>
                            : null
                        }
                        {
                            !averages ?
                            null : 
                            averages.perGameTot > 0 ? 
                            <View style={{justifyContent : 'center', alignItems : 'center', marginTop : 8, minWidth : 200}}>
                                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={styles.addressText}>Number of Tables</Text>
                                <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{averages.perGameTot}</Text>
                                </View>
                                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={styles.addressText}>Average Price Per Game</Text>
                                    <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{'$'+averages.perGameAve.toFixed(2)}</Text>
                                </View>
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center', marginTop : 8, minWidth : 200}}>
                                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={styles.addressText}>Number of Tables</Text>
                                    <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{averages.hourlyTot}</Text>
                                </View>
                                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={styles.addressText}>Average Price Per Hour</Text>
                                    <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{'$'+averages.hourlyAve.toFixed(2)}</Text>
                                </View>
                                <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                    <Text style={styles.addressText}>Users Checked In</Text>
                                    <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{checkInUsers.length}</Text>
                                </View>
                            </View>

                        }
                                {
                                    checkInUsers && checkInUsers.length ? 
                                    <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                        <Text style={styles.addressText}>Users Checked In</Text>
                                        <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>{checkInUsers.length}</Text>
                                        
                                    </View>
                                    :
                                    null
                                }
                                {
                                            friendsToShowAtThisVenue && friendsToShowAtThisVenue.length > 0 ? 
                                            <View style={{justifyContent : 'center', alignItems : 'center', maxHeight : 76}}>
                                                <Text style={styles.addressText}>Including</Text>
                                                <FlatList 
                                                data={friendsToShowAtThisVenue} 
                                                keyExtractor={(item, index) => 'key'+index}
                                                renderItem={itemData => (
                                                    <TouchableOpacity onPress={() => {}}>
                                                        <Text style={{...styles.addressText, fontSize : 16, fontWeight : '700', color : Colors.quasiBlack}}>
                                                            {itemData.item.username}
                                                        </Text>
                                                    </TouchableOpacity>
                                                )}>
                                                </FlatList>
                                            </View>
                                            :
                                            null
                                }

                        <View style={{marginTop : 8, minWidth : 200, justifyContent : 'center', alignItems : 'center'}}>
                            <View style={styles.activeButton}>
                                {
                                    props.checkInVenue ? 
                                        <Button title="CHECK IN" onPress={props.checkInVenue} color="white"/>
                                    :
                                        <Button title="DIRECTIONS" onPress={initDirectionsLink} color="white"/>
                                }
                                
                            </View>
                            <View style={styles.inactiveButton}>
                                <Button title="LEADERBOARD" onPress={() => {setShowLeaderboardModal(true)}} color="white"/>
                            </View>
                            {
                                promotionImage && promotionImage.uri ? 
                                <View style={styles.inactiveButton}>
                                    <Button title="PROMOTION" onPress={() => {setShowPromotionModal(true)}} color="white"/>
                                </View>
                                :
                                null
                            }
                            <View style={styles.inactiveButton}>
                                <Button title="CLOSE" onPress={() => {props.setSelectedVenue(null)}} color="white"/>
                            </View>
                        </View>

                </View>

            </View>
            {
                showPromotionModal && promotionImage && promotionImage.uri ? 
                <Modal>
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
            {
                showLeaderboardModal ? 
                <Modal transparent={true}>
                    <View style={{flex : 1}}/>
                    <View style={{
                        margin : 40,
                        borderColor : Colors.activeTeal,
                        borderWidth : 1,
                        flex : 4,
                        backgroundColor : 'white',
                        borderRadius : 8,
                        justifyContent : 'center'
                    }}>
                        <View style={{
                            width : '100%',
                            marginTop : 12
                        }}>
                            <Text style={{
                                fontWeight : '700',
                                fontSize : 22,
                                textAlign : 'center'
                            }}>
                                Leaderboard
                            </Text>
                        </View>
                        
                        <VenueLeaderboardTable venueUser={props.venue}/>
                        <View style={{
                            margin : 12,
                            borderWidth : 1,
                            borderColor : Colors.activeTeal,
                            backgroundColor : Colors.inactiveGrey,
                            borderRadius : 8
                        }}>
                            <Button title="CLOSE" onPress={() => {setShowLeaderboardModal(false)}} color="white"/>
                        </View>
                    
                    </View>
                    <View style={{flex : 1}}/>
                </Modal>
                : null
            }
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
        fontWeight : '500', 
        fontSize : 12, 
        color : Colors.inactiveGrey
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

export default CasLeagueSearchVenueSelectedVenueModal;