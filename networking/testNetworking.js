import apiSettings from '../constants/apiSettings';

function testTodos() {
    var url = apiSettings.awsProxy + '/api/v1/todos';
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
          console.log('response:');
          console.log(responseJson);
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  export default testTodos;