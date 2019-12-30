import apiSettings from '../constants/apiSettings';

async function requestEmailVerification(email, onSuccess) {
  var url = apiSettings.awsProxy + '/requestEmailVerification';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email : email
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        console.log('response.code:');
        console.log(responseJson.code);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function updateUserEmail(userId, email, onSuccess) {
  var url = apiSettings.awsProxy + '/updateUserEmail';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          email : email
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function passwordResetVerifyEmail(username, email, onSuccess, onFailure){
  var url = apiSettings.awsProxy + '/passwordResetVerifyEmail';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username : username,
          email : email
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

async function passwordReset(username, email, password, onSuccess, onFailure){
  var url = apiSettings.awsProxy + '/passwordReset';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username : username,
          email : email,
          password : password
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
      onFailure(error);
    });
}

async function addPnToken(userId, pnToken, onSuccess) {
  var url = apiSettings.awsProxy + '/addPnToken';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          pnToken : pnToken
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function updateUserStatusToActive(userId, statuses, venueId, onSuccess) {
  var url = apiSettings.awsProxy + '/updateUserStatusToActive';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          statuses : statuses,
          venueId : venueId
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson.user);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function updateUserStatuses(userId, newStatuses, onSuccess) {
    var url = apiSettings.awsProxy + '/updateUserStatuses';
    return fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            statuses : newStatuses
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function setAllUserStatusesToPassive(userId, onSuccess) {
    var url = apiSettings.awsProxy + '/setAllUserStatusesToPassive';
    return fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function updateUserLocation(userId, latitude, longitude, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/updateUserLocation';
    return fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            latitude : latitude,
            longitude : longitude,
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
          onSuccess(responseJson.user);
      })
      .catch((error) => {
        console.error(error);
        //onFailure(error);
      });
  }

  async function deleteAllUsers() {
    var url = apiSettings.awsProxy + '/deleteAllUsers';
    console.log('delete all users 1');
    return fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('deleted.');
          console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
        //onFailure(error);
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

  async function updateUserProfilePic(node, userId, onSuccess, onFailure){
    var url = apiSettings.awsProxy + '/updateUserProfilePic';
      console.log('updateUserProfilePic node = ', node);
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createFormData(node, {userId : userId})
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload profile pic success", response);
        //alert("Upload profile pic success!");
        onSuccess(response);
      })
      .catch(error => {
        console.log("upload error", error);
        //alert("Upload failed!");
        onFailure(response);
      });
  };

  async function getUserProfileImage(userId, onSuccess, onFailure){
    var url = apiSettings.awsProxy + '/getUserProfileImage';
        fetch(url, {
            method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId : userId
                }),
        })
        .then(response => response.json())
        .then(response => {
        console.log("getUserProfileImage success", response);
        onSuccess(response);
        })
        .catch(error => {
        console.log("getUserProfileImage error", error);
        });
    };

    async function updateUserProfileInformation(reqBody, onSuccess, onFailure){
        var url = apiSettings.awsProxy + '/updateUserProfileInformation';
        fetch(url, {
            method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
        })
        .then(response => response.json())
        .then(response => {
        console.log("updateUserProfileInformation success", response);
        onSuccess(response);
        })
        .catch(error => {
        console.log("updateUserProfileInformation error", error);
        });
    };

    async function searchUserByUsername(username, onSuccess, onFailure){
      console.log('searchUserByUsername username = '+username);
      var url = apiSettings.awsProxy + '/searchUserByUsername';
      fetch(url, {
          method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username : username
              }),
      })
      .then(response => response.json())
      .then(response => {
      console.log("searchUserByUsername success", response);
      onSuccess(response);
      })
      .catch(error => {
      console.log("searchUserByUsername error", error);
      });
  };

  async function getMultipleUsersById(userIds, onSuccess, onFailure){
    console.log('getMultipleUsersById userIds = '+userIds);
    var url = apiSettings.awsProxy + '/getMultipleUsersById';
    fetch(url, {
        method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userIds : userIds
            }),
    })
    .then(response => response.json())
    .then(response => {
    console.log("getMultipleUsersById success", response);
    onSuccess(response);
    })
    .catch(error => {
    console.log("getMultipleUsersById error", error);
    });
};

  async function sendFriendRequest(requesterId, requesteeId, message, onSuccess, onFailure){
    console.log('sendFriendRequest requesterId = '+requesterId+', requesteeId = '+requesteeId);
    var url = apiSettings.awsProxy + '/sendFriendRequest';
    fetch(url, {
        method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              requesterId : requesterId,
              requesteeId : requesteeId,
              message : message
            }),
    })
    .then(response => response.json())
    .then(response => {
    console.log("sendFriendRequest success", response);
    onSuccess(response);
    })
    .catch(error => {
    console.log("sendFriendRequest error", error);
    });
};

async function getAllFriendRequestsForUser(userId, onSuccess, onFailure){
  console.log('getAllFriendRequestsForUser userId = '+userId);
  var url = apiSettings.awsProxy + '/getAllFriendRequestsForUser';
  fetch(url, {
      method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId : userId
          }),
  })
  .then(response => response.json())
  .then(response => {
  console.log("getAllFriendRequestsForUser success", response);
    onSuccess(response);
  })
  .catch(error => {
    console.log("getAllFriendRequestsForUser error", error);
  });
};

async function acceptFriendRequest(userId, requesterId, onSuccess, onFailure){
  console.log('acceptFriendRequest userId = '+userId);
  var url = apiSettings.awsProxy + '/acceptFriendRequest';
  fetch(url, {
      method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId : userId,
            requesterId : requesterId
          }),
  })
  .then(response => response.json())
  .then(response => {
  console.log("acceptFriendRequest success", response);
    onSuccess(response);
  })
  .catch(error => {
    console.log("acceptFriendRequest error", error);
  });
};

async function getUserFriends(userId, onSuccess, onFailure){
  console.log('getUserFriends userId = '+userId);
  var url = apiSettings.awsProxy + '/getUserFriends';
  fetch(url, {
      method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId : userId
          }),
  })
  .then(response => response.json())
  .then(response => {
  console.log("getUserFriends success", response);
    onSuccess(response);
  })
  .catch(error => {
    console.log("getUserFriends error", error);
  });
};

async function toggleBlockFriend(userId, friendToBlockId, onSuccess) {
  var url = apiSettings.awsProxy + '/toggleBlockFriend';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          friendToBlockId : friendToBlockId
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function addVenueIdToFavorites(userId, venueId, onSuccess) {
  var url = apiSettings.awsProxy + '/addVenueIdToFavorites';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          venueId : venueId
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function removeVenueIdFromFavorites(userId, venueId, onSuccess) {
  var url = apiSettings.awsProxy + '/removeVenueIdFromFavorites';
  return fetch(url, {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          userId : userId,
          venueId : venueId
      }),
  })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log('response:');
        console.log(responseJson);
        onSuccess(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
}


  export default {requestEmailVerification,
                  updateUserEmail,
                  addPnToken,
                  updateUserStatuses, 
                  setAllUserStatusesToPassive, 
                  updateUserLocation, 
                  deleteAllUsers, 
                  updateUserProfilePic, 
                  getUserProfileImage, 
                  updateUserProfileInformation, 
                  searchUserByUsername, 
                  sendFriendRequest,
                  getAllFriendRequestsForUser,
                  acceptFriendRequest,
                  getUserFriends,
                  toggleBlockFriend,
                  getMultipleUsersById,
                  updateUserStatusToActive,
                  addVenueIdToFavorites,
                  removeVenueIdFromFavorites,
                  passwordResetVerifyEmail,
                  passwordReset
                };