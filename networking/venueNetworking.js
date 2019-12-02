import apiSettings from '../constants/apiSettings';

async function signUpVenue(username, password, latitude, longitude, deviceId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/signUpVenue';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username : username,
            password : password,
            latitude : latitude,
            longitude : longitude,
            deviceId : deviceId
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.venue);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  async function loginVenue(username, password, latitude, longitude, deviceId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/loginVenue';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username : username,
            password : password,
            latitude : latitude,
            longitude : longitude,
            deviceId : deviceId
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.venue);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  async function updateVenue(venue, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/updateVenue';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            venue : venue
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.venue);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function getVenueById(venueId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getVenueById';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            venueId : venueId
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.venue);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  async function getPlayersCheckedIntoVenue(venueId, activityName, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getPlayersCheckedIntoVenue';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            venueId : venueId,
            activityName, activityName
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.users);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function formatGooglePlacesVenueSearchParameters(inputs){
    var params = '';
    inputs.name ? params += inputs.name.replace(' ', '%20') : null;
    inputs.city ? params += '%20'+inputs.city.replace(' ', '%20') : null;
    inputs.state ? params += '%20'+inputs.state.replace(' ', '%20') : null;
    inputs.postal ? params += '%20'+inputs.postal.replace(' ', '%20') : null;
    return params;
  }

  async function googlePlacesVenueSearch(inputValues, onSuccess, onFailure) {
    var url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+
    formatGooglePlacesVenueSearchParameters(inputValues)+    
    '&inputtype=textquery&fields=formatted_address,name,geometry,place_id&key=AIzaSyBp4GwE_fYTiarpHSenh8WSE3dBC72SLzE';
    console.log('googlePlacesVenueSearch url:'+url);
    return fetch(url, {
        method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('googlePlacesVenueSearch response:');
          console.log(responseJson);
          onSuccess(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  async function getVenueDetails(googlePlaceId, onSuccess, onFailure) {
    var url = 'https://maps.googleapis.com/maps/api/place/details/json?place_id='+googlePlaceId+
                '&fields=address_component,name,permanently_closed,type,formatted_phone_number,opening_hours,website'+
                '&key=AIzaSyBp4GwE_fYTiarpHSenh8WSE3dBC72SLzE';
    return fetch(url, {
        method: 'GET'
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('getVenueDetails response:');
          console.log(responseJson);
          onSuccess(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  async function queryVenues(lat, long, radius, onSuccess, onFailure) {
      var url = apiSettings.awsProxy + '/queryVenues';
      return fetch(url, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lat : lat,
                        long :long,
                        radius :radius
                    }),
                })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('getVenueDetails response:');
          console.log(responseJson);
          onSuccess(responseJson);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      });
  }
  
  async function addTableToVenue(venueId, poolTable, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/addTableToVenue';
    return fetch(url, {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      venueId : venueId,
                      poolTable :poolTable
                  }),
              })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('addTableToVenue response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

async function updateTable(venueId, poolTable, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/updateTable';
    return fetch(url, {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      venueId : venueId,
                      poolTable :poolTable
                  }),
              })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('updateTable response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

async function deletePoolTable(venueId, tableId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/deletePoolTable';
    return fetch(url, {
                  method: 'DELETE',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      venueId : venueId,
                      tableId :tableId
                  }),
              })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('deletePoolTable response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

const createFormData = (node, body) => {
    console.log('createFormData 1 node = ', node);
    const data = new FormData();
    data.append("photo", {
      name: node.fileName,
      //type: node.type,
      type: node.type,
      uri: node.uri
    });
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    console.log('createFormData 2 data = ', data);
    return data;
  };

async function upsertVenuePromotion(node, venueId, promotion, onSuccess, onFailure){
    console.log('upsertVenuePromotion venueId = ', venueId);
    var url = apiSettings.awsProxy + '/upsertVenuePromotion';
      console.log('upsertVenuePromotion node = ', node);
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: createFormData(node, {venueId : venueId, ...promotion})
    })
      .then(response => response.json())
      .then(response => {
        console.log("upsertVenuePromotion success", response);
        onSuccess(response);
      })
      .catch(error => {
        console.log("upsertVenuePromotion error", error);
        onFailure(response);
      });
  };
  
  async function getVenuePromotionImage(venuePromotion, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getVenuePromotionImage';
    return fetch(url, {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    venuePromotion : venuePromotion
                  }),
              })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('getVenuePromotionImage response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

async function deletePromotion(venueId, promotionId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/deletePromotion';
    return fetch(url, {
                  method: 'POST',
                  headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    venueId : venueId,
                    venuePromotionId : promotionId
                  }),
              })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('deletePromotion response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

  

  export default {
                    signUpVenue,
                    loginVenue,
                    googlePlacesVenueSearch,
                    updateVenue,
                    getVenueDetails,
                    queryVenues,
                    addTableToVenue,
                    updateTable,
                    getVenueById,
                    getPlayersCheckedIntoVenue,
                    deletePoolTable,
                    upsertVenuePromotion,
                    getVenuePromotionImage,
                    deletePromotion
                };