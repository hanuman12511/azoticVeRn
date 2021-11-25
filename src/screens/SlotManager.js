import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import {showToast} from '../components/CustomToast';
import CustomLoader from '../components/CustomLoader';
import ProcessLoader from '../components/ProcessLoader';
import DeliveryTimingCheckboxComponent from '../components/DeliveryTimingCheckboxComponent';
import HeaderComponent from '../screens/vendorScreens/VendorComponent/HeaderComponent';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

export default class DeliveryTiming extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isLoading: true,
      isProcessing: false,
      slotTimings: [
        '07.00 AM - 10.00 AM',
        '10.00 AM - 01.00 PM',
        '01.00 PM - 04.00 PM',
        '04.00 PM - 07.00 PM',
      ],
      slotsInfo: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      },
    };
  }

  componentDidMount() {
    // this.fetchDeliverySlots();
  }

  fetchDeliverySlots = async () => {
    try {
      const params = null;
      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/viewSlots',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {slotTimings, slotsInfo} = response;
          this.setState({slotTimings: slotsInfo, slotsInfo, isLoading: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderSlotTimings = () => {
    const {slotTimings} = this.state;
    const slotTimingUIElements = slotTimings.map((item, index) => (
      <Text style={styles.slotText} key={index}>
        {item}
      </Text>
    ));

    return (
      <View style={styles.slotRowHeader}>
        <Text style={styles.day} />
        {slotTimingUIElements}
      </View>
    );
  };

  toggleSlotCallback = (checkboxState, day, slotTiming) => {
    const {slotsInfo} = this.state;
    let dayTimingsList = slotsInfo[day];

    if (checkboxState) {
      if (dayTimingsList) {
        dayTimingsList.push(slotTiming);
      } else {
        slotsInfo[day] = [slotTiming];
      }
    } else {
      const index = dayTimingsList.indexOf(slotTiming);
      if (index > -1) {
        dayTimingsList.splice(index, 1);
      }
    }
  };

  renderSlotsInfo = () => {
    const {slotsInfo, slotTimings} = this.state;
    const days = Object.keys(slotsInfo);

    const slotsTable = [];

    days.forEach((day, index) => {
      const daySelectedSlots = slotsInfo[day] || [];

      const rowCheckboxes = slotTimings.map((slotTiming, index2) => {
        const isChecked = daySelectedSlots.includes(slotTiming);

        return (
          <DeliveryTimingCheckboxComponent
            day={day}
            index={index2}
            slotTiming={slotTiming}
            isChecked={isChecked}
            toggleSlotCallback={this.toggleSlotCallback}
            key={'c' + index2}
          />
        );
      });

      const rowDay = (
        <Text style={styles.day} key={'d' + index}>
          {day}
        </Text>
      );
      const rowElements = [rowDay, ...rowCheckboxes];
      const row = (
        <View style={styles.slotRow} key={'r' + index}>
          {rowElements}
        </View>
      );
      slotsTable.push(row);
    });

    return slotsTable;
  };

  handleUpdate = async () => {
    try {
      // starting loader
      // this.setState({isProcessing: true});

      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        return;
      }

      const {vendorId} = userInfo;
      const {slotsInfo} = this.state;
      const slots = JSON.stringify(slotsInfo);

      // preparing params
      const params = {
        vendorId,
        slots,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/addSlots',
        params,
        true,
        false,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          // refreshing data
          await this.fetchDeliverySlots();

          // stopping loader
          this.setState({isProcessing: false}, () => {
            showToast(message);
          });
        } else {
          // stopping loader
          this.setState({isProcessing: false}, () => {
            showToast(message);
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {isProcessing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent headerTitle="Farm Slots" nav={this.props.navigation} />

        <View style={styles.mainContainer}>
          <View>
            {this.renderSlotTimings()}
            {this.renderSlotsInfo()}
          </View>

          <TouchableHighlight
            style={styles.button}
            underlayColor="transparent"
            onPress={this.handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableHighlight>
        </View>

        {isProcessing && <ProcessLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f1f1',
  },
  mainContainer: {
    flex: 1,
  },
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: wp(1.5),
  // },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1.5),
  },
  slotRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1.5),
    backgroundColor: '#f65e83',
    paddingVertical: wp(2),
  },
  boldText: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginRight: wp(2),
  },
  button: {
    backgroundColor: '#f65e83',
    paddingVertical: wp(2),
    paddingHorizontal: wp(5),
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: hp(3),
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#fff',
  },
  day: {
    fontSize: wp(3),
    width: wp(10),
    paddingLeft: wp(2),
    fontWeight: '700',
  },
  slotText: {
    fontSize: wp(3),
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
  },
});
