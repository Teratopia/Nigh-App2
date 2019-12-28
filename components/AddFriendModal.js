import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList, Modal, TextInput, Button} from 'react-native';
import Colors from '../constants/colors';   //
import UNW from '../networking/userNetworking';     //
import UserMapHelper from '../helpers/userMapHelper';   //


const AddFriendModal = props => {
    const [resultsList, setResultsList] = useState();
    const [userSelected, setUserSelected] = useState();
    const [message, setMessage] = useState();
    const [isInit, setIsInit] = useState(false);

    const searchUser = e => {
        console.log('searchUser e = ', e);
        //setUserSelected(null);
        UNW.searchUserByUsername(e, docs => {
            console.log('searchUser props.user = ', props.user);
            console.log('searchUser docs = ', docs);
            docs.users.forEach((doc, index, object) => {
                if(doc._id === props.user._id){
                    object.splice(index, 1);
                }
                if(doc.isActive){
                    doc.distAway = UserMapHelper.getDist(doc, props.user.location.coordinates[1], props.user.location.coordinates[0], true) + ' Away';
                } else {
                    doc.distAway = 'Currently Inactive';
                }
            });
            setResultsList(docs.users);
        }, err => {
            console.log('searchUser err = ', err);
        });
    }

    const selectUser = id => {
        console.log('selectUser id = '+id);
        setUserSelected(id);
        var resClone = [...resultsList];
        setResultsList(resClone);
    }

    const sendRequest = () => {
        console.log('sendRequest');
        UNW.sendFriendRequest(props.user._id, userSelected, message, res => {
            console.log('sendRequest success, res = ', res);
            props.onClose();
        }, err => {
            console.log('sendRequest error = ', err);
        });
    }

    const editMessage = e => {
        console.log('editMessage e = '+e);
        setMessage(e);
    }

    const closeModal = () => {
        props.onClose();
    }

    if(!isInit && props.initUserSelected){
        searchUser(props.initUserSelected.username);
        setUserSelected(props.initUserSelected._id);
        //selectUser(props.initUserSelected._id);
        setIsInit(true);
    }

    return (
        
            <Modal visible={true} transparent={true}>
                <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={closeModal}>
                    <TouchableOpacity style={styles.modalView} onPress={() => {}} activeOpacity={1}>
                        <View style={styles.titleHeader}>
                            <Text style={styles.titleText}>
                                Friend Request
                            </Text>
                        </View>
                        {
                            !props.initUserSelected ?
                            <TextInput 
                                onChangeText={e => {searchUser(e)}} style={{width : '100%', textAlign : 'center'}}
                                placeholder="Search User"
                                placeholderTextColor={Colors.inactiveGrey}
                                style={styles.searchUserTextInput}
                            />
                            :
                            null
                        }
                        { resultsList && resultsList.length > 0 ? 
                            <View style={styles.resultListView}>
                                <FlatList 
                                //style={{height:'100%'}}
                                data={resultsList} 
                                keyExtractor={(item, index) => 'key'+index}
                                renderItem={itemData => (
                                    <TouchableOpacity onPress={() => {selectUser(itemData.item._id)}}>
                                        <View style={userSelected == itemData.item._id ? styles.userRowSelected : styles.userRow}>
                                            <View style={styles.userRowName}>
                                                <Text style={styles.userRowNameText}>{itemData.item.username}</Text>
                                            </View>
                                            <View style={styles.userRowDetailsView}>
                                                <Text style={styles.userRowDetailsViewText}>{itemData.item.distAway}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}>
                                </FlatList>
                            </View>
                        : null    
                    }
                    {userSelected ? 
                    <View style={{width : '100%'}}>
                        <TextInput onChangeText={e => {editMessage(e)}}
                        placeholder="Send a Message!" 
                        placeholderTextColor={Colors.inactiveGrey}
                        multiline={true}
                        numberOfLines={4}
                        maxLength={144}
                        style={{
                            width : '100%', 
                            borderColor : Colors.inactiveGrey, 
                            borderRadius : 4, 
                            borderWidth : 1, 
                            minHeight : 96, 
                            marginVertical : 8, 
                            paddingTop : 12,
                            paddingHorizontal : 12,
                            color : Colors.quasiBlack
                        }}/>
                    </View>
                
                    : null
                    }
                        
                    {
                        userSelected ? 
                        <View style={{...styles.buttonView, backgroundColor : Colors.activeTeal, borderColor : Colors.inactiveGrey}}>
                            <Button title="Send Request" color="white" onPress={sendRequest} />
                        </View>
                        :
                        <View style={{...styles.buttonView, backgroundColor : Colors.inactiveGrey, borderColor : Colors.activeTeal}}>
                            <Button title="Send Request" color="white" onPress={sendRequest} disabled={true}/>
                        </View>
                    }
                        <View style={styles.buttonView}>
                            <Button title="Close" color="white" onPress={closeModal} />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        
    );
}

const styles = StyleSheet.create({
    TouchableOpacityStyle : {
        height : '100%',
        width : '100%',
        paddingVertical : 124,
        backgroundColor : 'black'
    },
    modalView: {
        //height : '100%',
        //width: '100%',
        //flex : 1,
        justifyContent : 'center',
        margin: 48,
        //marginVertical : '20%',
        alignItems : 'center',
        borderColor : Colors.inactiveGrey,
        borderWidth : 1,
        borderRadius : 16,
        padding : 24,
        backgroundColor : 'white',
        opacity : 1
    },
    titleHeader : {
        fontSize : 18,
        fontWeight : '600',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop: 8,
        marginBottom : 4
    },
/*
    searchUserTextInput : {
        justifyContent : 'center',
        alignItems : 'center',
        marginVertical : 4,
        alignItems : 'center',
        width : '80%',
        borderColor : Colors.inactiveGrey,
        borderWidth : 1,
        borderRadius : 4,
        padding : 12
    },
    */
    resultListView : {
        width: '100%', 
        //height : 500,
        borderColor : Colors.inactiveGrey, 
        borderWidth : 1,
        marginVertical : 8,
        maxHeight : '33%'
        //flex : 1
    },
    userRow : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding : 4,
        paddingHorizontal : 16,
        backgroundColor : Colors.quasiBlack,
        borderBottomColor : 'black',
        borderBottomWidth : 1
    },
    userRowSelected : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        padding : 4,
        paddingHorizontal : 16,
        backgroundColor : Colors.activeTeal,
        borderBottomColor : 'black',
        borderBottomWidth : 1
    },
    userRowName : {
        justifyContent : 'center',
        alignItems : 'center'
    },
    userRowNameText : {
        fontSize : 18,
        fontWeight : '700',
        color : 'white',
        textAlign : 'center'
    },
    userRowDetailsView : {
        justifyContent : 'center',
        alignItems : 'center',
    },
    userRowDetailsViewText : {
        justifyContent : 'center',
        alignItems : 'center',
        color : 'white',
    },
    buttonView : {
        borderWidth : 1,
        borderColor : Colors.activeTeal,
        borderRadius : 8,
        backgroundColor : Colors.inactiveGrey,
        marginTop : 8,
        width : '100%'
    },
    searchUserTextInput : {
        padding : 8,
        textAlign : 'center',
        width : '100%',
        borderWidth : 1,
        borderColor : Colors.inactiveGrey,
        borderRadius : 8,
        backgroundColor : 'white',
        color : Colors.quasiBlack
    },
    titleText : {
        fontWeight : '700',
        fontSize : 18,
        color : Colors.quasiBlack
    }
});

export default AddFriendModal;