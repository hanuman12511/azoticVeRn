import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Styles
import basicStyles from '../styles/BasicStyles';

import Swiper from 'react-native-swiper';

import Screen1 from './CustomerVendorSliders/Screen1';
import Screen2 from './CustomerVendorSliders/Screen2';
import Screen3 from './CustomerVendorSliders/Screen3';
import VendorSetupScreen from './VendorSignUpScreen';
import {checkPermission} from '../firebase_api/FirebaseAPI';

export default class SetupVendorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    checkPermission();
  }

  render() {
    return (
      <SafeAreaView style={[basicStyles.container]}>
        <Swiper
          style={styles.wrapper}
          loadMinimal
          loadMinimalSize={3}
          loop={true}
          // autoplay={false}
          // autoplayTimeout={3}
          showsButtons={false}
          // }
          dot={<View style={styles.screenMainContainer} />}
          activeDot={<View style={styles.screensContainer} />}>
          <Screen1 />
          <Screen2 />
          <Screen3 nav={this.props.navigation} />
          {/* <VendorSetupScreen navigation={this.props.navigation} /> */}
        </Swiper>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    height: hp(100),
    width: wp(800),
    // backgroundColor: '#000',
  },

  screenMainContainer: {
    backgroundColor: 'transparent',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: hp(0),
    borderWidth: 1,
    borderColor: '#333',
  },

  screensContainer: {
    backgroundColor: '#f65e83',
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: hp(0),
  },

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
