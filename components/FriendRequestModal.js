import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, FlatList, Modal, TextInput, Button} from 'react-native';
import Colors from '../constants/colors';
import UNW from '../networking/userNetworking';
import moment from 'moment';
//getDist(user, phoneLat, phoneLong)


const FriendRequestModal = props => {
    const [resultsList, setResultsList] = useState();
    

    const acceptRequest = () => {
        UNW.acceptFriendRequest(props.user._id, props.friendRequest.requester._id, result => {
            console.log('acceptRequest res = ', result);
            props.onClose();
        }, err => {
            console.log('acceptRequest err = ', err);
        })
    }

    closeModal = () => {
        props.onClose();
    }

    return (
        
            <Modal visible={true} transparent={true}>
                <TouchableOpacity style={styles.TouchableOpacityStyle} onPress={closeModal}>
                    <TouchableOpacity style={styles.modalView} onPress={() => {}} activeOpacity={1}>
                            <View style={styles.titleHeaderDetail}>
                            <Text style={styles.titleHeaderDetailText}>
                                Friend Request From
                            </Text>
                            </View>
                            <View style={styles.titleHeader}>
                                <Text style={styles.titleHeaderText}>
                                    {props.friendRequest.requester.username}
                                </Text>
                            </View>
                            <View style={styles.titleHeaderDetail}>
                                <Text style={styles.titleHeaderDetailText}>
                                    {moment(props.friendRequest.createDate).calendar()}
                                </Text>
                            </View>
                            {
                                props.friendRequest.message ? 
                                <View style={styles.messageView}>
                                    <Text style={styles.messageText}>
                                        {props.friendRequest.message}
                                    </Text>
                                </View>
                                : null
                            }
                        <View style={{...styles.buttonView, backgroundColor : Colors.activeTeal, borderColor : Colors.inactiveGrey}}>
                            <Button title="Accept Request" color="white" onPress={acceptRequest} />
                        </View>
                        <View style={styles.buttonView}>
                            <Button title="Ignore Request" color="white" onPress={closeModal} />
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
        flex : 1,
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
        justifyContent : 'center',
        alignItems : 'center',
        marginTop: 8,
        marginBottom : 4
    },
    titleHeaderText : {
        fontSize : 18,
        fontWeight : '600',
    },
    titleHeaderDetail : {
        justifyContent : 'center',
        alignItems : 'center',
        marginTop: 8,
        marginBottom : 4
    },
    titleHeaderDetailText : {
        fontSize : 14,
        fontWeight : '600',
    },
    messageView : {
        margin : 8,
        borderTopWidth : 1,
        borderBottomWidth : 1,
        borderColor : Colors.inactiveGrey,
        paddingVertical : 12
    },
    messageViewText : {
        fontSize : 12,
        //color : Colors.inactiveGrey
    },
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
    resultListView : {
        width: '100%', 
        //height : 500,
        borderColor : Colors.inactiveGrey, 
        borderWidth : 1,
        marginVertical : 8,
        maxHeight : 112
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
        width : '80%'
    }
});

export default FriendRequestModal;