import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, Button, SafeAreaView, ScrollView } from 'react-native';
import ModalHeader from '../components/ModalHeader';    //
import { getStatusBarHeight } from 'react-native-status-bar-height';    //
import Colors from '../constants/colors';



const AboutScreen = props => {


    return (
        <SafeAreaView style={styles.screen}>
            <ModalHeader 
                title="ABOUT"
                leftIcon="menu" 
                leftIconFunction={props.toggleNavModal}
                rightIcon="cross"
                rightIconFunction={() => {props.setScreen('SEARCH')}}
                style={{marginBottom : 12}}
              />
              <ScrollView style={styles.scrollView}>
                <Text style={styles.header}>
                    What is Nigh?
                </Text>
                <Text style={styles.textBody}>
                    Nigh is an iOS app for pool players and venues to connect and participate in ongoing leagues!
                </Text>

                <Text style={styles.header}>
                    How Do Venue Leagues Work?
                </Text>
                <Text style={styles.textBody}>
                    Venues have the option to add leagues to their profiles. Each league has either a weekly, fortnightly, or monthly timeframe. During these time periods you have the chance to play against other Nigh users checked into the venue. The more games you win and unique players you beat, the higher your ranking for that venue's league. Challenge any user at any time--no scheduled meet ups or teams required. At the end of the league timeframe whoever achieved the highest ranks will be awarded prizes determined by the venue! 
                </Text>

                <Text style={styles.header}>
                    How Does Ranking Work?
                </Text>
                <Text style={{...styles.textBody, marginBottom : 4}}>
                    Nigh's scoring algorithm favors wins against unique players over total games won, and determines wins against unique players using 'races'. A race is a set of games between two unique players. 
                </Text>
                <Text style={{...styles.textBody, marginBottom : 4}}>
                    For example, if Natalie beats Seydou seven times and Seydou beats Natalie three times, Natalie has won that race. However, if Seydou challenges two more people and wins both those races he will achieve a higher ranking, beating Natalie two races to one (even though Natalie beat him and may even have more total wins). In cases where the number of races won is a tie, total games won is used to determine a winner. In cases where total games won is also equal, win/loss rate is used to break the tie.
                </Text>
                <Text style={styles.textBody}>
                    In a nutshell, the best strategy is to play everyone you can, as many times as you can, winning as often as you can.
                </Text>

                <Text style={styles.header}>
                    How Can I Challenge a Player?
                </Text>
                <Text style={styles.textBody}>
                    To challenge a player a few criteria must be met: First, the player must be included in your friends list. Second, you both have to be active/checked into the same venue. Finally, one player has to initiate a challenge by pressing 'Challenge' on that friend's interaction window via the 'Friends' screen. The player will have ten minutes to accept or deny your challenge, which will end when both participants confirm the result of the match.
                </Text>

                <Text style={styles.header}>
                    How Can I Add a Player To My Friends List?
                </Text>
                <Text style={{...styles.textBody, marginBottom : 4}}>
                    There are three ways to add a player to your friends list. First, if you know the username of the friend you want to add, you can search for them via the add friend button at the top right of the 'Friends' screen. Send them a request with a comment, and when they accept they will be on your friends list!
                </Text>
                <Text style={{...styles.textBody, marginBottom : 4}}>
                    Similarly, if someone has sent you a friend request they will appears in the 'Requests' section of your 'Friends' screen. Select the user, accept, and they will be included in your friends.</Text>
                <Text style={{...styles.textBody, marginBottom : 4}}>
                    Finally, venue league tables display users and their rankings. Your row is highlighted in teal, your friends highlighted in blue, and other players not highlighted at all. Pressing a non-friend's row on a venue's league table automatically opens a friend request window for that user, so you can coordinate with and challenge anyone standing between you and that first place prize!
                </Text>
                <Text style={styles.textBody}>
                    P.S. Selecting your friend's row on a venue league table opens their interaction window, so you can give them props or plan a match.
                </Text>

                <Text style={styles.header}>
                    Why Can't I Find a Venue?
                </Text>
                <Text style={styles.textBody}>
                    Nigh is still in alpha testing, so only a few venues are currently being used. However, when we switch to Beta testing we'll need as many venues as we can get! So if you have a venue in mind that isn't on the map please let us know about it via the 'Feedback' form, accessible by pressing the menu icon in the top left corner of this screen.
                </Text>

                <Text style={styles.header}>
                    What If Something Isn't Working Right?
                </Text>
                <Text style={styles.textBody}>
                    Nigh is still in alpha testing, and we know there are some bugs waiting to be found. If you think you've got one, please let us know via the 'Feedback' form accessible via the menu icon in the top left corner of this screen. 
                </Text>

                <Text style={styles.header}>
                    Something Else?
                </Text>
                <Text style={styles.textBody}>
                    Have a question that wasn't covered by this page? Have an idea for a new feature? Something else? Please let us know what's on your mind via the 'Feedback' form accessible via the menu icon in the top left corner of this screen. 
                </Text>

                <View style={{height : 20}}/>

              </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen : {
        flex:1,
        alignItems: 'center',
        marginTop: getStatusBarHeight(),
        //paddingBottom: 12
      },
      scrollView : {
          //justifyContent : 'center',
          flex : 1,
          marginHorizontal : 18,
          //alignItems : 'center'
      },
      header : {
        textAlign : 'center',
        fontSize : 22,
        fontWeight : '700',
        color : Colors.quasiBlack,
        marginBottom : 2
      },
      textBody : {
        textAlign : 'center',
        fontSize : 14,
        fontWeight : '500',
        color : Colors.inactiveGrey,
        marginBottom : 12
      }
});

export default AboutScreen;