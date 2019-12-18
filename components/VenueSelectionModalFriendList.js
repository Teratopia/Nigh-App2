import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import FriendListRow from './FriendListRow';

const VenueSelectionModalFriendList = props => {
    return <View style={styles.friendListView}>
                <FlatList 
                    data={props.friendsToShowAtThisVenue} 
                    keyExtractor={(item, index) => 'key'+index}
                    renderItem={itemData => (
                        <FriendListRow user={itemData.item} activityName="BILLIARDS" onPress={() => {}}/> 
                    )}>
                </FlatList>
            </View>
}

const styles = StyleSheet.create({
    friendListView : {
        maxHeight : 42
    }
});

export default VenueSelectionModalFriendList;