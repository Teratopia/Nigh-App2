import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Button, TextInput, ScrollView, TouchableOpacity, Modal, Picker} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';   //
import UNW from '../networking/userNetworking';     //
import ImagePicker from 'react-native-image-picker';    //
import ModalHeader from '../components/ModalHeader';    //

const fs = require('react-native-fs');  //


//import GuessGameHeader from './components/GuessGameHeader';

const UserProfileScreen = props =>{

    const [userFormObj, setUserFormObj] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [profilePictureLoading, setProfilePictureLoading] = useState(false);
    const [genderSelection, setGenderSelection] = useState(props.user.gender ? props.user.gender : 'na');
    const [sexualitySelection, setSexualitySelection] = useState(props.user.sexuality ? props.user.sexuality : 'N/A');
    const [relationshipStatusSelection, setRelationshipStatusSelection] = useState(props.user.relationshipStatus ? props.user.relationshipStatus : 'na');
    const [changingSexuality, setChangingSexuality] = useState(false);
    const sexualityList = [
        'N/A', 'Heterosexual', 'Homosexual', 'Bisexual', 'Transsexual', 'Pansexual', 'Queer/Questioning', 'Intersexual'
    ];
    
    let birthdate;
    if(props.user.birthdate && !birthdate){
        birthdate = new Date(props.user.birthdate);
    }
    
    const resetProfilePic = () => {
        var path = fs.CachesDirectoryPath+'/'+props.user._id+'profilePicture.jpeg';
        fs.exists(path).then( exists => {
            if(exists){
                setProfilePic({uri : path});
            } else {
                setProfilePic(require('../images/defaultProfilePic1.jpeg'));
            }
          });
    }

    if(!profilePic){
        resetProfilePic();
    }

    const pressProfile = () => {
        //setShowSetProfileModal(true);
        const options = {
            noData: true,
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
              setProfilePictureLoading(true);
              UNW.updateUserProfilePic(response, props.user._id, uuppRes => {
                var path = fs.CachesDirectoryPath+'/'+props.user._id+'profilePicture.jpeg';
                fs.downloadFile({fromUrl:response.uri, toFile:path})
                .promise.then(res => {
                    console.log('download file res = ', res);
                    resetProfilePic();
                    setProfilePictureLoading(false);
                });
            }, error => {
                console.log('error = ', error);
                setProfilePictureLoading(false);
            });
            }
          })
    }

    function pressGender(selection){
        setGenderSelection(selection);
        console.log('pressGender selection = '+selection);
    }

    function setSexuality(e){
        console.log('setSexuality e = ', e);
    }

    foo = (field, value) => {
    }

    updateUserFormObj = (field, value) => {
        console.log('updateUserFormObj field = '+field+', value = ', value);
        var clone = {...userFormObj};
        clone[field] = value;
        setUserFormObj(clone);
    }

    saveHandler = () => {
        var clone = {...userFormObj};
        clone.gender = genderSelection;
        clone.relationshipStatus = relationshipStatusSelection;
        sexualitySelection === 'N/A' ? clone.sexuality = 'na' : clone.sexuality = sexualitySelection.toLowerCase();
        if(clone.birthYear && clone.birthMonth && clone.birthDay){
            var birthdate = new Date(clone.birthYear, clone.birthMonth, clone.birthDay);
            console.log('birthdate = ', birthdate);
            clone.birthdate = birthdate;
        }
        clone.userId = props.user._id;
        UNW.updateUserProfileInformation(clone, res => {
            console.log('saveHandler res = ', res);
            if(res.user){
                props.setUser(res.user);
            }
        }, err => {
            console.log('saveHandler err = ', err);
            //TODO - HANDLE ERROR
        });
        console.log('saveHandler clone = ', clone);
    }


    cancelHandler = () => {
        props.setScreen('SEARCH');
    }

    let changeProfilePictureView =  <View style={{alignItems : 'center', justifyContent : 'center', alignItems : 'center', width : '100%', flex : 1}}>
                                        <TouchableOpacity onPress={pressProfile} style={{width : '100%', justifyContent : 'center', alignItems : 'center'}}>
                                            <Image style={{height : 62, width : 62, borderRadius : 31, borderColor: Colors.activeTeal, marginVertical: 4, borderWidth : 2}}
                                            source={profilePic}
                                            />
                                            <Text style={{fontSize : 10, color : 'grey'}}>Change Profile Picture</Text>
                                        </TouchableOpacity>
                                    </View>
    if(profilePictureLoading){
        changeProfilePictureView =  <View style={{alignItems : 'center', justifyContent : 'center', alignItems : 'center', width : '100%', flex : 1}}>
                                            <Image style={{height : 62, width : 62, borderRadius : 31, borderColor: Colors.activeTeal, marginVertical: 4, borderWidth : 2}}
                                            source={profilePic}
                                            />
                                            <Text style={{fontSize : 10, color : 'grey'}}>Loading Profile Picture...</Text>
                                    </View>
    }

    let datingBlock = (
    <View>
    <View style={styles.inputFormItem}>
        <View style={styles.inputFormSubtitle}>
            <Text style={styles.subtitleText}>Gender</Text>
        </View>
        <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity onPress={() => {pressGender('na')}} style={genderSelection === 'na' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>N/A</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {pressGender('male')}} style={genderSelection === 'male' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {pressGender('female')}} style={genderSelection === 'female' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {pressGender('other')}} style={genderSelection === 'other' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Other</Text>
            </TouchableOpacity>
        </View>
        {genderSelection === 'other' ? 
        <View style={styles.inputFormItem}>
            <View style={styles.inputFormSubtitle}>
                <Text style={styles.subtitleText}>Cool! Care to specify?</Text>
            </View>
            <TextInput style={{...styles.textInputStyle}}
            defaultValue={props.user.otherGender}
            placeholder="Non-Binary" 
            onSubmitEditing={e => updateUserFormObj('otherGender', e.nativeEvent.text)}
            />
        </View>
        : null}
    </View>
    
    <View style={styles.inputFormItem}>
        <View style={styles.inputFormSubtitle}>
            <Text style={styles.subtitleText}>Sexuality</Text>
        </View>
        <TouchableOpacity onPress={() => {setChangingSexuality(true)}} style={{...styles.activeGenderButton, width:'100%'}}>
            <Text style={{...styles.genderButtons, width : '100%'}}>{sexualitySelection}</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.inputFormItem}>
        <View style={styles.inputFormSubtitle}>
            <Text style={styles.subtitleText}>Relationship Status</Text>
        </View>
        <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity onPress={() => {setRelationshipStatusSelection('na')}} style={relationshipStatusSelection === 'na' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>N/A</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setRelationshipStatusSelection('single')}} style={relationshipStatusSelection === 'single' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Single</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setRelationshipStatusSelection('taken')}} style={relationshipStatusSelection === 'taken' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Taken</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setRelationshipStatusSelection('other')}} style={relationshipStatusSelection === 'other' ? styles.activeGenderButton : styles.inactiveGenderButton}>
                <Text style={styles.genderButtons}>Other</Text>
            </TouchableOpacity>
        </View>

    </View>
    </View>
);
    
    return  <View style={{flex : 1, marginTop : getStatusBarHeight()}}>
                <ModalHeader title="PROFILE" 
                        leftIcon="menu" 
                        leftIconFunction={props.leftIconFunction}
                        />
    
                <View style={styles.topView}>

                        {changeProfilePictureView}
                        <View style={{flex : 6}}>
                        <ScrollView >
                        <View style={{...styles.inputFormItem, justifyContent : 'center'}}>
                                <View style={styles.inputFormSubtitle}>
                                    <Text style={styles.subtitleText}>Birthday</Text>
                                </View>
                                <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
                                    <TextInput style={{...styles.textInputStyle, width : '30%', alignItems : 'center', justifyContent : 'center', textAlign:'center'}}
                                    placeholder="Day" 
                                    keyboardType='numeric'
                                    maxLength={2}
                                    defaultValue={birthdate ? ''+birthdate.getDate() : null}
                                    onSubmitEditing={e => {updateUserFormObj('birthDay', e.nativeEvent.text)}}
                                    />
                                    <TextInput style={{...styles.textInputStyle, width : '30%', alignItems : 'center', justifyContent : 'center', textAlign:'center'}}
                                    placeholder="Month" 
                                    keyboardType='numeric'
                                    maxLength={2}
                                    defaultValue={birthdate ? ''+(birthdate.getMonth() + 1) : null}
                                    onSubmitEditing={e => {updateUserFormObj('birthMonth', e.nativeEvent.text)}}
                                    />
                                    <TextInput style={{...styles.textInputStyle, alignItems : 'center', justifyContent : 'center', width : '30%', textAlign:'center'}}
                                    placeholder="Year" 
                                    keyboardType='numeric'
                                    maxLength={4}
                                    defaultValue={birthdate ? ''+birthdate.getFullYear() : null}
                                    onSubmitEditing={e => {updateUserFormObj('birthYear', e.nativeEvent.text)}}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputFormItem}>
                                <View style={styles.inputFormSubtitle}>
                                    <Text style={styles.subtitleText}>Occupation</Text>
                                </View>
                                <TextInput style={{...styles.textInputStyle}}
                                defaultValue={props.user.occupation}
                                placeholder="Underwater Basket Weaver" 
                                onSubmitEditing={e => {updateUserFormObj('occupation', e.nativeEvent.text)}}
                                />
                            </View>
                            
                            <View style={styles.inputFormItem}>
                                <View style={styles.inputFormSubtitle}>
                                    <Text style={styles.subtitleText}>Email</Text>
                                </View>
                                <TextInput style={{...styles.textInputStyle}}
                                defaultValue={props.user.email}
                                placeholder="Your@Email.here" 
                                textContentType="emailAddress"
                                onSubmitEditing={e => {updateUserFormObj('email', e.nativeEvent.text)}}
                                />
                            </View>

                            <View style={{...styles.inputFormItem, flex : 2}}>
                                <View style={styles.inputFormSubtitle}>
                                    <Text style={styles.subtitleText}>Profile Description</Text>
                                </View>
                                <TextInput style={{...styles.textInputStyle}}
                                defaultValue={props.user.profileDescription}
                                placeholder="Tell folks about yourself!" 
                                onBlur={e => updateUserFormObj('profileDescription', e.nativeEvent.text)}
                                maxLength={144}
                                multiline={true}
                                />
                            </View>

                            <View style={styles.inputFormItem}>
                                <View style={styles.inputFormSubtitle}>
                                    <Text style={styles.subtitleText}>Spirit Animal</Text>
                                </View>
                                <TextInput style={{...styles.textInputStyle}}
                                defaultValue={props.user.spiritAnimal}
                                placeholder="Three-Toed Sloth" 
                                onSubmitEditing={e => updateUserFormObj('spiritAnimal', e.nativeEvent.text)}
                                />
                            </View>

                            
                            {
                            //datingBlock, may need to remove top View tags
                        }


                        </ScrollView>
                        </View>
                        <View style={styles.buttonRow}>
                            <View style={styles.saveButtonView}>
                                <Button onPress={saveHandler} title="Save" color="white"/>
                            </View>
                            <View style={styles.cancelButtonView}>
                                <Button onPress={cancelHandler} title="Cancel" color="white"/>
                            </View>
                        </View>
                </View>

    {changingSexuality ? 
        <Modal 
        transparent={false}
        visible={true}>
            <View style={{width : '100%', height: '100%', justifyContent : 'center', alignItems : 'center'}}>
                <Picker
                    style={{height: 200, width: '62%'}}
                    mode="dropdown"
                    selectedValue={sexualitySelection}
                    onValueChange={setSexualitySelection}>
                    {sexualityList.map((item) => {
                        return (<Picker.Item label={item} value={item} key={item}/>) 
                    })}
                </Picker>   
                <Button title="SET" onPress={() => {setChangingSexuality(false)}}/>
            </View>
        </Modal>
    : null}

            </View>    
}


