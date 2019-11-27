
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';    //
import Colors from '../constants/colors';   //

const FriendListRow = props => {

    const [isInit, setIsInit] = useState(false);
    const [isCasual, setIsCasual] = useState(false);
    const [isLeague, setIsLeague] = useState(false);
    const [isShowingLocation, setIsShowingLocation] = useState(false);
    const [isActive, setIsActive] = useState(false);

    if(!isInit){
        console.log('row user = ', props.user);
        props.user.statuses.forEach(status => {
            if(status.activityName === props.activityName){
                console.log('props user status billiards = ', status);
                setIsActive(status.active);
                setIsCasual(status.active && status.casual);
                setIsLeague(status.active && status.league);
                setIsShowingLocation(status.active && status.shareMyLocationWithFriends);
            }
        })
        setIsInit(true);
    }

    return (
        <TouchableOpacity style={styles.userRow} onPress={props.onPress}>
            <View style={styles.userRowName}>
                <Text style={styles.userRowNameText}>{props.user.username}</Text>
            </View>
            {
                    props.details ? 
                        <View style={styles.userRowTilesView}>
                            <Text style={{color: 'white'}}>{props.details}</Text>
                        </View>
                        :
                        <View style={styles.userRowTilesView}>
                
            {
                isCasual ? 
                <View style={{...styles.userRowTile}}>
                    <Icon name="flower" size={18} color="white" />
                </View>
                : null
            }
            {
                isLeague ? 
                <View style={{...styles.userRowTile}}>
                    <Icon name="trophy" size={18} color="white" />
                </View>
                : null
            }
            {
                isShowingLocation ? 
                <View style={{...styles.userRowTile}}>
                    <Icon name="location-pin" size={18} color="white" />
                </View>
                : null
            }
            {
                props.user.isBlocked ? 
                <View style={{...styles.userRowTile}}>
                    <Icon name="block" size={18} color="white" />
                </View>
                : null
            }
        </View>
                }
            
    </TouchableOpacity>
    );
    
};

const styles = StyleSheet.create({
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
    userRowTilesView : {
        flexDirection : 'row',
        justifyContent : 'flex-end',
        alignItems : 'center',
        width : '50%'
    },
    userRowTile : {
        padding : 4,
        marginHorizontal: 2,
        alignItems : 'center',
        justifyContent : 'center'
    }
});

export default FriendListRow;