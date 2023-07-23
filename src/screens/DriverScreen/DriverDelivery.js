import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import OrderHistoryTabComponent from './DriverComponents/OrderHistoryTabComponent';
import CustomLoader from '../../components/DriverLoader';

// Styles
import basicStyles from '../../styles/BasicStyles';

//Api's
import {clearData, getData, KEYS} from '../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: [],
      isLoading: true,
      message: '',
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.showOrderHistory();
  }
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };
  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (info === null) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
    }
  };
  showOrderHistory = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        return;
      }
      this.setState({isLoading: true});
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/DeliveryBoys/completedOrders',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {orderDetails} = response;
          this.setState({
            orderDetails,
            message,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            orderDetails: null,
            message,
            isLoading: false,
            isListRefreshing: false,
          });
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  cartItem = ({item}) => (
    <OrderHistoryTabComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleChangeAddress = () => {
    this.props.navigation.navigate('AddAddress');
  };

  handlePayment = () => {
    this.props.navigation.navigate('Payment');
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <ScrollView
          contentContainerStyle={basicStyles.flexOne}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <View style={basicStyles.mainContainer}>
            {this.state.orderDetails ? (
              <FlatList
                data={this.state.orderDetails}
                renderItem={this.cartItem}
                keyExtractor={this.keyExtractor}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.listContainer}
                refreshing={this.state.isListRefreshing}
                onRefresh={this.handleListRefresh}
              />
            ) : (
              <View style={styles.statusStyle}>
                <Text style={styles.statusMessage}>{this.state.message}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
  offerBackground: {
    width: wp(100),
    height: hp(15),
  },
  couponInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: wp(3),
    height: hp(5.5),
    paddingHorizontal: wp(2),
    marginHorizontal: wp(2),
    color: '#000',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  applyButton: {
    backgroundColor: '#fff',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  pinCodeInput: {
    fontSize: wp(3),
    height: hp(5.5),
    color: '#000',
    backgroundColor: '#ffffff80',
    flex: 1,
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginRight: wp(3),
  },
  checkButton: {
    backgroundColor: '#00adef',
    height: hp(5.5),
    paddingHorizontal: wp(4),
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    textAlign: 'center',
  },
  supportIcon: {
    height: hp(6),
    aspectRatio: 1 / 1,
  },
  wrap: {
    flexWrap: 'wrap',
  },
  paymentOption: {
    height: hp(4),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(2),
  },
  newAddress: {
    backgroundColor: '#00adef',
    paddingVertical: hp(1.5),
    borderRadius: 5,
    width: wp(60),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    height: hp(5.5),
  },
  picAddress: {
    paddingVertical: hp(1),
    borderRadius: 5,
    width: wp(32),
    alignSelf: 'center',
    marginVertical: hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(2),
    borderWidth: 1,
    borderColor: '#00adef',
    height: hp(5.5),
  },
  //
  userInfo: {
    backgroundColor: '#f2f1f1',
    padding: wp(2),
    marginTop: wp(2),
    marginLeft: wp(2),
    marginRight: wp(2),
  },
  infoContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heading: {
    fontSize: wp(3.5),
    marginBottom: wp(2),
  },

  description: {
    fontSize: wp(3),
  },

  changeAddressButton: {
    borderWidth: 1,
    borderColor: '#db9058',
    paddingHorizontal: wp(2.5),
    paddingVertical: wp(1),
    borderRadius: 3,
    fontSize: wp(3),
  },

  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    color: '#444',
    fontSize: wp(3),
    marginRight: wp(2),
  },

  buttonText: {
    fontSize: wp(3),
    color: '#333',
  },
  checkoutButton: {
    padding: wp(2),
  },
  checkoutButtonView: {
    backgroundColor: '#db9058',
    height: hp(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  checkoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusMessage: {
    fontSize: 20,
  },
});