const styles = StyleSheet.create({
    topView : {
        //height : '100%',
        //width : '100%',
        //alignItems : 'center',
        justifyContent : 'center',
        marginHorizontal : 24,
        //marginBottom : 18,
        flex : 1
    },
    imageStyle : {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginBottom: 6, 
        borderWidth: 1, 
        borderColor: Colors.activeTeal
    },
    buttonRow : {
        flex : 1,
        flexDirection : 'row',
        width : '100%',
        alignItems : 'center',
        justifyContent : 'space-evenly',
        //backgroundColor : 'yellow'
    },
    saveButtonView : {
        borderWidth : 1,
        borderColor : Colors.inactiveGrey,
        backgroundColor : Colors.activeTeal,
        borderRadius : 4,
        width : '33%'
    },
    cancelButtonView : {
        borderWidth : 1,
        borderColor : Colors.activeTeal,
        backgroundColor : Colors.inactiveGrey,
        borderRadius : 4,
        width : '33%'
    },
    inputForm : {
        flex : 1,
        margin : 12,
        width : '100%',
        justifyContent : 'flex-start',
    },
    inputFormItem : {
        flex : 1, 
        width : '100%',
        marginVertical : 2
    },
    inputFormSubtitle : {
        flexDirection : 'row',
    },
    subtitleText : {
        borderBottomColor : 'grey',
        borderBottomWidth : 1,
        marginLeft : 6
    },
    textInputStyle : {
        //margin : 12,
        padding : 8,
        borderWidth : 1,
        borderColor : 'grey',
        borderRadius : 4,
        //height : '100%'
    },
    inactiveGenderButton : {
        width : '22%', 
        fontSize : 16, 
        alignItems : 'center',
        justifyContent : 'center',
        textAlign : 'center',
        borderWidth : 1, 
        borderRadius : 4,
        padding : 4,
        borderColor : Colors.activeTeal,
        backgroundColor : Colors.inactiveGrey
    },
    activeGenderButton : {
        width : '22%', 
        fontSize : 16, 
        alignItems : 'center',
        justifyContent : 'center',
        textAlign : 'center',
        borderWidth : 1, 
        borderRadius : 4,
        padding : 4,
        borderColor : Colors.inactiveGrey,
        backgroundColor : Colors.activeTeal,
        
    },
    genderButtons : {
        fontSize : 16, 
        textAlign : 'center',
        color:"white" 
    }
});

export default UserProfileScreen;



//CameraRoll.getPhotos(params);