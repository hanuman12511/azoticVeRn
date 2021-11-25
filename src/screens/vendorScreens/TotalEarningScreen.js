import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  clearData,
  TouchableHighlight,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Table, Row} from 'react-native-table-component';
import {Picker} from '@react-native-picker/picker';
import PickerModal from 'react-native-picker-modal-view';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from './BasicStyles';

import CustomLoader from '../../components/CustomLoader';
//Api's
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';

// Icons
import ic_order from '../../assets/icons/ic_order.png';
import Entypo from 'react-native-vector-icons/Entypo';

export default class TotalEarningScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalEarnings: '',
      bankName: '',
      bankAccountName: '',
      bankAccountNumber: '',
      ifscCode: '',
      daySelection: 'TodayEarning',
      message: '',
      earnings: null,
      completeEarnings: 0,

      isLoading: true,

      StartTakingOrder: [
        {
          Id: 1,
          Name: 'Today',
          Value: 'Today',
        },
        {
          Id: 2,
          Name: 'Weekly',
          Value: 'Week',
        },
        {
          Id: 3,
          Name: 'Monthly',
          Value: 'Month',
        },
      ],
      selectedState: {
        Id: 1,
        Name: 'Today',
        Value: 'Today',
      },
    };
  }

  componentDidMount() {
    this.fetchAccountDetails();
    this.fetchVendorEarning();
  }

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
      console.log('there is an error in sign-out');
    }
  };

  fetchAccountDetails = async () => {
    try {
      this.setState({isLoading: true});

      //  preparing params
      const params = null;

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getVendorAccountDetails',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        const {
          success,
          completeEarnings,
          message,
          isAuthTokenExpired,
        } = response;

        this.setState({isLoading: false});

        if (success) {
          const {accountDetails} = response;
          const {
            bankName,
            bankAccountName,
            bankAccountNumber,
            ifscCode,
          } = accountDetails;

          this.setState({
            bankName,
            bankAccountName,
            bankAccountNumber,
            ifscCode,
          });
        } else {
          this.setState({message});
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
      console.log(error.message);
    }
  };

  fetchVendorEarning = async () => {
    this.setState({isLoading: true});
    try {
      const {selectedState} = this.state;

      const params = {
        date: selectedState.Value,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/vendorEarnings',
        params,
        true,
        false,
      );
      if (response) {
        const {
          success,
          completeEarnings,
          message,
          isAuthTokenExpired,
        } = response;

        this.setState({isLoading: false});

        if (success) {
          const {earnings} = response;
          const {totalEarnings, earningDetails} = earnings;

          this.setState({
            earnings,
            completeEarnings,
            totalEarnings,
            earningDetails,
          });
        } else {
          this.setState({earnings: null, completeEarnings: 0, message});
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
      console.log(error.message);
    }
  };

  async onValueChangeCat(value) {
    this.setState({selectedCat: value});
  }

  renderItem = ({item}) => {
    return (
      <View style={{padding: wp(3)}}>
        <View
          style={[
            basicStyles.directionRow,
            // basicStyles.marginBottom,
            basicStyles.alignCenter,
            {
              borderBottomColor: '#ccc2',
              borderBottomWidth: 1,
              paddingBottom: wp(2),
              marginBottom: wp(2),
            },
          ]}>
          <View style={styles.iconCover}>
            <Image source={ic_order} resizeMode="cover" style={styles.idIcon} />
          </View>
          <Text
            style={basicStyles.flexOne}
            onPress={() => this.handleTotalEarningDetail(item)}>
            Order Id: {item.orderId}
          </Text>

          <Text style={basicStyles.headingLarge}>Rs. {item.amount}</Text>
        </View>
        <Text style={basicStyles.textExtraLight}>{item.date}</Text>
      </View>
    );
  };
  itemSeparator = () => (
    <View style={{height: 4, backgroundColor: '#f5f5f5'}} />
  );

  // Start Taking Orders
  handleSelectStartTakingOrder = async (selectedState) => {
    await this.setState({selectedState});

    this.fetchVendorEarning();
    return selectedState;
  };

  handleSelectStartTakingOrderClose = () => {
    const {selectedState} = this.state;
    this.setState({selectedState});
  };

  renderStartTakingOrderCategoryPicker = (disabled, selected, showModal) => {
    const {selectedState} = this.state;
    const {Name} = selectedState;

    const labelStyle = {
      color: '#fff',
      fontWeight: '700',
    };

    if (Name === 'Select State') {
      labelStyle.color = '#555';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          <Entypo
            size={21}
            name={'chevron-small-down'}
            color="#fff"
            style={basicStyles.marginLeftHalf}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // Start Taking Orders

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      bankName,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
      completeEarnings,
    } = this.state;

    const {StartTakingOrder, selectedState, earnings} = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[basicStyles.flexOne]}>
          <View style={[styles.container]}>
            <View style={[styles.earningContainer]}>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <View>
                  <Text
                    style={[basicStyles.headingLarge, basicStyles.whiteColor]}>
                    {bankAccountName}
                  </Text>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    {bankAccountNumber}
                  </Text>
                </View>

                <PickerModal
                  items={StartTakingOrder}
                  selected={selectedState}
                  onSelected={this.handleSelectStartTakingOrder}
                  onClosed={this.handleSelectStartTakingOrderClose}
                  backButtonDisabled
                  showToTopButton={true}
                  // showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={false}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderStartTakingOrderCategoryPicker}
                />
              </View>
              <View
                style={[
                  basicStyles.flexOne,
                  basicStyles.alignCenter,
                  basicStyles.justifyCenter,
                ]}>
                <Text style={styles.title}>Total Earning</Text>
                <Text style={styles.amount}>Rs. {completeEarnings}</Text>
              </View>
            </View>

            <View style={basicStyles.flexOne}>
              {/* <View style={[basicStyles.alignCenter]}>
                <Text style={styles.payoutAmount}>
                  {this.state.selectedCat} Total Earning: Rs.
                  {this.state.totalEarnings}
                </Text>

                <TouchableHighlight
                  onPress={this.handleCheckTotalEarning}
                  style={[
                    basicStyles.button,
                    basicStyles.pinkBgColor,
                    basicStyles.alignSelfCenter,
                    basicStyles.marginBottom,
                  ]}>
                  <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                    Submit
                  </Text>
                </TouchableHighlight>
              </View> */}

              {earnings ? (
                <View style={[basicStyles.flexOne]}>
                  {/* <Table
                    borderStyle={{borderWidth: 1, borderColor: '#ffffff80'}}>
                    <Row
                      data={this.state.tableHead}
                      style={styles.header}
                      textStyle={[styles.text, basicStyles.whiteColor]}
                    />
                  </Table> */}
                  <FlatList
                    data={earnings.earningDetails}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    //numColumns={2}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={[basicStyles.marginBottom]}
                  />
                </View>
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>
                    {this.state.message}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  header: {backgroundColor: '#f65e83'},
  inputFFF2: {
    width: wp(16.66),
    fontSize: wp(3),
    borderRightWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
    lineHeight: hp(5.5),
  },
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCover: {
    backgroundColor: '#F57C0020',
    height: wp(8),
    width: wp(8),
    borderRadius: 4,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  idIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  statusMessage: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mailContainer: {
    flex: 1,
  },

  tabBarIndicator: {
    backgroundColor: '#e5910c',
    height: '100%',
    borderRadius: wp(1),
  },
  tabBarStyle: {
    marginBottom: hp(1),
    backgroundColor: '#999',
    borderRadius: wp(1),
  },
  tabBarLabel: {
    color: '#fff',
    fontSize: wp(3.5),
    textTransform: 'capitalize',
  },
  inputView: {
    height: hp(6),
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    borderRadius: 5,
  },
  input: {
    fontSize: wp(3),
    marginLeft: wp(2),
  },
  dayButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: wp(12.85),
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  head: {
    height: 40,
    backgroundColor: '#f65e83',
  },
  text: {
    margin: 6,
    fontSize: wp(3),
  },
  dayEarning: {
    fontSize: wp(3),
    textAlign: 'center',
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutAmount: {
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(2),
    fontWeight: '700',
  },
  addIcon: {
    width: 25,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: wp(3),
    height: hp(5.5),
    borderRadius: hp(2.75),
  },
  picker: {
    height: hp(5.5),
    flex: 1,
  },
  earningContainer: {
    backgroundColor: '#643969',
    elevation: 5,
    margin: wp(3),
    height: hp(25),
    padding: wp(3),
    borderRadius: 10,
  },
  title: {
    fontSize: wp(4),
    color: '#fff',
  },
  amount: {
    fontSize: wp(6.5),
    fontWeight: '700',
    color: '#fff',
  },
  viewStyle: {
    flex: 0.2,
    // alignItems: 'center',
    margin: wp(3),
    flexDirection: 'row',
    width: '94%',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(2.75),
  },
  itemStyle: {
    height: hp(12),
    // flex: 1.5,
    // borderWidth: 3,
    fontSize: wp(3),
    color: '#333',
  },
  pickerStyle: {
    width: '100%',
    height: 40,
    color: '#333',
    fontSize: 14,
  },
  textStyle: {
    fontSize: 14,
  },
  inputContainer: {
    height: hp(4.5),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    marginBottom: wp(3),
    borderRadius: 5,
    backgroundColor: '#0006',
    marginTop: wp(3),
  },
});
