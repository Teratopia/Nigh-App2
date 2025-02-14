import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Button } from 'react-native';
import Colors from '../constants/colors';                                   //
import DeviceInfo from 'react-native-device-info';                          //
import { getUniqueId, getManufacturer } from 'react-native-device-info';    //
import apiSettings from '../constants/apiSettings';                         //
import CheckBox from 'react-native-check-box';                              //
import VenueNetworking from '../networking/venueNetworking';                //
import Geolocation from '@react-native-community/geolocation';              //
import AsyncStorage from '@react-native-community/async-storage';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import LoginVerifyEmailModal from '../components/LoginVerifyEmailModal';
import LoginPasswordResetModal from '../components/LoginPasswordResetModal';


const LoginScreen = props => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [deviceId, setDeviceId] = useState();
    const [pnToken, setPnToken] = useState();
    const [usernameView, setUsernameView] = useState();
    const [passwordView, setPasswordView] = useState();
    const [autoLogIn, setAutoLogIn] = useState(false);
    const [verifyEmailModal, setVerifyEmailModal] = useState(false);
    const [resetPasswordView, setResetPasswordView] = useState(false);

    getData = async () => {
        try {
          var username = await AsyncStorage.getItem('@username');
          var password = await AsyncStorage.getItem('@password');
          var storedAutoLogIn = await AsyncStorage.getItem('@autoLogIn');
          if(!storedAutoLogIn){
              storedAutoLogIn = 'false';
          }
          setAutoLogIn(storedAutoLogIn === 'true');
          if(username !== null && password !== null) {
            setPassword(password);
            setUsername(username);
            if(storedAutoLogIn === 'true'){
                loginHandler();
            }
          }
        } catch(e) {
          // error reading value
        }
      }

    if (!deviceId) {
        getData();
        var uniqueId = DeviceInfo.getUniqueId();
        console.log('login device id = ', uniqueId);
        setDeviceId(uniqueId);
        PushNotificationIOS.addEventListener('register', token=>{
            setPnToken(token);
            console.log('register token = ', token);
        });
        
        PushNotificationIOS.addEventListener('registrationError', handler=>{
            console.log('registrationError handler = ', handler);
        });

        PushNotificationIOS.requestPermissions();

            /*
            fetch(apiSettings.awsProxy+'/devId', {
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deviceId: uniqueId
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.docReturned){
                        setUsername(responseJson.docReturned.username);
                    }
                    return responseJson;
                })
                .catch((error) => {
                    console.error(error);
                });
            */
    }

    storeData = async (username, password) => {
        try {
            await AsyncStorage.setItem('@username', username);
            await AsyncStorage.setItem('@password', password);
        } catch (e) {
            console.log('storeData error = ', e);
        }
      }

    //  todo check if username taken in change handler
    usernameChangeHandler = input => {
        setUsernameView(null);
        setUsername(input.nativeEvent.text);
    }
    passwordChangeHandler = input => {
        setPasswordView(null);
        setPassword(input.nativeEvent.text);
    }
    signUpHandler = () => {
        if(checkForNullInputs()){
            if(props.venueChecked){
                Geolocation.getCurrentPosition(position => {
                    VenueNetworking.signUpVenue(username, password, position.coords.latitude, position.coords.longitude, deviceId, venue => {
                        props.setVenueUser(venue);
                    }, err => {
                        console.log('sign up err, err = ', err);
                    });
                }, err => {
                    console.log(err);
                });
            } else {
                Geolocation.getCurrentPosition(position => {
                    signUpOrLoginUser('signUp', username, password, position.coords.latitude, position.coords.longitude);
                }, err => {
                    console.log(err);
                });
            }
            
        }
    }
    loginHandler = () => {
        if(checkForNullInputs()){
            if(props.venueChecked){
                Geolocation.getCurrentPosition(position => {
                    VenueNetworking.loginVenue(username, password, position.coords.latitude, position.coords.longitude, deviceId, venue => {
                        props.setVenueUser(venue);
                    }, err => {
                        console.log('login err, err = ', err);
                    });                }, err => {
                    console.log(err);
                });
            } else {
                Geolocation.getCurrentPosition(position => {
                    console.log('position', position);
                    signUpOrLoginUser('login', username, password, position.coords.latitude, position.coords.longitude);
                }, err => {
                    console.log(err);
                });
            }
        }
    }
    checkForNullInputs = () => {
        var flag = true;
        if(!username || username.length === 0){
            setUsernameView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                <Text style={{color : 'red'}}>Username is empty.</Text>
                            </View>);
            flag = false;
        }
        if(!password || password.length === 0){
            setPasswordView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                <Text style={{color : 'red'}}>Password is empty.</Text>
                            </View>);
            flag = false;
        }
        return flag;
    }

    function initPasswordReset(username){
        setVerifyEmailModal(<LoginPasswordResetModal
                                username={username}
                                setVerifyEmailModal={setVerifyEmailModal}
                                setPasswordView={setPasswordView}
                                setResetPasswordView={setResetPasswordView}
                            />);
    }

    function handleSignUpOrLoginFailure(typeParam, responseJson){
        if(typeParam === 'signUp' && responseJson.message === 'Username Exists'){
            setUsernameView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                <Text style={{color : 'red'}}>Username Already Exists.</Text>
                            </View>);
        }
        if(typeParam === 'login' && (responseJson.message === 'Invalid password' || responseJson.message === 'Password does not match.')){
            setPasswordView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                    <Text style={{color : 'red'}}>Invalid Password.</Text>                                
                            </View>);
            setResetPasswordView(<View style={{...styles.buttonContainer, marginBottom : 8}}>
                                    <View style={{...styles.button}}>
                                        <Button 
                                            title="Reset Password"
                                            onPress={initPasswordReset}
                                            color="white"
                                        />
                                    </View>
                                </View>);
        }
        if(typeParam === 'login' && responseJson.message === 'No username found.'){
            setUsernameView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                <Text style={{color : 'red'}}>No User With This Username Exists.</Text>
                            </View>);
        }
    }

    signUpOrLoginUser = (typeParam, username, password, latitude, longitude) => {
        setUsernameView(null);
        return fetch(apiSettings.awsProxy + '/' + typeParam, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                latitude: latitude,
                longitude: longitude,
                deviceId: deviceId,
                pnToken : pnToken
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('signUpOrLoginUser '+typeParam+' responseJson = ');
                console.log(responseJson);
                if(responseJson.success === false){
                    handleSignUpOrLoginFailure(typeParam, responseJson);
                } else {
                    var retVal = responseJson.user;
                    let retUser;
                        if(Array.isArray(retVal)){
                            retUser = retVal[0];
                        } else {
                            retUser = retVal;
                        }
                    if(retUser && responseJson.message === 'No Email'){
                        console.log('no email');
                        setVerifyEmailModal(<LoginVerifyEmailModal 
                            userId={retUser._id}
                            setVerifyEmailModal={setVerifyEmailModal}
                            setUser={props.setUser}
                        />)
                    } else {
                        storeData(username, password);
                        console.log('responseJson.verificationCode = ');
                        console.log(responseJson.verificationCode);
                        if(retUser && responseJson.verificationCode){
                            setVerifyEmailModal(<LoginVerifyEmailModal 
                                userId={retUser._id}
                                email={retUser.email}
                                setVerifyEmailModal={setVerifyEmailModal}
                                setUser={props.setUser}
                                code={responseJson.verificationCode}
                                pnToken={pnToken}
                            />)
                        } else if(!retUser.email){
                            setVerifyEmailModal(<LoginVerifyEmailModal 
                                                    userId={retUser._id}
                                                    setVerifyEmailModal={setVerifyEmailModal}
                                                    setUser={props.setUser}
                                                />)
                        } else {
                            props.setUser(retUser);
                        }
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    const toggleCheckVenue = () => {
        props.venueCheck();
    }

    toggleAutoLogIn = async () => {
        var boolString = autoLogIn ? 'false' : 'true';
        await AsyncStorage.setItem('@autoLogIn', boolString);
        setAutoLogIn(!autoLogIn);
    }

    return (
        <View style={{height: '100%', backgroundColor : 'black'}}>
        <Modal visible={true} transparent={false} animationType='fade'>
        { verifyEmailModal ? 
        verifyEmailModal
        :
            null
}
            <View style={styles.parentView}>
                <View style={styles.titleView}>
                    <Text style={styles.titleText}>Nigh</Text>
                </View>
                <View style={styles.inputForm}>
                    <View style={styles.welcomeView}>
                        <Text style={styles.welcomeText}>Welcome!</Text>
                    </View>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            defaultValue={props.description}
                            placeholder="Username"
                            maxLength={32}
                            multiline={false}
                            value={username}
                            onChange={usernameChangeHandler}
                            returnKeyType="done"
                        />
                    </View>
                    {usernameView}
                    <View style={styles.textInputContainer}>
                        <TextInput
                            style={styles.textInput}
                            defaultValue={props.description}
                            placeholder="Password"
                            secureTextEntry={true}
                            maxLength={32}
                            multiline={false}
                            value={password}
                            onChange={passwordChangeHandler}
                            returnKeyType="done"
                        />
                    </View>
                    {passwordView}
                    {resetPasswordView}
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Log In!" onPress={loginHandler} color='white' />
                        </View>
                        <View style={styles.button}>
                            <Button title="Sign Up!" onPress={signUpHandler} color='white' />
                        </View>
                    </View>
                    <View style={styles.venueCheckboxContainer}>
                        <Text>Automatically Log In</Text>
                        <CheckBox 
                        leftText={"Auto Log In"} 
                        onClick={toggleAutoLogIn} 
                        isChecked={autoLogIn}
                        checkBoxColor={Colors.activeTeal}
                        />
                    </View>
                    <View style={styles.venueCheckboxContainer}>
                        <Text>Venue Sign In</Text>
                        <CheckBox 
                        leftText={"Venue Sign In"} 
                        onClick={toggleCheckVenue} 
                        isChecked={props.venueChecked}
                        checkBoxColor={Colors.activeTeal}
                        />
                    </View>
                </View>
                <View style={{ flex: 1 }}>

                </View>
            </View>
        </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    parentView: {
        flex: 1,
        //backgroundColor : 'grey',
        marginHorizontal: 50,

    },
    titleView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    titleText: {
        fontSize: 100,
        fontWeight: '800'
    },
    welcomeView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.secondary
    },
    inputForm: {
        flex: 1
    },
    textInput : {
        width:'100%', 
        flexDirection : 'row', 
        alignItems : 'center', 
        textAlign: 'center',
        color : Colors.quasiBlack,
        padding : 8
    },
    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 2,
        //marginTop : 6,
        marginBottom: 8,
        //padding: 8,
        borderColor: '#009688',
        borderRadius: 4,
        width: '100%',
        //backgroundColor: 'red'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    venueCheckboxContainer : {
        width : '100%',
        justifyContent : 'center',
        alignItems : 'center',
        flexDirection : 'row',
        marginTop : 8
    },
    button: {
        //width: '40%',
        flex : 1,
        marginHorizontal : 8,
        borderWidth: 2,
        borderColor: '#009688',
        borderRadius: 4,
        backgroundColor: Colors.secondary
    },

});

export default LoginScreen;