import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../constants/colors';

const ModalHeader = props => {
    
    let leftIconButton = <View style={{padding:16}}></View>;
    if(props.leftIcon && props.leftIconFunction){
        let icon;
        if(props.leftIconLibrary === "AntDesign"){
            icon = <AntIcon name={props.leftIcon} size={16} color="white" />
        } else {
            icon = <Icon name={props.leftIcon} size={16} color="white" />
        }
        leftIconButton = 
        <TouchableOpacity onPress={props.leftIconFunction} style={styles.touchableStyle}>
            {icon}
        </TouchableOpacity>
    }
    let rightIconButton = <View style={{padding:16}}></View>;
    if(props.rightIcon && props.rightIconFunction){
        let icon;
        if(props.rightIconLibrary === "AntDesign"){
            icon = <AntIcon name={props.rightIcon} size={16} color="white" />
        } else {
            icon = <Icon name={props.rightIcon} size={16} color="white" />
        }
        rightIconButton = 
        <TouchableOpacity onPress={props.rightIconFunction} style={styles.touchableStyle}>
            {icon}
        </TouchableOpacity>
    }

    return (
        <View style={{...styles.container, ...props.style}}>
            {leftIconButton}
            <Text style={styles.text}>{props.title}</Text>
            {rightIconButton}
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height:50, 
        backgroundColor: Colors.inactiveGrey, 
        width:'100%', 
        marginBottom: 4, 
        paddingHorizontal: 12,
        alignItems: 'center', 
        justifyContent: 'space-between'
    },
    text: {
        color:'white', 
        fontSize:20
    },
    touchableStyle : {
        justifyContent : 'center',
        alignItems : 'center',
        padding:6, 
        borderRadius:8
    }
});

export default ModalHeader;