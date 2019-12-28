import React, {useState} from 'react';
import {Text, View, TextInput, Button, Switch, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import WarningMesageModal from '../components/WarningMesageModal';  //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import MiscNetworking from '../networking/miscNetworking';
import { showMessage, hideMessage } from "react-native-flash-message";

//  TODO:
/*
    Add stranger danger warning
    Only allow active when at verified venue in

*/

const CasLeagueFeedbackScreen = props => {

  const [feedback, setFeedback] = useState();
  const [severity, setSeverity] = useState(0);
  const [type, setType] = useState('FEATURE');

  function sendFeedback(){
      if(feedback && feedback.length > 0){
          if(props.user){
            MiscNetworking.sendFeedback(props.user, feedback, type, severity, res => {
                console.log('sendFeedback res = ', res);
                if(res.success){
                    showMessage({
                        message: 'Feedback Sent!',
                        type: "default",
                        backgroundColor : Colors.activeTeal,
                        color : 'white'
                    });
                    setFeedback(null);
                    setSeverity(0);
                    setType('FEATURE');
                }
            }, err => {
                console.log('sendFeedback error = ', err);
            })
          } else if (props.venueUser){
            MiscNetworking.sendFeedback(props.venueUser, feedback, type, severity, res => {
                console.log('sendFeedback res = ', res);
                if(res.success){
                    showMessage({
                        message: 'Feedback Sent!',
                        type: "default",
                        backgroundColor : Colors.activeTeal,
                        color : 'white'
                    });
                    setFeedback(null);
                    setSeverity(0);
                    setType('FEATURE');
                }
            }, err => {
                console.log('sendFeedback error = ', err);
            })
          }
      }
  }

  return (
      <View style={styles.screen}>
          {
              props.user ? 
              <ModalHeader 
                title="FEEDBACK"
                leftIcon="menu" 
                leftIconFunction={props.toggleNavModal}
                rightIcon="cross"
                rightIconFunction={() => {props.setScreen('Settings')}}
                style={{marginBottom : 0}}
              />
              :
              <ModalHeader 
                title="FEEDBACK"
                //leftIcon="menu" 
                //leftIconFunction={props.toggleNavModal}
                rightIcon="cross"
                rightIconFunction={() => {props.setScreen('Settings')}}
                style={{marginBottom : 0}}
              />
          }

            <View style={{
                flexDirection : 'row',
                margin : 8
            }}>
                <View style={type === 'FEATURE' ? styles.activeButton : styles.inactiveButton}>
                    <Button
                        onPress={() => {setType('FEATURE')}}
                        title="Feature"
                        color="white"
                    />
                </View>
                <View style={type === 'ERROR' ? styles.errorButton : styles.inactiveButton}>
                    <Button
                        onPress={() => {setType('ERROR')}}
                        title="Error"
                        color="white"
                    />
                </View>
                <View style={type === 'OTHER' ? {...styles.activeButton, backgroundColor : Colors.pendingBlue} : styles.inactiveButton}>
                    <Button
                        onPress={() => {setType('OTHER')}}
                        title="Other"
                        color="white"
                    />
                </View>
            </View>

            {
                type === 'ERROR' ?
                <View>
                    <Text style={styles.subheader}>
                        Found a bug? Excellent! Please indicate the severity of the issue along with a description of the problem. To be extra helpful you can provide a list of steps to reproduce the error or suggest a potential solution. Your user feedback is invaluable in finding these issues, thank you again!
                    </Text>
                    <Text style={{
                        textAlign : 'center',
                        fontSize : 18,
                        fontWeight : '600',
                        color : Colors.quasiBlack,
                        marginTop : 8
                    }}>
                        Severity
                    </Text>
                    <View style={{
                                    flexDirection : 'row',
                                    marginTop : 8,
                                    marginHorizontal : 8
                                }}>
                    <View style={severity === 0 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(0)}}
                            title="0"
                            color="white"
                        />
                    </View>
                    <View style={severity === 1 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(1)}}
                            title="1"
                            color="white"
                        />
                    </View>
                    <View style={severity === 2 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(2)}}
                            title="2"
                            color="white"
                        />
                    </View>
                    <View style={severity === 3 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(3)}}
                            title="3"
                            color="white"
                        />
                    </View>
                    <View style={severity === 4 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(4)}}
                            title="4"
                            color="white"
                        />
                    </View>
                    <View style={severity === 5 ? styles.errorButton : styles.inactiveButton}>
                        <Button
                            onPress={() => {setSeverity(5)}}
                            title="5"
                            color="white"
                        />
                    </View>
                </View>
                </View>
                :
                type === 'FEATURE' ?
                <Text style={styles.subheader}>
                    Have a suggestion? Is something missing? Tell us what should be included!
                </Text>
                :
                <Text style={styles.subheader}>
                    Comments? Critiques? Requests for a new venue? Let us know what's on your mind!
                </Text>
            }
            <View style={{
                width : '100%',
                flex : 1
            }}>
                <TextInput
                    placeholder="Let us know what's on your mind!"
                    placeholderTextColor={Colors.inactiveGrey}
                    onChangeText={e => {setFeedback(e)}}
                    value={feedback}
                    //returnKeyType="send"
                    multiline={true}
                    clearButtonMode="always"
                    style={{
                        flex : 1,
                        padding : 8,
                        paddingTop : 8,
                        margin : 12,
                        borderColor : Colors.inactiveGrey,
                        borderWidth : 1,
                        borderRadius : 8,
                        color : Colors.quasiBlack
                    }}
                />
                <View style={
                    feedback && feedback.length > 0 ? 
                        {...styles.activeButton, flex : 0, marginHorizontal : 12, marginBottom : 16} 
                        : 
                        {...styles.inactiveButton, flex : 0, marginHorizontal : 12, marginBottom : 16}}>
                    <Button
                        onPress={sendFeedback}
                        title="Submit"
                        color="white"
                        disabled={!feedback || feedback.length === 0}
                    />
                </View>
            </View>
            

      </View>
  );
}

const styles = StyleSheet.create({
  screen : {
    flex:1,
    alignItems: 'center',
    marginTop: getStatusBarHeight(),
    //paddingBottom: 12
  },
  activeButton : {
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    borderRadius : 8,
    margin : 4,
    flex : 1,
    backgroundColor : Colors.activeTeal
},
inactiveButton : {
    borderWidth : 1,
    borderColor : Colors.activeTeal,
    borderRadius : 8,
    margin : 4,
    flex : 1,
    backgroundColor : Colors.inactiveGrey
},
errorButton : {
    borderWidth : 1,
    borderColor : Colors.inactiveGrey,
    borderRadius : 8,
    margin : 4,
    flex : 1,
    backgroundColor : Colors.dangerRed
},
subheader : {
    fontSize : 16,
    fontWeight : '500',
    marginHorizontal : 24,
    color : Colors.inactiveGrey,
    textAlign : 'center'
}

});

export default CasLeagueFeedbackScreen;