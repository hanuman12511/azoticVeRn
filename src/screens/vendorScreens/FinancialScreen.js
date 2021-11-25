import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

import ic_cod from '../../assets/icons/ic_cod.png';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';
import TotalEarningScreen from '../../screens/vendorScreens/TotalEarningScreen';
import PayOutScheduleScreen from '../../screens/vendorScreens/PayOutScheduleScreen';

// Styles
import basicStyles from '../../styles/BasicStyles';

// VectorIcons

export default class FinancialScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'TotalEarning',
    };
  }

  handleEarning = () => {
    this.props.navigation.navigate('TotalEarning');
  };
  handleAccountDetail = () => {
    this.props.navigation.navigate('AccountDetail');
  };
  handleSchedule = () => {
    this.props.navigation.navigate('PayOutSchedule');
  };

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'TotalEarning') {
      return <TotalEarningScreen navigation={this.props.navigation} />;
    } else if (tabActive === 'PayOutSchedule') {
      return <PayOutScheduleScreen navigation={this.props.navigation} />;
    }
  };

  handleTotalEarning = () => {
    this.setState({tabActive: 'TotalEarning'});
  };
  handlePayOutSchedule = () => {
    this.setState({tabActive: 'PayOutSchedule'});
  };

  render() {
    const {tabActive} = this.state;
    const activeStyle = [styles.tabBarIndicator, {backgroundColor: '#f57c00'}];
    const tabActiveText = [
      styles.tabBarLabel,
      {color: '#333', fontWeight: '700'},
    ];
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Payout Schedule"
          nav={this.props.navigation}
          // navAction="back"
        />
        <View style={basicStyles.mainContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={this.handleTotalEarning}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'TotalEarning'
                    ? tabActiveText
                    : styles.tabBarLabel
                }>
                Earning
              </Text>
              <View
                style={
                  tabActive === 'TotalEarning'
                    ? activeStyle
                    : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handlePayOutSchedule}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'PayOutSchedule'
                    ? tabActiveText
                    : styles.tabBarLabel
                }>
                Payout
              </Text>
              <View
                style={
                  tabActive === 'PayOutSchedule'
                    ? activeStyle
                    : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>
          </View>
          {this.renderSlots()}

          {/* <Image
            source={ic_cod}
            resizeMode="cover"
            style={styles.cashIconStyle}
          />
          <View style={[basicStyles.padding, basicStyles.justifyCenter]}>
            <TouchableHighlight
              onPress={this.handleEarning}
              underlayColor="#f2f1f1"
              style={styles.buttonDesign}>
              <Text>Total Earning</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.handleAccountDetail}
              underlayColor="#f2f1f1"
              style={styles.buttonDesign}>
              <Text>Account Detail</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.handleSchedule}
              underlayColor="#f2f1f1"
              style={styles.buttonDesign}>
              <Text>Pay Out Schedule</Text>
            </TouchableHighlight>
            
          </View> */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  buttonDesign: {
    height: hp(6),
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: hp(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(3),
  },
  cashIconStyle: {
    marginVertical: hp(6),
    height: hp(25),
    aspectRatio: 1 / 1,
    alignSelf: 'center',
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 0,
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderBottomColor: '#f2f1f1',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabStyle: {
    flex: 1,
    alignItems: 'center',
    // height: '100%',
    justifyContent: 'center',
    zIndex: 7,
    height: hp(6),
  },
  tabBarLabel: {
    color: '#999',
    fontSize: wp(4),
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    // marginBottom: hp(-1.8),
    textAlignVertical: 'center',
  },
  tabBarIndicator: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 1,
    // alignSelf: 'center',
    borderRadius: 2.5,
    // marginLeft: wp(12.2),
  },
});
