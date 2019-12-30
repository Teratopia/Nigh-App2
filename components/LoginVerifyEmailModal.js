import React, {useState} from 'react';
import {View, StyleSheet, Text, Modal, TextInput, Button, TouchableOpacity} from 'react-native';
import Colors from '../constants/colors';
import UserNetworking from '../networking/userNetworking';

const LoginVerifyEmailModal = props => {

    const [email, setEmail] = useState(props.email || '');
    const [whyPressed, setWhyPressed] = useState(false);
    const [code, setCode] = useState(props.code);
    const [codeInput, setCodeInput] = useState();

    function sendEmailHandler(){
        UserNetworking.requestEmailVerification(email, resCode => {
            console.log('requestEmailVerification resCode = ', resCode);
            setCode(resCode.code);
        });
    }

    function submitCodeHandler(){
        console.log('codeInput === code');
        if(codeInput === code){
            console.log('props.pnToken = ', props.pnToken);
            if(props.code && props.pnToken){
                UserNetworking.addPnToken(props.userId, props.pnToken, res => {
                    console.log('submitCodeHandler addPnToken res = ', res);
                    if(res.user){
                        props.setUser(res.user);
                    }
                })
            } else {
                UserNetworking.updateUserEmail(props.userId, email, res => {
                    console.log('submitCodeHandler updateUserEmail res = ', res);
                    if(res.user){
                        props.setUser(res.user);
                    }
                })
            }            
        }
        /*
        UserNetworking.requestEmailVerification(email, resCode => {
            console.log('requestEmailVerification resCode = ', resCode);
            setCode(resCode.code);
        });
        */
    }

    return (

        <Modal visible={true}>
            <View style={styles.shadowBox}>
                {
                code && code.length > 0 ? 
                <View style={styles.modalView}>
                    
                    <Text style={{
                        fontSize : 24,
                        fontWeight : '700',
                        color : Colors.quasiBlack
                    }}>Verify {props.email ? 'New Device' : 'Email'}</Text>
                    
                    {props.email ? 
                        <View style={{marginTop : 12}}>
                            <Text style={{
                                fontSize : 16,
                                //fontWeight : '700',
                                color : Colors.inactiveGrey,
                                textAlign : 'center'
                            }}>A verification code has been sent to {props.email}</Text>
                        </View>
                    :
                        null
                    }

                        <View style={{marginTop : 12}}>
                            <Text style={{
                                fontSize : 16,
                                //fontWeight : '700',
                                color : Colors.inactiveGrey
                            }}>Your Verification Code</Text>
                        </View>
                    
                    <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                        <TextInput
                            key="codeTextInput"
                            onSubmitEditing={e => {setCodeInput(e.nativeEvent.text)}}
                            defaultValue=""
                            textContentType='oneTimeCode'
                            maxLength={6}
                            keyboardType="number-pad"
                            //value={codeInput}
                            //keyboardAppearance="dark"
                            style={{
                                //margin : 24,
                                padding : 8, 
                                borderWidth : 1,
                                borderColor : Colors.inactiveGrey,
                                borderRadius : 8,
                                flex : 1,
                                textAlign : 'center'
                            }}
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity onPress={() => {setWhyPressed(previous => !previous)}}>
                        <Text style={{
                            fontSize : 16,
                            //fontWeight : '700',
                            color : Colors.inactiveGrey
                        }}>Why?</Text>
                    </TouchableOpacity>

                        {
                            whyPressed ? 
                                <View style={{marginTop : 4}}>
                                    <Text style={{
                                        fontSize : 18,
                                        //fontWeight : '700',
                                        color : Colors.quasiBlack,
                                        textAlign : 'center'
                                    }}>Nigh uses multiple Two Factor Authentication techniques to keep your account secure! One method is email confirmation, which ensures unique accounts, enables password resets, and allows you to seamlessly use Nigh on many trusted devices.</Text>
                                
                                    <Text style={{
                                        fontSize : 18,
                                        //fontWeight : '700',
                                        color : Colors.quasiBlack,
                                        textAlign : 'center',
                                        marginTop : 12
                                    }}>
                                    We promise not to use your email for promotions, our marketing department is too lazy and there's already enough spam out there.
                                    </Text>
                                </View>
                            :
                                null
                        }
                    

                    <View style={{flexDirection : 'row'}}>
                        <View style={styles.activeButton}
                        //style={email && email.length > 0 ? styles.activeButton : styles.inactiveButton}
                        >
                            <Button 
                                title="CONFIRM" 
                                color="white" 
                                //disabled={!(email && email.length > 0)}
                                onPress={submitCodeHandler} />
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
                :
                <View style={styles.modalView}>
                    
                    <Text style={{
                        fontSize : 24,
                        fontWeight : '700',
                        color : Colors.quasiBlack
                    }}>Verify Email</Text>
                    
                    <View style={{marginTop : 12}}>
                        <Text style={{
                            fontSize : 16,
                            //fontWeight : '700',
                            color : Colors.inactiveGrey
                        }}>Your Email Address</Text>
                    </View>
                    
                    <View style={{flexDirection : 'row', marginVertical : 12, marginTop : 4}}>
                        <TextInput
                            key="emailTextInput"
                            onSubmitEditing={e => {setEmail(e.nativeEvent.text)}}
                            textContentType='emailAddress'
                            style={{
                                //margin : 24,
                                padding : 8, 
                                borderWidth : 1,
                                borderColor : Colors.inactiveGrey,
                                borderRadius : 8,
                                flex : 1,
                                textAlign : 'center'
                            }}
                            //value={email}
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity onPress={() => {setWhyPressed(previous => !previous)}}>
                        <Text style={{
                            fontSize : 16,
                            //fontWeight : '700',
                            color : Colors.inactiveGrey
                        }}>Why?</Text>
                    </TouchableOpacity>

                        {
                            whyPressed ? 
                                <View style={{marginTop : 4}}>
                                    <Text style={{
                                        fontSize : 18,
                                        //fontWeight : '700',
                                        color : Colors.quasiBlack,
                                        textAlign : 'center'
                                    }}>Nigh uses multiple Two Factor Authentication techniques to keep your account secure! One method is email confirmation, which ensures unique accounts, enables password resets, and allows you to seamlessly use Nigh on many trusted devices.</Text>
                                
                                    <Text style={{
                                        fontSize : 18,
                                        //fontWeight : '700',
                                        color : Colors.quasiBlack,
                                        textAlign : 'center',
                                        marginTop : 12
                                    }}>
                                    We promise not to use your email for promotions, our marketing department is too lazy and there's already enough spam out there.
                                    </Text>
                                </View>
                            :
                                null
                        }
                    

                    <View style={{flexDirection : 'row'}}>
                        <View style={email && email.length > 0 ? styles.activeButton : styles.inactiveButton}>
                            <Button 
                                title="SEND" 
                                color="white" 
                                disabled={!(email && email.length > 0)}
                                onPress={sendEmailHandler} />
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
                }
                
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