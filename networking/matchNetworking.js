import apiSettings from '../constants/apiSettings';

async function createOrFetchMatch(userId, matchUserId, event, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/createOrFetchMatch';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            matchUserId : matchUserId,
            event : event
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('createOrFetchMatch response:');
          console.log(responseJson);
          onSuccess(responseJson.match);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      });
  }

  async function fetchMatchById(matchId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/fetchMatchById';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            matchId : matchId,
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('fetchMatchById response:');
          console.log(responseJson);
          onSuccess(responseJson.match);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      });
  }

  async function findAllMatchesByUserId(userId, onSuccess, onFailure) {
      console.log('findAllMatchesByUserId');
    var url = apiSettings.awsProxy + '/findAllMatchesByUserId';
    return fetch(url, {
        method: 'POST',
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
          console.log('findAllMatchesByUserId response:');
          console.log(responseJson);
          onSuccess(responseJson.matches);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      });
  }

  export default {createOrFetchMatch, findAllMatchesByUserId, fetchMatchById};