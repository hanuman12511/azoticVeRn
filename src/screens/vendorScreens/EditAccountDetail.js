import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Picker,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
// import SelectInput from 'react-native-select-input-ios';
import {Table, Row, Rows} from 'react-native-table-component';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

//apis
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';
import {showToast} from '../../components/CustomToast';
import ProcessLoader from '../../components/ProcessLoader';
// Styles
import basicStyles from '../../styles/BasicStyles';

// VectorIcons

import {clearData} from '../../api/UserPreference';

export default class EditAccountDetail extends Component {
  constructor(props) {
    super(props);
    const accountDetails = this.props.navigation.getParam(
      'accountDetails',
      null,
    );
    // const { accountDetails } = accountDetails;
    console.log(accountDetails);
    const {
      bankName,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
    } = accountDetails;
    this.state = {
      bankName,
      bankAccountName,
      bankAccountNumber,
      ifscCode,
      message: '',
      tableHead: ['Sr. No.', 'Order Id', 'Date', 'Amount'],
      tableData: [
        ['1', '#654321', '25 Oct.', '$ 100.00'],
        ['2', '#654321', '25 Oct.', '$ 100.00'],
        ['3', '#654321', '25 Oct.', '$ 100.00'],
        ['4', '#654321', '25 Oct.', '$ 100.00'],
      ],
      isProcessing: false,
    };
  }
  onVendorNameChange = (bankAccountName) => {
    this.setState({bankAccountName});
  };
  onbankNameChange = (bankName) => {
    this.setState({bankName});
  };
  onAccountNumberChange = (bankAccountNumber) => {
    this.setState({bankAccountNumber});
  };
  onIfscNoChange = (ifscCode) => {
    this.setState({ifscCode});
  };
  // componentDidMount() {
  //     this.updateAccountDetail();
  // }
  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
      console.log('there is an error in sign-out');
    }
  };
  updateAccountDetail = async () => {
    try {
      // const userInfo = await getData(KEYS.USER_INFO);
      // const { vendorCode } = userInfo;
      this.setState({isProcessing: true});
      const {
        bankName,
        bankAccountName,
        bankAccountNumber,
        ifscCode,
      } = this.state;
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
        this.setState({isProcessing: false});
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          showToast(message);
          const handleAccountDetail = this.props.navigation.getParam(
            'handleAccountDetail',
            null,
          );
          if (handleAccountDetail) {
            this.props.navigation.pop();
            handleAccountDetail(message);
          }
        } else {
          //this.setState({ message });
          showToast(message);
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
      console.log('account data fatch error', error);
    }
  };
  render() {
    // const [selectedValue, setSelectedValue] = useState('java');
    const {bankName, bankAccountName, bankAccountNumber, ifscCode} = this.state;
    console.log(bankAccountNumber);
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.mainContainer}>
          <HeaderComponent
            headerTitle="Edit Account Detail"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[basicStyles.padding, basicStyles.flexOne]}>
            <View style={styles.totalView}>
              <Text style={styles.total}>Vendor Name</Text>
              {/* <TextInput
                style={styles.textInput}
                placeholder="Vendor Name:"
                placeholderTextColor="#666"
                value={vendorName}
                onChangeText={this.onbankNameChange}
              /> */}
            </View>

            <Text style={[basicStyles.heading, basicStyles.marginTop]}>
              More Information
            </Text>

            <View style={styles.profileRow}>
              {/* <Text style={styles.text}>Bank Name:</Text> */}
              <TextInput
                style={styles.textInput}
                placeholder="Bank Name:"
                placeholderTextColor="#666"
                value={bankName}
                onChangeText={this.onbankNameChange}
              />
            </View>
            <View style={styles.profileRow}>
              {/* <Text style={styles.text}>Account No: </Text> */}
              <TextInput
                style={styles.textInput}
                placeholder="Account No:"
                placeholderTextColor="#666"
                value={bankAccountNumber}
                onChangeText={this.onAccountNumberChange}
              />
            </View>
            <View style={styles.profileRow}>
              {/* <Text style={styles.text}>IFSC Code: </Text> */}
              <TextInput
                style={styles.textInput}
                placeholder="IFSC Code:"
                placeholderTextColor="#666"
                value={ifscCode}
                onChangeText={this.onIfscNoChange}
              />
            </View>

            <TouchableHighlight
              style={[
                basicStyles.pinkBgColor,
                basicStyles.marginTop,
                styles.button,
              ]}
              underlayColor="#f65e8380"
              onPress={this.updateAccountDetail}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Update Detail
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        {this.state.isProcessing && <ProcessLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cccccc80',
    height: hp(7),
    paddingHorizontal: wp(3),
    marginTop: hp(1),
  },
  totalView: {
    backgroundColor: '#fff',
    height: hp(15),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  total: {
    fontSize: wp(4),
  },

  amount: {
    fontSize: wp(6),
    fontWeight: '700',
  },
  pickerView: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: hp(3),
    borderRadius: hp(3),
  },
  pickerStyle: {
    height: hp(6),
    width: wp(94),
    borderWidth: 1,
    borderColor: '#ccc',
    // backgroundColor: '#ccc',
  },
  dayEarning: {
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(3),
    fontWeight: '700',
  },
  dayButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: wp(12.85),
    alignItems: 'center',
    paddingVertical: hp(1),
  },
  // container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
    fontSize: wp(3),
  },
  textInput: {
    fontSize: wp(3.2),
  },
  button: {
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
