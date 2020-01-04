import React, {useState} from 'react';
import {View, StyleSheet, Text, Modal, TextInput, Button, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';
import UserNetworking from '../networking/userNetworking';

const LoginVerifyEmailModal = props => {

    const[usernameInput, setUsernameInput] = useState();
    const[emailInput, setEmailInput] = useState();
    const[code, setCode] = useState();
    const[codeInput, setCodeInput] = useState();
    const[emailVerified, setEmailVerified] = useState(false);
    const[newPasswordInput, setNewPasswordInput] = useState();
    const[confirmPasswordInput, setConfirmPasswordInput] = useState();
    const[warningMessage, setWarningMessage] = useState();

    function submitEmailVerificationRequest(){
        console.log('usernameInput = ', usernameInput);
        console.log('emailInput = ', emailInput);
        UserNetworking.passwordResetVerifyEmail(usernameInput, emailInput, res => {
            console.log('submitEmailVerificationRequest res = ', res);
            setCode(res.code);
        }, err => {
            console.log('submitEmailVerificationRequest err = ', err);
        })
    }

    function submitCodeInput(){
        if(codeInput === code){
            setEmailVerified(true);
        } else {
            setCode(null);
        }
    }

    function requestPasswordUpdate(){
        if(newPasswordInput === confirmPasswordInput){
            UserNetworking.passwordReset(usernameInput, emailInput, newPasswordInput, res => {
                console.log('requestPasswordUpdate res = ', res);
                if(res.success){
                    props.setVerifyEmailModal(null);
                    props.setPasswordView(null);
                    props.setResetPasswordView(null);
                } else {
                    setWarningMessage(
                        <View style={{width : '100%', justifyContent : 'center', alignItems : 'center', marginVertical : 4}}>
                            <Text style={{
                                textAlign : 'center',
                                fontWeight : '600',
                                fontSize : 16
                            }}>An Error Occurred.</Text>
                        </View>);
                }
            }, err => {
                console.log('requestPasswordUpdate err = ', err);
            })
        } else {
            //setConfirmPasswordInput(null);
            setWarningMessage(
            <View style={{width : '100%', justifyContent : 'center', alignItems : 'center', marginVertical : 4}}>
                <Text style={{
                    textAlign : 'center',
                    fontWeight : '600',
                    fontSize : 16
                }}>Passwords Do Not Match.</Text>
            </View>);
        }
        
    }

    return (

        <Modal visible={true}>
            <View style={styles.shadowBox}>
                <View style={styles.modalView}>
                    
                    <Text style={{
                        fontSize : 24,
                        fontWeight : '700',
                        color : Colors.quasiBlack
                    }}>Reset Password</Text>
                    
                    { emailVerified ? 
                        <View style={{width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                            <View style={{marginTop : 12}}>
                                <Text style={{
                                    fontSize : 16,
                                    //fontWeight : '700',
                                    color : Colors.inactiveGrey,
                                    textAlign : 'center'
                                }}>New Password</Text>
                            </View>
                            <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                                <TextInput
                                    key="newPasswordTextInput"
                                    onSubmitEditing={e => {setNewPasswordInput(e.nativeEvent.text)}}
                                    defaultValue=""
                                    style={{
                                        //margin : 24,
                                        padding : 8, 
                                        borderWidth : 1,
                                        borderColor : Colors.inactiveGrey,
                                        borderRadius : 8,
                                        flex : 1,
                                        textAlign : 'center',
                                        color : Colors.quasiBlack
                                    }}
                                    returnKeyType="done"
                                    secureTextEntry={true}
                                />
                            </View>
                            {
                                newPasswordInput ? 
                            <View style={{width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                                <View>
                                        <Text style={{
                                            fontSize : 16,
                                            //fontWeight : '700',
                                            color : Colors.inactiveGrey,
                                            textAlign : 'center'
                                        }}>Confirm New Password</Text>
                                    </View>
                                    <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                                        <TextInput
                                            key="newPasswordTextInput"
                                            onSubmitEditing={e => {setConfirmPasswordInput(e.nativeEvent.text)}}
                                            defaultValue=""
                                            style={{
                                                //margin : 24,
                                                padding : 8, 
                                                borderWidth : 1,
                                                borderColor : Colors.inactiveGrey,
                                                borderRadius : 8,
                                                flex : 1,
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                            returnKeyType="done"
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                                :
                                null
                            }
                            {warningMessage}
                        </View>
                    : code ? 
                        <View style={{width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                            <View style={{marginTop : 12}}>
                                <Text style={{
                                    fontSize : 16,
                                    //fontWeight : '700',
                                    color : Colors.inactiveGrey,
                                    textAlign : 'center'
                                }}>A verification code has been sent to {emailInput}.</Text>
                            </View>
                            <View style={{marginTop : 12}}>
                                <Text style={{
                                    fontSize : 16,
                                    //fontWeight : '700',
                                    color : Colors.inactiveGrey,
                                    textAlign : 'center'
                                }}>Verification Code</Text>
                            </View>
                            <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                                <TextInput
                                    key="verificationCodeTextInput"
                                    onSubmitEditing={e => {setCodeInput(e.nativeEvent.text)}}
                                    defaultValue=""
                                    textContentType='oneTimeCode'
                                    style={{
                                        //margin : 24,
                                        padding : 8, 
                                        borderWidth : 1,
                                        borderColor : Colors.inactiveGrey,
                                        borderRadius : 8,
                                        flex : 1,
                                        textAlign : 'center',
                                        color : Colors.quasiBlack
                                    }}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>
                    :
                    <View style={{width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                        <View style={{marginTop : 12}}>
                            <Text style={{
                                fontSize : 16,
                                //fontWeight : '700',
                                color : Colors.inactiveGrey
                            }}>Username</Text>
                        </View>
                        <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                            <TextInput
                                key="usernameTextInput"
                                onSubmitEditing={e => {setUsernameInput(e.nativeEvent.text)}}
                                defaultValue=""
                                style={{
                                    //margin : 24,
                                    padding : 8, 
                                    borderWidth : 1,
                                    borderColor : Colors.inactiveGrey,
                                    borderRadius : 8,
                                    flex : 1,
                                    textAlign : 'center',
                                    color : Colors.quasiBlack
                                }}
                                returnKeyType="done"
                            />
                        </View>

                        <View style={{
                            //marginTop : 12
                            }}>
                                <Text style={{
                                    fontSize : 16,
                                    //fontWeight : '700',
                                    color : Colors.inactiveGrey
                                }}>Email</Text>
                            </View>
                        
                        <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                            <TextInput
                                key="emailTextInput"
                                onSubmitEditing={e => {setEmailInput(e.nativeEvent.text)}}
                                defaultValue=""
                                textContentType='emailAddress'
                                style={{
                                    //margin : 24,
                                    padding : 8, 
                                    borderWidth : 1,
                                    borderColor : Colors.inactiveGrey,
                                    borderRadius : 8,
                                    flex : 1,
                                    textAlign : 'center',
                                    color : Colors.quasiBlack
                                }}
                                returnKeyType="done"
                            />
                        </View>
                        
                    </View>

                    }

                <View style={{flexDirection : 'row'}}>
                        <View style={styles.activeButton}
                            //style={email && email.length > 0 ? styles.activeButton : styles.inactiveButton}
                            >
                                <Button 
                                    title={emailVerified ? 
                                        'RESET'
                                        : code ? 
                                        'SUBMIT'
                                        :
                                        'REQUEST VERIFICATION CODE'
                                    }
                                    color="white" 
                                    //disabled={!(email && email.length > 0)}
                                    onPress={emailVerified ? 
                                        requestPasswordUpdate
                                        : code ? 
                                        submitCodeInput
                                        :
                                        submitEmailVerificationRequest
                                    } />
                            </View>
                        </View>
                        <View style={{flexDirection : 'row'}}>
                            <View style={{...styles.inactiveButton, marginTop : 0}}>
                                <Button 
                                    title="CANCEL" 
                                    color="white" 
                                    //disabled={!(email && email.length > 0)}
                                    onPress={() => {props.setVerifyEmailModal(null)}} />
                            </View>
                        </View>
                </View>
                
            </View>
        </Modal>

        
    );
}

const styles = StyleSheet.create({
    modalView: {
        alignItems: 'center',
        justifyContent : 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.activeTeal,
        margin : 24
    },
    shadowBox : {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        width : '100%',
        height : '100%',
        alignItems : 'center',
        justifyContent : 'center'
    },
    addressTextView : {
        marginVertical : 4,
        textAlign : 'center',

    },
    addressText : {
        fontWeight : '500', 
        fontSize : 12, 
        color : Colors.inactiveGrey,
        textAlign : 'center',
    },
    activeButton : {
        flex : 1,
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.inactiveGrey, 
        backgroundColor : Colors.activeTeal,
        marginVertical : 4,
        marginTop : 12
    },
    inactiveButton : {
        flex : 1,
        borderWidth : 1, 
        borderRadius : 8, 
        borderColor : Colors.activeTeal, 
        backgroundColor : Colors.inactiveGrey,
        marginVertical : 4,
        marginTop : 12
    }
});

export default LoginVerifyEmailModal;