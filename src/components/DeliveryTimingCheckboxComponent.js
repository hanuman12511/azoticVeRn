import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const DeliveryTimingCheckboxComponent = (props) => {
  const {day, slotTiming, isChecked, toggleSlotCallback, index} = props;
  const [toggleCheckBox, setToggleCheckBox] = useState(isChecked);

  const handleCheckBoxValueChange = () => {
    const newValue = !toggleCheckBox;
    setToggleCheckBox(newValue);
    toggleSlotCallback(newValue, day, slotTiming, index);
  };

  return (
    <View
      style={
        toggleCheckBox
          ? {...styles.slotText, borderColor: '#f57c00'}
          : styles.slotText
      }>
      <CheckBox
        value={toggleCheckBox}
        onValueChange={handleCheckBoxValueChange}
        tintColors={{true: '#f57c00', false: '#9996'}}
      />
      {/* <CheckBox
        style={styles.checkBoxStyle}
        value={isChecked}
        onValueChange={handleCheckBoxValueChange}
        boxType="square"
      /> */}
    </View>
  );
};

export default DeliveryTimingCheckboxComponent;

const styles = StyleSheet.create({
  slotText: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#9996',
    borderRadius: 5,
    marginLeft: wp(2),
    height: hp(3.5),
    width: wp(17),
  },
});
