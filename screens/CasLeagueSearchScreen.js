import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';   //
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import VenueNetworking from '../networking/venueNetworking';    //
import CasLeagueSearchVenueSelectedVenueModal from '../components/CasLeagueSearchVenueSelectedVenueModal';  //
import Geolocation from '@react-native-community/geolocation';  //

const CasLeagueSearchScreen = props => {

  const [recLoc, setRecLoc] = useState(false);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [locNow, setLocNow] = useState({
    latitude: 45.523316,
    longitude: -122.689003,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421
  });

  if(!recLoc){
    Geolocation.getCurrentPosition(position => {
        setRecLoc({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        });
    }, err => {
        console.log(err);
    });
  }

    const onRegionChangeComplete = region => {
        setRecLoc(region);
        console.log('onRegionChangeComplete region = ', region);
        console.log('onRegionChangeComplete region lat delta m = ' + region.latitudeDelta*40000);
        VenueNetworking.queryVenues(region.latitude, region.longitude, region.latitudeDelta*40000, res => {
            console.log('venues = ', res);
            setVenues(res.venues);
        }, err => {
            console.log('err ', err);
        });
    }

    const onUserLocationChange = e => {

        //1. get all venues in 1 mi radius
        //2. check if location > 100 feet from previous
        //3. check if location < 100 feet from any venue
        //4. if within 100 feet, query server. Allow user to set to active, init notifications
        //5. 


        console.log('onUserLocationChange event.nativeEvent = ', e.nativeEvent);

    }
                

  return (
      
            <View style={styles.screen}>
                <ModalHeader 
                title="STATUS"
                leftIcon="menu" 
                leftIconFunction={props.leftIconFunction}
                />
                <View style={styles.mapView}>
                {
          recLoc ? 
                    <MapView provider={PROVIDER_GOOGLE} 
                    style={styles.mapContainer}
                    initialRegion={recLoc}
                    region={recLoc}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={onRegionChangeComplete}
                    onUserLocationChange={onUserLocationChange}
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
                    <CasLeagueSearchVenueSelectedVenueModal 
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
    height : '100%',
    paddingBottom : 56
  },
  mapContainer : {
    width: '100%',
    height: '100%',
    paddingBottom : 40
},

});

export default CasLeagueSearchScreen;