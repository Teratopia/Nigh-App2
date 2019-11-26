

/*
{
            _id: 1,
            text: 'Hello developer',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },


          var Message = mongoose.Schema({
                userId: String,
                createDate: Date,
                text : String
                });

            const matchSchema = mongoose.Schema({
                _id : mongoose.Schema.Types.ObjectId,
                matchDate : Date,
                userOne : User.schema,
                userTwo : User.schema,
                messages : [Message]
            });
*/


import UNW from '../networking/userNetworking';
const fs = require('react-native-fs');

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


async function reformatMessages(match){

    let userOneAvatar = null;
    let userTwoAvatar = null;

    if(checkProfilePic(match.userOne._id)){
        userOneAvatar = fs.CachesDirectoryPath+'/'+match.userOne._id+'profilePicture.jpeg';
    } else {
        userOneAvatar = fetchProfileImage(match.userOne._id);
    }
    if(checkProfilePic(match.userTwo._id)){
        userTwoAvatar = fs.CachesDirectoryPath+'/'+match.userTwo._id+'profilePicture.jpeg';
    } else {
        userTwoAvatar = fetchProfileImage(match.userTwo._id);
    }

    /*
    var userOneLoggedIn = false;
    var userTwoLoggedIn = false;

    console.log('match.userOne._id = '+match.userOne._id);
    console.log('match.userTwo._id = '+match.userTwo._id);

    if(checkProfilePic(match.userOne._id)){
        userOneAvatar = fs.CachesDirectoryPath+'/'+match.userOne._id+'profilePicture.jpeg';
        userOneLoggedIn = true;
    }
    if(checkProfilePic(match.userTwo._id)){
        userTwoAvatar = fs.CachesDirectoryPath+'/'+match.userTwo._id+'profilePicture.jpeg';
        userTwoLoggedIn = true;
    }
    if(!userOneLoggedIn){
        UNW.getUserProfileImage(match.userOne._id, res => {
            userOneAvatar = 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data);
            //setImageSource({uri : 'data:image/jpeg;base64,' + arrayBufferToBase64(imgDoc.image.source.data.data)});
        }, err => {
            console.log('err 2 = '+err);
        }).then(() => {
            if(!userTwoLoggedIn){
                UNW.getUserProfileImage(match.userTwo._id, res => {
                    userTwoAvatar = 'data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data);
                },err => {
                    console.log('err 2 = '+err);
                }).then(() => {
                    return buildMessages(match, userOneAvatar, userTwoAvatar);
                });
            } else {
                return buildMessages(match, userOneAvatar, userTwoAvatar);
            }
        });
    } else {
        return buildMessages(match, userOneAvatar, userTwoAvatar);
    }
    */

    console.log('before build messages userOneAvatar = ', userOneAvatar);
    console.log('before build messages userTwoAvatar = ', userTwoAvatar);

    return buildMessages(match, userOneAvatar, userTwoAvatar);
    
}

function buildMessages(match, userOneAvatar, userTwoAvatar){
    var retVal = [];
    var userOne = {
        _id : match.userOne._id,
        name : match.userOne.username,
        //avatar : userOneAvatar
    }
    var userTwo = {
        _id : match.userTwo._id,
        name : match.userTwo.username,
        //avatar : userTwoAvatar
    }
    console.log('match = ', match);
    match.messages.forEach(function(message){
        var newMess = {
            _id : message._id,
            text : message.text,
            createdAt : message.createDate,
        };
        if(message.userId === userOne._id){
            newMess.user = userOne;
        } else {
            newMess.user = userTwo;
        }
        retVal.push(newMess);
    });
    console.log('retVal = ', retVal);
    return sortByDate(retVal);
}

function checkProfilePic(userId){
        var path = fs.CachesDirectoryPath+'/'+userId+'profilePicture.jpeg';
        let promise = new Promise(function(resolve, reject){
            fs.exists(path).then( exists => {
                        if(exists){
                            console.log('checkProfilePic true');
                            resolve(true);
                        } else {
                            console.log('checkProfilePic false');
                            resolve(false);
                        }
                      });
        });
        return promise;
}

function fetchProfileImage(userId){
    let promise = new Promise(function(resolve, reject){
        UNW.getUserProfileImage(userId, res => {
            resolve('data:image/jpeg;base64,' + arrayBufferToBase64(res.image.source.data.data));
        }, err => {
            console.log('err 2 = '+err);
        });
    });
    return promise;
}

function sortByDate(messages){
    messages.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return messages;
}

export default {reformatMessages};
