import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from '../../styles/BasicStyles';

// Images
import fast_delivery from '../vendorScreens/assets/images/fast_delivery.png';

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={[
          basicStyles.flexOne,
          basicStyles.justifyCenter,
          basicStyles.whiteBackgroundColor,
        ]}>
        <View style={basicStyles.directionRow}>
          <Image
            source={fast_delivery}
            resizeMode="cover"
            style={styles.screenGraphic}
          />
        </View>

        <Text style={[basicStyles.blackColor, styles.textStyle]}>
          Fast Delivery
        </Text>

        <Text style={[styles.screenParagraph]}>
          Fast delivery to your Home, Office and wherever you are.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenGraphic: {
    width: wp(100),
    aspectRatio: 2 / 1,
  },
  textStyle: {
    fontSize: wp(5),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: hp(5),
    color: '#f65e83',
  },
  screenParagraph: {
    textAlign: 'center',
    marginTop: hp(1.5),
    width: wp(55),
    alignSelf: 'center',
    fontSize: wp(3.5),
  },
});
