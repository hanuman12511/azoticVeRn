import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
// import SelectInput from 'react-native-select-input-ios';
import { Table, Row, Rows } from 'react-native-table-component';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';

// Styles
import basicStyles from '../../styles/BasicStyles';

//api
import { BASE_URL, makeRequest } from '../../api/ApiInfo';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

export default class TotalEarningScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderid: '',
      completedOn: '',
      orderValue: '',
      appCut: '',
      taxes: '',
      totalPayable: '',
      message: '',
      appCutRate: '',
    };
  }
  componentDidMount() {
    this.handleGetOrderData();
  }

  handleGetOrderData = async () => {
    try {
      const item = this.props.navigation.getParam('item', null);
      console.log(item);
      const { orderId } = item;
      const params = {
        orderId: orderId,
      }
      console.log(params);
      const response = await makeRequest(BASE_URL + 'api/Vendors/getDetailEarnings', params, true, false);
      if (response) {
        const { success, message } = response;
        if (success) {
          const { earningDetails } = response;
          const { orderid,
            completedOn,
            orderValue,
            appCut,
            taxes,
            totalPayable,
            appCutRate, } = earningDetails;
          this.setState({
            orderid,
            completedOn,
            orderValue,
            appCut,
            taxes,
            totalPayable,
            appCutRate,
          });
        } else {
          this.setState({
            message,
          });
        }
      }
    } catch (error) {

    }
  }


  render() {
    const { orderid,
      completedOn,
      orderValue,
      appCut,
      taxes,
      totalPayable,
      appCutRate, } = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={[basicStyles.mainContainer, { backgroundColor: '#fff' }]}>
          <HeaderComponent
            headerTitle="Total Earning Details"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[basicStyles.flexOne]}>

            <View style={[styles.earningContainer, basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
              <Text style={[basicStyles.heading, { fontSize: wp(4.5) }]}>Total Payable</Text>
              <Text style={[basicStyles.heading, { fontSize: wp(4.5) }]}>₹ {totalPayable}</Text>
            </View>

            <View style={[styles.earningContainer]}>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
                <Text style={[basicStyles.heading]}>OrderId</Text>
                <Text style={[basicStyles.text]}>#{orderid}</Text>
              </View>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
                <Text style={[basicStyles.heading]}>Completed On</Text>
                <Text style={[basicStyles.text]}>{completedOn}</Text>
              </View>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
                <Text style={[basicStyles.heading]}>Order Value</Text>
                <Text style={[basicStyles.text]}>₹ {orderValue}</Text>
              </View>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
                <Text style={[basicStyles.heading]}>App Cut @{appCutRate}%</Text>
                <Text style={[basicStyles.text]}>₹ {appCut}</Text>
              </View>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter, basicStyles.padding, basicStyles.justifyBetween]}>
                <Text style={[basicStyles.heading]}>Taxes </Text>
                <Text style={[basicStyles.text]}>₹ {taxes}</Text>
              </View>
            </View>

          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  earningContainer: {
    backgroundColor: '#fff',
    elevation: 5,
    margin: wp(3),
    //height: hp(16),
    //alignItems: 'center',
    //justifyContent: 'center',
    borderRadius: 5,
  },
  title: {
    fontSize: wp(4),
  },
  totalView: {
    backgroundColor: '#f8f4df',
    height: hp(15),
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#f65e83',
  },
  text: {
    margin: 6,
    fontSize: wp(3),
  },

  input: {
    height: hp(5.5),
    fontSize: wp(3),
    // borderWidth: 1,
    // borderColor: '#000',
    flex: 1,
    borderRadius: 3,
    marginRight: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80'
  },
  input1: {
    height: hp(5.5),
    fontSize: wp(3),
    // borderWidth: 1,
    // borderColor: '#000',
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80'
  },
  inputFFF: {
    height: hp(5.5),
    fontSize: wp(3),
    // borderWidth: 1,
    // borderColor: '#000',
    flex: 1,
    borderRadius: 3,
    marginRight: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
    lineHeight: hp(5.5),
  },
  inputFFF2: {
    height: hp(5.5),
    fontSize: wp(3),
    // borderWidth: 1,
    // borderColor: '#000',
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
    // alignItems: 'center',
    lineHeight: hp(5.5),
  },
  separator: {
    height: wp(2)
  },
  containerStyle: {
    marginBottom: hp(1.5)
  },
  addField: {
    backgroundColor: '#f65e83',
    height: hp(5.5),
    marginBottom: wp(2),
    width: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
    borderRadius: 3,
  },
});
