import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from '../../styles/BasicStyles';

// Images
import live_tracking from '../vendorScreens/assets/images/live_tracking.png';

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSignUp = () => {
    this.props.nav.navigate('VendorReg');
  };

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
            source={live_tracking}
            resizeMode="cover"
            style={styles.screenGraphic}
          />
        </View>

        <Text style={[basicStyles.blackColor, styles.textStyle]}>
          Live Tracking
        </Text>

        <Text style={[styles.screenParagraph]}>
          Real time tracking of your food on the aap after ordered.
        </Text>

        <TouchableOpacity
          onPress={this.handleSignUp}
          style={[
            basicStyles.button,
            basicStyles.pinkBgColor,
            basicStyles.alignSelf,
            basicStyles.paddingHorizontal,
            basicStyles.marginTop,
            styles.buttonDesign,
          ]}>
          <Text
            style={[
              basicStyles.paddingHorizontal,
              basicStyles.heading,
              basicStyles.whiteColor,
            ]}>
            Sign Up
          </Text>
        </TouchableOpacity>
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
  buttonDesign: {
    marginTop: hp(4),
    paddingHorizontal: wp(8),
    borderRadius: hp(3),
    elevation: 5,
  },
});
