import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';   //
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import VenueNetworking from '../networking/venueNetworking';    //
import CasLeagueSearchVenueSelectedVenueModal from '../components/CasLeagueSearchVenueSelectedVenueModal';  //
import Geolocation from '@react-native-community/geolocation';  //
import Colors from '../constants/colors';
import VenueSelectionModal from '../components/VenueSelectionModal';

const geolib = require('geolib');

const CasLeagueSearchScreen = props => {

  const [recLoc, setRecLoc] = useState(false);
  const [locNow, setLocNow] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [viewSearchBar , setViewSearchBar] = useState(null);

  if(!recLoc){
    Geolocation.getCurrentPosition(position => {
        setRecLoc({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        });
        setLocNow({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        });
        VenueNetworking.queryVenues(position.coords.latitude, position.coords.longitude, 1000, res => {
            console.log('venues = ', res);
            setVenues(res.venues);
        }, err => {
            console.log('err ', err);
        });
    }, err => {
        console.log(err);
    });
  }

    const onRegionChangeComplete = region => {
        setLocNow(region);
        var meters = geolib.getDistance(
            {latitude : region.latitude, longitude : region.longitude},
            {latitude : recLoc.latitude, longitude : recLoc.longitude});
        if(meters > recLoc.latitudeDelta*40000){
            setRecLoc(region);
            //console.log('onRegionChangeComplete region = ', region);
            //console.log('onRegionChangeComplete region lat delta m = ' + region.latitudeDelta*40000);
            VenueNetworking.queryVenues(region.latitude, region.longitude, region.latitudeDelta*40000, res => {
                //console.log('venues = ', res);
                setVenues(res.venues);
            }, err => {
                console.log('err ', err);
            });
        }
    }

    const handleSearchBarQuery = e => {
        console.log('handleSearchBarQuery e.nativeEvent.text = ', e.nativeEvent.text);
        VenueNetworking.googlePlacesVenueSearch(e.nativeEvent.text, res => {
            console.log('handleSearchBarQuery res = ', res);
            if(res.candidates && res.candidates.length > 0){
                var lat = res.candidates[0].geometry.location.lat;
                var long = res.candidates[0].geometry.location.lng;
                setRecLoc({
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421
                });
                setLocNow({
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421
                });
                VenueNetworking.queryVenues(lat, long, 400, res => {
                    console.log('venues = ', res);
                    setVenues(res.venues);
                    let venHit = null;
                    res.venues.forEach(ven => {
                        if(ven.location.coordinates[0] === long && ven.location.coordinates[1] === lat){
                            venHit = ven;
                        }
                    })
                    if(venHit){
                        setSelectedVenue(venHit);
                    }
                }, err => {
                    console.log('err ', err);
                });
            }
        })
    }

  return (
      
            <View style={styles.screen}>
                <ModalHeader 
                title="SEARCH"
                leftIcon="menu" 
                leftIconFunction={props.leftIconFunction}
                rightIcon="magnifying-glass"
                rightIconFunction={() => {setViewSearchBar(!viewSearchBar)}}
                style={{marginBottom : 0}}
                />
                {
                    viewSearchBar ?
                    <View style={styles.searchBarContainer}>
                        <TextInput 
                            style={styles.searchTextInput}
                            onSubmitEditing={e => {handleSearchBarQuery(e)}}
                            placeholder="Search"
                        />
                    </View>
                    : null
                }
                <View style={styles.mapView}>
                {
          locNow ? 
                    <MapView provider={PROVIDER_GOOGLE} 
                    style={styles.mapContainer}
                    initialRegion={locNow}
                    region={locNow}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={onRegionChangeComplete}
                    //onUserLocationChange={onUserLocationChange}
                    minZoomLevel={7}
                    >
                    {
                        venues && venues.length > 0 ?
                            venues.map(ven => (
                                <MapView.Marker
                                key={ven._id}
                                identifier={ven._id}
                                coordinate={{
                                    latitude : ven.location.coordinates[1], 
                                    longitude : ven.location.coordinates[0], 
                                    latitudeDelta: 0.00922,
                                    longitudeDelta: 0.00421}}
                                onPress={() => {setSelectedVenue(ven)}}
                                />
                            ))
                        :
                        null
                    }
                    </MapView>
                    : null
                }
                </View>
                {
                selectedVenue ? 
                /*
                    <CasLeagueSearchVenueSelectedVenueModal 
                        venue={selectedVenue} 
                        setSelectedVenue={setSelectedVenue}
                        recLoc={recLoc}
                        user={props.user}
                    />
                    */
                    <VenueSelectionModal
                        venue={selectedVenue} 
                        setSelectedVenue={setSelectedVenue}
                        recLoc={recLoc}
                        user={props.user}
                    />
                :
                null
                }
            </View>
        );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
  },
  mapView : {
    width : '100%',
    //height : '100%',
    flex : 19,
    //paddingBottom : 56
  },
  mapContainer : {
    width: '100%',
    height: '100%',
    paddingBottom : 40
  },
  searchBarContainer : {
      flex : 1,
      padding : 8,
      width : '100%',
      //backgroundColor : Colors.quasiBlack
      borderBottomWidth : 1,
      borderBottomColor : Colors.inactiveGrey
  },
  searchTextInput : {
      padding : 8,
      textAlign : 'center',
      width : '100%',
      borderWidth : 1,
      borderColor : Colors.activeTeal,
      borderRadius : 8,
      backgroundColor : 'white'
  }

});

export default CasLeagueSearchScreen;