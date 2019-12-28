import apiSettings from '../constants/apiSettings';

async function sendFeedback(user, text, type, severity, onSuccess, onFailure){
    var url = apiSettings.awsProxy + '/sendFeedback';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user : user,
            text : text,
            type : type,
            severity : severity
        }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('sendFeedback response:');
          console.log(responseJson);
          onSuccess(responseJson);
      })
      .catch((error) => {
        console.error(error);
        onFailure(error);
      });
}

export default {sendFeedback}