import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
// import SelectInput from 'react-native-select-input-ios';
import {Picker} from '@react-native-picker/picker';
import {Table, Row, Rows} from 'react-native-table-component';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';
import CustomLoader from '../../components/CustomLoader';
import {showToast} from '../../components/CustomToast';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_timer from '../../assets/icons/ic_timer.png';
import ic_reject from '../../assets/icons/ic_reject.png';
import ic_approved from '../../assets/icons/ic_approved.png';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Api's
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, clearData, getData} from '../../api/UserPreference';

export default class TotalEarningScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      editProfilePopup: false,
      payOutPopup: false,
      totalPayments: 0,
      payments: '',
      message: '',
      description: '',
      bankName: '',
      bankAccountName: '',
      bankAccountNumber: '',
      ifscCode: '',

      paymentDetails: null,
    };
  }

  componentDidMount() {
    this.fetchAccountDetails();
    this.fetchPayoutData();
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
        const {success, completeEarnings, message, isAuthTokenExpired} =
          response;

        this.setState({isLoading: false});

        if (success) {
          const {accountDetails} = response;
          const {bankName, bankAccountName, bankAccountNumber, ifscCode} =
            accountDetails;

          this.setState({
            bankName,
            bankAccountName,
            bankAccountNumber,
            ifscCode,
          });
        } else {
          this.setState({earnings: null, completeEarnings, message});
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

  fetchPayoutData = async () => {
    try {
      this.setState({isLoading: true});

      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/vendorPayouts',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        this.setState({isLoading: false});
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {payments} = response;
          const {totalPayments, paymentDetails} = payments;
          this.setState({
            payments,
            totalPayments,
            paymentDetails,
          });
        } else {
          this.setState({payments: null, message});
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
      console.log('pay out screen issue', error);
    }
  };

  handleAccountDetailUpdate = async () => {
    const {bankAccountName, bankName, bankAccountNumber, ifscCode} = this.state;
    try {
      this.setState({isLoading: true});

      const params = {
        bankName,
        bankAccountName,
        bankAccountNumber,
        bankIfscCode: ifscCode,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/updateAccountDetails',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;

        this.setState({isLoading: false});

        if (success) {
          this.setState({editProfilePopup: false});
          showToast(message);
          await this.fetchAccountDetails();
        } else {
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
          } else {
            showToast(message);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleRequestPayout = async () => {
    const {totalPayments, description} = this.state;
    if (totalPayments <= 10 || totalPayments.toString().trim() === '') {
      Alert.alert('Alert', 'You cannot request, Amount is low');
      return;
    }

    try {
      this.setState({isLoading: true});

      const params = {
        amount: totalPayments,
        description,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/addPaymentRequest',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message, isAuthTokenExpired} = response;

        this.setState({isLoading: false});

        if (success) {
          this.setState({payOutPopup: false});
          showToast(message);
          await this.fetchPayoutData();
        } else {
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
          } else {
            showToast(message);
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
    let iconCover = {
      backgroundColor: item.bg,
      height: wp(8),
      width: wp(8),
      borderRadius: 4,
      marginRight: wp(2),
      alignItems: 'center',
      justifyContent: 'center',
    };
    let amountStyle = {
      fontSize: wp(5),
      color: item.colors,
      fontWeight: '700',
    };
    const {amount, paymentDate, status} = item;

    return (
      <View style={{padding: wp(3)}}>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              borderBottomColor: '#ccc2',
              borderBottomWidth: 1,
              paddingBottom: wp(2),
              marginBottom: wp(2),
            },
          ]}>
          <View
            style={[
              iconCover,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  status === 'Approved'
                    ? '#14957E20'
                    : status === 'Rejected'
                    ? '#CB343420'
                    : '#f5f5f5',
              },
            ]}>
            <Image
              source={
                status === 'Approved'
                  ? ic_approved
                  : status === 'Rejected'
                  ? ic_reject
                  : ic_timer
              }
              resizeMode="cover"
              style={styles.idIcon}
            />
          </View>
          <Text style={basicStyles.flexOne}>{status}</Text>

          <Text
            style={[
              amountStyle,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                color:
                  status === 'Approved'
                    ? '#14957E'
                    : status === 'Rejected'
                    ? '#CB3434'
                    : '#333',
              },
            ]}>
            {amount}
          </Text>
        </View>
        <Text style={basicStyles.textExtraLight}>{paymentDate}</Text>
      </View>
    );
  };

  itemSeparator = () => (
    <View style={{height: 4, backgroundColor: '#f5f5f5'}} />
  );

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      totalPayments,
      paymentDetails,
      bankName,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
    } = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.mainContainer}>
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

              <TouchableOpacity
                style={styles.edit}
                onPress={() => {
                  this.setState({editProfilePopup: true});
                }}>
                <MaterialIcons
                  size={21}
                  name={'edit'}
                  color="#fff"
                  // style={basicStyles.marginLeftHalf}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                basicStyles.flexOne,
                basicStyles.alignCenter,
                basicStyles.justifyCenter,
              ]}>
              <Text style={styles.title}>Payout</Text>
              <Text style={styles.amount}>Rs. {totalPayments}</Text>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.alignEnd,
              ]}>
              <Text style={styles.minTitle}>min Rs. 1000 to request</Text>
              <TouchableOpacity
                style={styles.request}
                onPress={() => {
                  this.setState({payOutPopup: true});
                }}>
                <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                  Request Payout
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={this.state.paymentDetails}
            renderItem={this.renderItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={[basicStyles.marginBottom]}
          />
        </View>

        <Modal
          visible={this.state.editProfilePopup}
          onTouchOutside={() => this.setState({editProfilePopup: false})}>
          <ModalContent
            style={{
              // flex: 1,
              // backgroundColor: 'fff',
              minHeight: hp(30),
              width: wp(90),
            }}>
            <View style={styles.popupContainer}>
              <ScrollView>
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => this.setState({editProfilePopup: false})}>
                  <MaterialIcons
                    size={21}
                    name={'close'}
                    color="#F57C00"
                    // style={basicStyles.marginLeftHalf}
                  />
                </TouchableOpacity>
                <Text style={styles.popupTitle}>Bank Details</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Account Holder Name</Text>
                  <TextInput
                    placeholder="Enter Account Holder Name..."
                    style={styles.input}
                    value={bankAccountName}
                    onChangeText={e => this.setState({bankAccountName: e})}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bank Name</Text>
                  <TextInput
                    placeholder="Enter Bank Name..."
                    style={styles.input}
                    value={bankName}
                    onChangeText={e => this.setState({bankName: e})}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Account Number</Text>
                  <TextInput
                    placeholder="Enter Account Number..."
                    style={styles.input}
                    value={bankAccountNumber}
                    onChangeText={e => this.setState({bankAccountNumber: e})}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>IFSC Code</Text>
                  <TextInput
                    placeholder="Enter IFSC Code..."
                    style={styles.input}
                    value={ifscCode}
                    onChangeText={e => this.setState({ifscCode: e})}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleAccountDetailUpdate}>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ModalContent>
        </Modal>

        <Modal
          visible={this.state.payOutPopup}
          onTouchOutside={() => this.setState({payOutPopup: false})}
          // modalStyle={{  }}
        >
          <ModalContent
            style={{
              // flex: 1,
              // backgroundColor: 'fff',
              minHeight: hp(30),
              width: wp(90),
            }}>
            <View style={styles.popupContainer}>
              <ScrollView>
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => this.setState({payOutPopup: false})}>
                  <MaterialIcons
                    size={21}
                    name={'close'}
                    color="#F57C00"
                    style={basicStyles.marginRightHalf}
                  />
                </TouchableOpacity>

                <Text style={styles.popupTitle}>Request Payout</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Payable Amount</Text>
                  <Text style={styles.input}>Rs. {totalPayments}</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    // style={styles.input}
                    placeholder="Write a Description...."
                    placeholderTextColor="#999"
                    multiline={true}
                    numberOfLines={4}
                    style={styles.multiLineInputDesign}
                    value={this.state.description}
                    onChangeText={e => {
                      this.setState({description: e});
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleRequestPayout}>
                  <Text style={styles.buttonText}>Request</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ModalContent>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#f65e83'},
  close: {
    position: 'absolute',
    top: wp(0),
    right: wp(0),
    borderWidth: 1,
    borderColor: '#F57C00',
    height: wp(8),
    aspectRatio: 1 / 1,
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
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
  button: {
    height: hp(5),
    borderWidth: 1,
    borderColor: '#F57C00',
    paddingHorizontal: wp(6),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: wp(4),
    color: '#F57C00',
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
    backgroundColor: '#f5f5f5',
    fontSize: wp(3.8),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    paddingVertical: wp(2.2),
    // height: hp(5.5),
  },
  multiLineInputDesign: {
    // marginVertical: hp(2),
    fontSize: wp(3.8),
    // paddingLeft: wp(2),
    backgroundColor: '#f5f5f5',
    paddingHorizontal: wp(3),
    borderRadius: 5,
    textAlignVertical: 'top',
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
    marginBottom: wp(3),
  },

  edit: {
    height: wp(8),
    aspectRatio: 1 / 1,
    backgroundColor: '#fff4',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  request: {
    backgroundColor: '#0006',
    paddingVertical: wp(2),
    paddingHorizontal: wp(3),
    borderRadius: 5,
  },
  minTitle: {
    color: '#fff8',
    fontSize: wp(3.2),
  },
  profileViews: {
    height: wp(28),
    width: wp(28),
    borderRadius: wp(14),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLabel: {
    color: '#999',
    marginBottom: wp(2),
  },
  popupTitle: {
    color: '#333',
    fontWeight: '700',
    fontSize: wp(5),
    marginBottom: hp(3),
    textAlign: 'center',
  },
});
