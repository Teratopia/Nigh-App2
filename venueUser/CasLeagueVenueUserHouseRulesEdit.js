import React, {useState} from 'react';
import {Text, View, TextInput, StyleSheet} from 'react-native';
import Colors from '../constants/colors';   //
import VenueNetworking from '../networking/venueNetworking';    //
import Icon from 'react-native-vector-icons/Entypo';    //

const CasLeagueVenueUserHouseRulesEdit = props => {

  const [houseRules, setHouseRules] = useState(props.venueUser.houseRules && props.venueUser.houseRules.breaking ? props.venueUser.houseRules : {
      name : "House",
      breaking : "Break from the kitchen, behind the second diamond.",
      pocketScratching : "Opponent places cue ball wherever they like in the kitchen and must shoot away from the kitchen.",
      tableScratching : "Player ends turn and cue ball stays where it lies.",
      breakingScratching : "Opponent breaks.",
      eightBallScratching : "Player loses on pocket scratches, ends turn on table scratches.",
      slop : "No slop, call your shot.",
      prohibited : "Masses shots, jump shots, gambling."
  });
  const [viewHouseRulesEditField, setViewHouseRulesEditField] = useState({
    name : false,
    breaking : false,
    pocketScratching : false,
    tableScratching : false,
    breakingScratching : false,
    eightBallScratching : false,
    slop : false,
    prohibited : false
});

  const toggleViewHouseRulesEditField = field => {
      var clone = {...viewHouseRulesEditField};
      clone[field] = !clone[field];
      setViewHouseRulesEditField(clone);
  }

  const updateRules = (field, e) => {
      var clone = {...houseRules};
      clone[field] = e.nativeEvent.text;
      updateVenue(clone, field);
  }

  const updateVenue = (rules, field) => {
    var venueUserClone = {...props.venueUser};
    venueUserClone.houseRules = rules;
    VenueNetworking.updateVenue(venueUserClone, venue => {
      console.log('updateVenue value = ', venue);
      if(venue){
          setHouseRules(rules);
          //setVenueEmail(venue.email);
          props.setVenueUser(venue);
          toggleViewHouseRulesEditField(field);
      }
  }, err => {
      console.log('updateVenue err = ', err)
  })

}

return (
    <View style={{...styles.optionsView, marginHorizontal : 16, ...props.style}}>
                        <View style={{...styles.textView, marginTop : 8}}>
                            <Text style={{...styles.textStyle, fontSize : 16, fontWeight : '600', color : Colors.quasiBlack}}>House Rules</Text>
                        </View>
                        {
                            !viewHouseRulesEditField.breaking ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Breaking</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.breaking}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('breaking')}} style={{marginLeft : 4}}/>
                                    </View>    
                                    :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.breaking}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Breaking</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Breaking" 
                                                onSubmitEditing={e => {updateRules('breaking', e)}} 
                                                defaultValue={houseRules.breaking}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.pocketScratching ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Pocket Scratching</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.pocketScratching}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('pocketScratching')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.pocketScratching}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Pocket Scratching</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Pocket Scratching" 
                                                onSubmitEditing={e => {updateRules('pocketScratching', e)}} 
                                                defaultValue={houseRules.pocketScratching}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.tableScratching ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Table Scratching</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.tableScratching}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('tableScratching')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.tableScratching}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Table Scratching</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Table Scratching" 
                                                onSubmitEditing={e => {updateRules('tableScratching', e)}} 
                                                defaultValue={houseRules.tableScratching}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.breakingScratching ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Breaking Scratching</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.breakingScratching}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('breakingScratching')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.breakingScratching}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Breaking Scratching</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Pocket Scratching" 
                                                onSubmitEditing={e => {updateRules('breakingScratching', e)}} 
                                                defaultValue={houseRules.breakingScratching}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.eightBallScratching ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Eight Ball Scratching</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.eightBallScratching}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('eightBallScratching')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.eightBallScratching}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Eight Ball Scratching</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Pocket Scratching" 
                                                onSubmitEditing={e => {updateRules('eightBallScratching', e)}} 
                                                defaultValue={houseRules.eightBallScratching}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.slop ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Slop</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.slop}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('slop')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.slop}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Slop</Text>
                                </View>
                                <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                    <TextInput  placeholder="Rules for Pocket Scratching" 
                                                onSubmitEditing={e => {updateRules('slop', e)}} 
                                                defaultValue={houseRules.slop}
                                                placeholderTextColor={Colors.inactiveGrey}
                                                style={{
                                                    textAlign : 'center',
                                                    color : Colors.quasiBlack
                                                }}
                                                multiline={true}
                                                returnKeyType="done"
                                                />
                                </View>
                            </View>
                        }
                        {
                            !viewHouseRulesEditField.prohibited ? 
                            <View style={{justifyContent : 'center', alignItems : 'center'}}>
                                <View style={{...styles.textView, marginTop : 8}}>
                                    <Text style={{...styles.textStyle, fontSize : 14, fontWeight : '500', color : Colors.quasiBlack}}>Prohibited</Text>
                                </View>
                                {
                                    props.setVenueUser ? 
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <View style={{width : 16}}/>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.prohibited}</Text>
                                        <Icon name="edit" size={12} color={Colors.quasiBlack} onPress={() => {toggleViewHouseRulesEditField('prohibited')}} style={{marginLeft : 4}}/>
                                    </View>
                                :
                                    <View style={{...styles.textView, flexDirection : 'row', alignItems : 'center', justifyContent : 'center'}}>
                                        <Text style={{...styles.textStyle, fontSize : 12, color : Colors.inactiveGrey, textAlign : 'center'}}>{houseRules.prohibited}</Text>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{...styles.inputFormTextInput, width : '100%'}}>
                                <TextInput  placeholder="Rules for Pocket Scratching" 
                                            onSubmitEditing={e => {updateRules('prohibited', e)}} 
                                            defaultValue={houseRules.prohibited}
                                            placeholderTextColor={Colors.inactiveGrey}
                                            style={{
                                                textAlign : 'center',
                                                color : Colors.quasiBlack
                                            }}
                                            multiline={true}
                                            returnKeyType="done"
                                            />
                            </View>
                        }
                </View>
    )
}


const styles = StyleSheet.create({
    optionsView : {
      flex : 3,
      //width : '100%',
      //justifyContent : 'space-evenly',
      alignItems : 'center',
      justifyContent : 'center',
      marginVertical : 8,
      paddingTop : 4
    },
    textView : {
      marginVertical : 2,
    },
    textStyle : {
        color : Colors.quasiBlack,
        fontSize : 14
    },
    inputFormTextInput : {
      borderWidth : 1,
      borderColor : Colors.inactiveGrey,
      margin : 4,
      borderRadius : 8,
      //width : '100%',
      textAlign : 'center'
  }
  
  });
  
  export default CasLeagueVenueUserHouseRulesEdit;