import React from 'react';
import apiSettings from '../constants/apiSettings';

async function getAllUsers(userId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getAllUsers';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
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

  async function getAllUsersByActivity(userId, activity, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getAllUsersByActivity';
    console.log('getAllUsersByActivity 2');
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            activity : activity
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

  async function getAllUsersByActivityAndRange(userId, activity, range, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getAllUsersByActivityAndRange';
    console.log('getAllUsersByActivity 2');
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            activity : activity,
            range : range
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

  export default { getAllUsers, getAllUsersByActivity, getAllUsersByActivityAndRange };