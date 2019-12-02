import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Button } from 'react-native';
import Colors from '../constants/colors';                                   //
import DeviceInfo from 'react-native-device-info';                          //
import { getUniqueId, getManufacturer } from 'react-native-device-info';    //
import apiSettings from '../constants/apiSettings';                         //
import CheckBox from 'react-native-check-box';                              //
import VenueNetworking from '../networking/venueNetworking';                //
import Geolocation from '@react-native-community/geolocation';              //


const LoginScreen = props => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [deviceId, setDeviceId] = useState();
    const [usernameView, setUsernameView] = useState();
    const [passwordView, setPasswordView] = useState();

    if (!deviceId) {
        var uniqueId = DeviceInfo.getUniqueId();
            setDeviceId(uniqueId);
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
        //});

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
                deviceId: deviceId
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log('signUpOrLoginUser '+typeParam+' responseJson = ');
                console.log(responseJson);
                var retVal = responseJson.user;
                if(typeParam === 'signUp' && responseJson.message === 'Username Exists'){
                    setUsernameView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                        <Text style={{color : 'red'}}>Username already exists.</Text>
                                    </View>);
                } else if (typeParam === 'login' && responseJson.message === 'Invalid password'){
                    setPasswordView(<View style={{marginBottom : 8, justifyContent : 'center', alignItems: 'center'}}>
                                        <Text style={{color : 'red'}}>Invalid Password.</Text>
                                    </View>);
                } else {
                    if(Array.isArray(retVal)){
                        props.setUser(retVal[0]);
                    } else {
                        props.setUser(retVal);
                    }
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    const toggleCheckVenue = () => {
        props.venueCheck();
    }

    return (
        <View style={{height: '100%', backgroundColor : 'black'}}>
        <Modal visible={true} transparent={false} animationType='fade'>
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
                        />
                    </View>
                    {passwordView}
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Log In!" onPress={loginHandler} color='white' />
                        </View>
                        <View style={styles.button}>
                            <Button title="Sign Up!" onPress={signUpHandler} color='white' />
                        </View>
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
        width: '40%',
        borderWidth: 2,
        borderColor: '#009688',
        borderRadius: 4,
        backgroundColor: Colors.secondary
    },

});

export default LoginScreen;