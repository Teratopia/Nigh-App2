import apiSettings from '../constants/apiSettings';

const createFormData = (node, body) => {
    console.log('createFormData 1 node = ', node);
    const data = new FormData();
    data.append("photo", {
      name: node.fileName,
      //type: node.type,
      type: node.type,
      uri: node.uri
    });
    if(body){
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
    }
    console.log('createFormData 2 data = ', data);
    return data;
  };

async function uploadImageAndReturnId(node, onSuccess, onFailure){
    var url = apiSettings.awsProxy + '/uploadImageAndReturnId';
      console.log('uploadImageAndReturnId node = ', node);
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: createFormData(node)
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload image success id = ", response);
        onSuccess(response);
      })
      .catch(error => {
        console.log("upload error", error);
        onFailure(response);
      });
  };

  async function getImageById(imageId, onSuccess, onFailure) {
    var url = apiSettings.awsProxy + '/getImageById';
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            imageId : imageId
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

  export default {uploadImageAndReturnId, getImageById}