import React, {useState} from 'react';
import {Text, View, TextInput, Button, StyleSheet} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';   //
import VenueNetworking from '../networking/venueNetworking';    //
import CasLeagueVenueUserInitSetupMapMarkerModal from '../venueUser/CasLeagueVenueUserInitSetupMapMarkerModal'; //
import Colors from '../constants/colors';   //
import Geolocation from '@react-native-community/geolocation';

const CasLeagueVenueUserInitSetup = props => {

  const [view, setView] = useState('HOME');
  const [selectedGooglePlace, setSelectedGooglePlace] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchForm, setSearchForm] = useState({
      name : null,
      address : null,
      city : null,
      state : null,
      postal : null,
  });
  const [locNow, setLocNow] = useState({
    latitude: 45.523316,
    longitude: -122.689003,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421
  });

  const editForm = (field, value) => {
      console.log('editForm value = ', value);
    var sfClone = {...searchForm};
    sfClone[field] = value.nativeEvent.text;
    setSearchForm(sfClone);
  }

  const searchForVenue = () => {
      console.log('searchForm = ', searchForm);
    VenueNetworking.googlePlacesVenueSearch(searchForm, res => {
        console.log('googlePlacesVenueSearch 2 res = ', res);
        if(res && res.candidates && res.candidates.length > 0){
            setSearchResults(res.candidates);
        } else {
            setSearchResults([]);
        }
    }, err => {
        console.log('googlePlacesVenueSearch err = ', err);
    })
  }

  const clickGooglePlaceMarker = googlePlace => {
      console.log('clickGooglePlaceMarker googlePlace = ', googlePlace);
      setSelectedGooglePlace(googlePlace);
  }

  const confirmVenue = () => {
      if(selectedGooglePlace){
          var venueUserClone = {...props.venueUser};
          venueUserClone.googlePlaceId = selectedGooglePlace.place_id;
          venueUserClone.location.coordinates = [selectedGooglePlace.geometry.location.lng, selectedGooglePlace.geometry.location.lat];
          venueUserClone.properName = selectedGooglePlace.name;
          VenueNetworking.updateVenue(venueUserClone, venue => {
              console.log('updateVenue value = ', venue);
              if(venue){
                  setSelectedGooglePlace(null);
                  props.setVenueUser(venue);
              }
          }, err => {
              console.log('updateVenue err = ', err)
          })
      }
  }

  Geolocation.getCurrentPosition(position => {
        let newLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421
        };
        if(locNow.latitude !== newLoc.latitude || locNow.longitude !== newLoc.longitude){
            setLocNow(newLoc);
        }
    }, err => {
        console.log(err);
    });

    let modalView;
    if(selectedGooglePlace){
        modalView = <CasLeagueVenueUserInitSetupMapMarkerModal 
                        googlePlace={selectedGooglePlace} 
                        setSelectedGooglePlace={setSelectedGooglePlace}
                        confirmVenue={confirmVenue}
                    />
    }

  return (
            <View style={styles.parentView}>
                <View style={styles.inputFormView}>
                    <View style={styles.inputFormHeader}>
                        <Text style={styles.inputFormHeaderText}>Find Your Venue</Text>
                    </View> 
                    <View style={{...styles.inputFormTextInput, width : '100%'}}>
                        <TextInput 
                        onSubmitEditing={e => {editForm('name', e)}}
                        placeholder="Venue Name" 
                        maxLength={144}
                        placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                        />
                    </View>
                    <View style={{...styles.inputFormTextInput, width : '100%'}}>
                    <TextInput 
                        onSubmitEditing={e => {editForm('address', e)}}
                        placeholder="Address" 
                        maxLength={144}
                        placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                        />
                    </View>
                    <View style={styles.inputFormRow}>
                        <View style={{...styles.inputFormRowElement, flex : 3}}>
                            <View style={styles.inputFormTextInput}>
                            <TextInput 
                                onSubmitEditing={e => {editForm('city', e)}}
                                placeholder="City" 
                                maxLength={144}
                                placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                />
                            </View>
                        </View>

                        <View style={{...styles.inputFormRowElement, marginHorizontal : 8}}>
                            <View style={styles.inputFormTextInput}>
                            <TextInput 
                                onSubmitEditing={e => {editForm('state', e)}}
                                placeholder="State" 
                                maxLength={2}
                                placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                />
                            </View>
                        </View>

                        <View style={styles.inputFormRowElement}>
                            <View style={styles.inputFormTextInput}>
                            <TextInput 
                                onSubmitEditing={e => {editForm('postal', e)}}
                                placeholder="Zip" 
                                maxLength={5}
                                placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.searchButton}>
                        <Button onPress={searchForVenue} title="SEARCH" color="white"/>
                    </View>
                </View>
                <View style={styles.mapView}>
                    <MapView provider={PROVIDER_GOOGLE} 
                    style={styles.mapContainer}
                    initialRegion={locNow}
                    region={locNow}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    showsMyLocationButton={true}
                    onRegionChangeComplete={() => {}}
                    onUserLocationChange={() => {}}
                    maxZoomLevel={10}
                    >
                        {searchResults.map(res => (
                        <MapView.Marker
                        key={res.place_id}
                        identifier={res.place_id}
                        //title={res.name}
                        coordinate={{
                            latitude : res.geometry.location.lat, 
                            longitude : res.geometry.location.lng, 
                            latitudeDelta: 0.00922,
                            longitudeDelta: 0.00421}}
                        onPress={() => clickGooglePlaceMarker(res)}
                        />
                    ))}
                    </MapView>
            
                </View>
                {modalView}
            </View>
        );
}

const styles = StyleSheet.create({
  parentView : {
    flex:1,
    alignItems: 'center',
    justifyContent : 'center',
    width : '100%',
    //backgroundColor : 'green'
  },
  inputFormView : {
    flex : 1,
    alignItems: 'center',
    justifyContent : 'center',
    width : '100%',
    padding : 12,
    borderBottomColor : Colors.inactiveGrey,
    borderBottomWidth : 1
    //backgroundColor : 'yellow'
  },
  mapView : {
    flex : 3,
    alignItems: 'center',
    justifyContent : 'center',
    width : '100%',
    height : '100%',
    //backgroundColor : 'red'
  },
  mapContainer : {
    width: '100%',
    height: '100%',
    //backgroundColor : 'blue'
},
inputFormHeader : {
    
},
inputFormHeaderText : {
    color : Colors.quasiBlack,
    fontWeight : '700',
    fontSize : 18
},
inputFormTextInput : {
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    padding : 4,
    margin : 4,
    borderRadius : 8,
    width : '100%',
    textAlign : 'center'
},
inputFormRow : {
    flexDirection : 'row',
    justifyContent : 'space-between',
    width : '100%',

},
inputFormRowElement : {
    justifyContent : 'center',
    alignItems : 'center',
    flex : 1
},
searchButton : {
    width : '100%',
    backgroundColor : Colors.activeTeal,
    borderRadius : 8,
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    marginVertical : 4
}

});

export default CasLeagueVenueUserInitSetup;