import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert,
  clearData,
} from 'react-native';

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
import CustomLoader from '../../components/CustomLoader';

// Styles
import basicStyles from '../../styles/BasicStyles';

export default class TotalEarningScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountDetails: null,
      bankName: '',
      bankAccountName: '',
      bankAccountNumber: '',
      ifscCode: '',
      tableHead: ['Sr. No.', 'Order Id', 'Date', 'Amount'],
      tableData: [
        ['1', '#654321', '25 Oct.', '$ 100.00'],
        ['2', '#654321', '25 Oct.', '$ 100.00'],
        ['3', '#654321', '25 Oct.', '$ 100.00'],
        ['4', '#654321', '25 Oct.', '$ 100.00'],
      ],
      isLoading: true,
    };
  }
  componentDidMount() {
    this.handleAccountDetail();
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

  handleAccountDetail = async () => {
    this.setState({isLoading: true});

    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const {vendorCode} = userInfo;
      const params = {
        vendorCode,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getVendorAccountDetails',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;

        this.setState({isLoading: false});

        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
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
            message,
            accountDetails,
          });
        } else {
          this.setState({accountDetails: null, message});
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

  handleEditDetail = () => {
    const {accountDetails} = this.state;
    this.props.navigation.navigate('EditAccount', {
      accountDetails,
      handleAccountDetail: this.handleAccountDetail,
    });
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }
    // const [selectedValue, setSelectedValue] = useState('java');
    const {bankName, bankAccountName, bankAccountNumber, ifscCode} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.mainContainer}>
          <HeaderComponent
            headerTitle="Account Detail"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[basicStyles.padding, basicStyles.flexOne]}>
            <View style={styles.totalView}>
              <Text style={styles.total}>Vendor Name</Text>
              <Text style={styles.amount}>{bankAccountName}</Text>
            </View>

            <Text style={[basicStyles.heading, basicStyles.marginVentricle]}>
              More Information
            </Text>

            <Text style={styles.text}>Bank Name: {bankName}</Text>
            <Text style={styles.text}>IFSC Code: {ifscCode}</Text>
            <Text style={styles.text}>Account No: {bankAccountNumber}</Text>

            <TouchableHighlight
              style={[
                styles.button,
                basicStyles.pinkBgColor,
                basicStyles.marginTop,
              ]}
              underlayColor="#f65e8380"
              onPress={this.handleEditDetail}>
              <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
                Edit Detail
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    marginBottom: wp(2),
    fontSize: wp(3),
  },
  button: {
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
});
