import React from 'react';
import {View, Text, Picker, StyleSheet, Modal} from 'react-native';

const CasLeagueVenueHomeNewTablePicker = props => {

return (
        props.modalView === 'price' ?
        <Modal style={{height : '100%', width : '100%'}} transparent={true}>
            <View style={styles.pickerView}>
                <Text style={{fontSize : 22, color : 'white', fontWeight : '700'}}>
                    PRICE
                </Text>
                <Picker
                    selectedValue={props.newTable.price}
                    style={{height: 100, width: 100}}
                    itemStyle={{color : 'white'}}
                    onValueChange={(itemValue, itemIndex) => {
                        props.updateNewTable('price', itemValue);
                        }
                    }>
                    <Picker.Item label="$0.25" value={0.25} />
                    <Picker.Item label="$0.50" value={0.5} />
                    <Picker.Item label="$0.75" value={0.75} />
                    <Picker.Item label="$1.00" value={1.00} />

                    <Picker.Item label="$1.25" value={1.25} />
                    <Picker.Item label="$1.50" value={1.5} />
                    <Picker.Item label="$1.75" value={1.75} />
                    <Picker.Item label="$2.00" value={2.00} />
                    
                    <Picker.Item label="$2.25" value={2.25} />
                    <Picker.Item label="$2.50" value={2.5} />
                    <Picker.Item label="$2.75" value={2.75} />
                    <Picker.Item label="$3.00" value={3.00} />

                    <Picker.Item label="$3.25" value={3.25} />
                    <Picker.Item label="$3.50" value={3.5} />
                    <Picker.Item label="$3.75" value={3.75} />
                    <Picker.Item label="$4.00" value={4.00} />

                    <Picker.Item label="$4.25" value={4.25} />
                    <Picker.Item label="$4.50" value={4.5} />
                    <Picker.Item label="$4.75" value={4.75} />
                    <Picker.Item label="$5.00" value={5.00} />

                    <Picker.Item label="$5.25" value={5.25} />
                    <Picker.Item label="$5.50" value={5.5} />
                    <Picker.Item label="$5.75" value={5.75} />
                    <Picker.Item label="$6.00" value={6.00} />

                    <Picker.Item label="$6.25" value={6.25} />
                    <Picker.Item label="$6.50" value={6.5} />
                    <Picker.Item label="$6.75" value={6.75} />
                    <Picker.Item label="$7.00" value={7.00} />

                    <Picker.Item label="$7.25" value={7.25} />
                    <Picker.Item label="$7.50" value={7.5} />
                    <Picker.Item label="$7.75" value={7.75} />
                    <Picker.Item label="$8.00" value={8.00} />

                    <Picker.Item label="$8.25" value={8.25} />
                    <Picker.Item label="$8.50" value={8.5} />
                    <Picker.Item label="$8.75" value={8.75} />
                    <Picker.Item label="$8.00" value={9.00} />

                    <Picker.Item label="$9.25" value={9.25} />
                    <Picker.Item label="$9.50" value={9.5} />
                    <Picker.Item label="$9.75" value={9.75} />
                    <Picker.Item label="$10.00" value={10.00} />
                </Picker>
            </View>
            <View style={{...styles.pickerView, flex : 1}}/>
        </Modal>
    :
        props.modalView === 'size' ?
            <Modal style={{height : '100%', width : '100%'}} transparent={true}>
                <View style={styles.pickerView}>
                    <Text style={{fontSize : 22, color : 'white', fontWeight : '700'}}>
                        SIZE
                    </Text>
                    <Picker
                    selectedValue={props.newTable.size}
                    style={{height: 200, width: 100}}
                    itemStyle={{color : 'white'}}
                    onValueChange={(itemValue, itemIndex) => {
                        props.updateNewTable('size', itemValue);
                        }
                    }>
                        <Picker.Item label="6'x3'" value="6'x3'" />
                        <Picker.Item label="7'x3.5'" value="7'x3.5'" />
                        <Picker.Item label="8'x4'" value="8'x4'" />
                        <Picker.Item label="9'x4.5'" value="9'x4.5'" />
                        <Picker.Item label="10'x5'" value="10'x5'" />
                        <Picker.Item label="11'x5.5'" value="11'x5.5'" />
                        <Picker.Item label="12'x6'" value="12'x6'" />
                    </Picker>
                </View>
                <View style={{...styles.pickerView, flex : 1}}/>
            </Modal>
    : null
)
                }

    const styles = StyleSheet.create({
      pickerView: {
          flex:3,
          alignItems: 'center',
          width: '100%',
          justifyContent : 'center',
          backgroundColor : 'rgba(0,0,0,.9)'
        }
      });
      
export default CasLeagueVenueHomeNewTablePicker;