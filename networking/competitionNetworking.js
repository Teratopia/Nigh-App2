import apiSettings from '../constants/apiSettings';

async function requestCompetition(competition, onSuccess) {
    var url = apiSettings.awsProxy + '/requestCompetition';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            competition : competition,
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

  async function checkForCompetition(userId, friendId, onSuccess) {
    var url = apiSettings.awsProxy + '/checkForCompetition';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            friendId : friendId,
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
  
  async function deleteChallenge(competitionId, onSuccess) {
    var url = apiSettings.awsProxy + '/deleteChallenge';
    return fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            competitionId : competitionId,
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
  
  async function acceptChallenge(competitionId, onSuccess) {
    var url = apiSettings.awsProxy + '/acceptChallenge';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            competitionId : competitionId
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
  
  async function updateChallenge(competition, onSuccess) {
    var url = apiSettings.awsProxy + '/updateChallenge';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            competition : competition
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
  
  async function confirmChallenge(userId, competitionId, onSuccess) {
    var url = apiSettings.awsProxy + '/confirmChallenge';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            competitionId : competitionId
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

  async function getCompetitionHistory(userId, friendId, onSuccess) {
    var url = apiSettings.awsProxy + '/getCompetitionHistory';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : userId,
            friendId : friendId
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

  async function getVenueCompetitionHistory(venueId, fromDate, toDate, onSuccess) {
    var url = apiSettings.awsProxy + '/getVenueCompetitionHistory';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            venueId : venueId,
            fromDate : fromDate,
            toDate : toDate
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

  export default {  
                    requestCompetition, 
                    checkForCompetition,
                    deleteChallenge,
                    acceptChallenge,
                    updateChallenge,
                    confirmChallenge,
                    getCompetitionHistory,
                    getVenueCompetitionHistory
                };