import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';
import PickerModal from 'react-native-picker-modal-view';

//date Picker
import DateTimePicker from 'react-native-modal-datetime-picker';

//apis
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {KEYS, getData, clearData} from '../../../api/UserPreference';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../BasicStyles';

// Components
import HeaderComponent from '../VendorComponent/HeaderComponent';
import {showToast} from '../../../components/CustomToast';
import ProcessingLoader from '../../../components/ProcessingLoader';
import DeliveryTimingCheckboxComponent from '../../../components/DeliveryTimingCheckboxComponent';
// VectorIcons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import close from '../../../assets/icons/ic_close.png';

export default class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      slotTimings: [],
      slotsInfo: {},
      isAllTimeAvailable: false,
      processingData: false,

      StartTakingOrder: [
        {
          Id: 1,
          Name: 'Anytime',
          Value: 'Anytime',
        },
        {
          Id: 2,
          Name: '1 Hour Later',
          Value: '1 Hour Later',
        },
      ],
      selectedState: {
        Id: 1,
        Name: 'Anytime',
        Value: 'Anytime',
      },

      StopTakingOrder: [
        {
          Id: 1,
          Name: '1 Hour',
          Value: '1 Hour',
        },
        {
          Id: 2,
          Name: '1 Hour Before',
          Value: '1 Hour Before',
        },
      ],
      selectedState2: {
        Id: 1,
        Name: '1 Hour',
        Value: '1 Hour',
      },
    };
  }

  componentDidMount() {
    // this.fetchSlotsData();
    this.handlePastData();
  }

  fetchSlotsData = async () => {
    try {
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/viewSlots',
        params,
        true,
        false,
      );

      if (response) {
        this.setState({isLoading: false});
        const {success} = response;
        if (success) {
          const {slotsInfo, slotTimings} = response;

          this.setState({slotsInfo, slotTimings});
        } else {
          this.setState({slotsInfo: {}, slotTimings: []});
        }
      } else {
        this.setState({isLoading: false, slotsInfo: {}, slotTimings: []});
      }
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error.message);
    }
  };

  handlePastData = () => {
    let item = this.props.navigation.getParam('item', null);
    const {
      isAllTimeAvailable,
      startTaking,
      stopTaking,
      slotTimings,
      slotsInfo,
    } = item;

    console.log('Items', item);

    const selectedState = {
      Id: 1,
      Name: startTaking,
      Value: startTaking,
    };

    const selectedState2 = {
      Id: 1,
      Name: stopTaking,
      Value: stopTaking,
    };

    this.setState({
      isAllTimeAvailable,
      selectedState,
      selectedState2,
      slotTimings,
      slotsInfo,
    });
    // if (productVariants) {
    //   const Custom = productVariants.map((i) => ({
    //     CustomName: i.name,
    //     CustomPrice: i.price,
    //   }));

    //   this.setState({Custom});
    // }

    // if (addOns) {
    //   const AddOnes = addOns.map((i) => ({
    //     AddName: i.name,
    //     AddPrice: i.price,
    //   }));
    //   this.setState({AddOnes});
    // }
  };

  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
      console.log('there is an error in sign-out');
    }
  };
  handleAddProduct = async () => {
    const {
      slotsInfo,
      selectedState,
      selectedState2,
      isAllTimeAvailable,
    } = this.state;
    try {
      const timeLine = isAllTimeAvailable ? null : JSON.stringify(slotsInfo);

      const item = this.props.navigation.getParam('item', null);

      this.setState({processingData: true});

      const {
        Customization,
        AddonsData,
        foodType,
        userPic,
        itemName,
        price,
        description,
        gstId,
        productTypeId,
        productId,
      } = item;

      const custom = Customization.map((i) => ({
        name: i.CustomName,
        price: i.CustomPrice,
      }));

      const addOns = AddonsData.map((i) => ({
        name: i.AddName,
        price: i.AddPrice,
      }));

      const params = {
        productId,
        productTypeId,
        gstId,
        price: custom.length === 0 ? price : null,
        name: itemName,
        description,
        image: userPic,
        foodType,
        timeLine,
        addOns: JSON.stringify(addOns),
        custom: JSON.stringify(custom),
        startTakingHour: selectedState.Name,
        stopTakingHour: selectedState2.Name,
        isAllTimeAvailable,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/editItem',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        this.setState({processingData: false});
        if (success) {
          const refreshCallback = this.props.navigation.getParam(
            'refreshCallback',
            null,
          );
          this.setState({message, isLoading: false});
          showToast(message);
          this.props.navigation.popToTop();
          await refreshCallback();
        } else {
          showToast(message);
          this.setState({message, isLoading: false});
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

  // Start Taking Orders
  handleSelectStartTakingOrder = (selectedState) => {
    this.setState({selectedState});
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
      color: '#333',
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
            color="#999"
            style={basicStyles.marginLeftHalf}
          />
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  // Stop Taking Orders
  handleSelectStopTakingOrder = (selectedState2) => {
    this.setState({selectedState2});
    return selectedState2;
  };

  handleSelectStopTakingOrderClose = () => {
    const {selectedState2} = this.state;
    this.setState({selectedState2});
  };

  renderStopTakingOrderCategoryPicker = (disabled, selected, showModal) => {
    const {selectedState2} = this.state;
    const {Name} = selectedState2;

    const labelStyle = {
      color: '#333',
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
            color="#999"
            style={basicStyles.marginLeftHalf}
          />
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  renderSlotTimings = () => {
    const {slotTimings} = this.state;
    const slotTimingUIElements = slotTimings.map((item, index) => {
      const data = item.split('-');
      const startTime = data[0];
      const endTime = data[1];
      return (
        <View style={[styles.dayButton]}>
          <Text style={styles.slotItem}>{startTime}</Text>
          <Text style={styles.slotItem}>{endTime}</Text>
        </View>
      );
    });

    return (
      <View style={styles.slotRowHeader}>
        <Text style={[styles.day, {textAlign: 'center'}]}>All Slots</Text>
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
        // console.log('hello dayTimingsList', dayTimingsList);
      } else {
        slotsInfo[day] = [slotTiming];
        // console.log('hello dayTimingsList', dayTimingsList);
      }
    } else {
      const index = dayTimingsList.indexOf(slotTiming);
      if (index > -1) {
        dayTimingsList.splice(index, 1);
        // console.log('hello2 dayTimingsList', dayTimingsList);
      }
    }
  };

  renderSlotsInfo = () => {
    const {slotsInfo, slotTimings} = this.state;
    const days = Object.keys(slotsInfo);

    const slotsTable = [];

    days.forEach((day, index) => {
      // console.log('Day in For Each', day);
      const daySelectedSlots = slotsInfo[day] || [];
      // console.log(
      //   'daySelectedSlots in For Each',
      //   Array.isArray(daySelectedSlots),
      // );

      const rowCheckboxes = slotTimings.map((slotTiming, index2) => {
        // console.log('slotTiming in For Each', slotTiming);
        const isChecked = daySelectedSlots.includes(slotTiming);
        // let isChecked = daySelectedSlots.some(function (e) {
        //   return e.id === slotTiming.id;
        // });
        // console.log('isChecked in For Each', isChecked);
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
  render() {
    const state = this.state;
    const {
      StartTakingOrder,
      selectedState,
      StopTakingOrder,
      selectedState2,
      isAllTimeAvailable,
    } = this.state;

    return (
      <SafeAreaView style={[basicStyles.container, {backgroundColor: '#fff'}]}>
        <View
          style={[
            basicStyles.flexOne,
            basicStyles.justifyCenter,
            // basicStyles.padding,
          ]}>
          <HeaderComponent
            headerTitle="Edit Product"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[styles.container]}>
            <View style={styles.available24}>
              <Text style={basicStyles.headingLarge}>
                Product Available 24*7
              </Text>
              <Switch
                trackColor={{false: '#ccc8', true: '#ccc8'}}
                thumbColor={'#f57c00'}
                ios_backgroundColor="#ccc8"
                style={[styles.favButtonContainer]}
                onValueChange={(e) => {
                  this.setState({isAllTimeAvailable: e});
                }}
                value={this.state.isAllTimeAvailable}
              />
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.paddingTop,
                basicStyles.paddingHorizontal,
                basicStyles.alignCenter,
              ]}>
              <Text style={basicStyles.headingLarge}>Order Schedule</Text>
              <Ionicons
                size={21}
                name={'ios-information-circle'}
                color="#999"
                style={basicStyles.marginLeftHalf}
              />
            </View>
            <Text
              style={[
                basicStyles.text,
                basicStyles.paddingHorizontal,
                basicStyles.alignCenter,
                basicStyles.paddingHalfTop,
                basicStyles.paddingBottom,
              ]}>
              Customize your delivery schedule here. The time you set here is
              the time when your product will be delivered to the customers.
            </Text>

            {isAllTimeAvailable ? null : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{padding: wp(2)}}
              >
                <View>
                  <View style={styles.timeSlotContainer}>
                    {this.renderSlotTimings()}
                  </View>
                  <View>{this.renderSlotsInfo()}</View>
                </View>
              </ScrollView>
            )}

            <View style={styles.orderTaking}>
              <View
                style={[styles.orderTakingPart, basicStyles.marginRightHalf]}>
                <Text style={basicStyles.textExtraLight}>
                  START TAKING ORDERS
                </Text>
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
                style={[styles.orderTakingPart, basicStyles.marginLeftHalf]}>
                <Text style={basicStyles.textExtraLight}>
                  STOP TAKING ORDERS
                </Text>
                <PickerModal
                  items={StopTakingOrder}
                  selected={selectedState2}
                  onSelected={this.handleSelectStopTakingOrder}
                  onClosed={this.handleSelectStopTakingOrderClose}
                  backButtonDisabled
                  showToTopButton={true}
                  // showAlphabeticalIndex={true}
                  autoGenerateAlphabeticalIndex={false}
                  searchPlaceholderText="Search"
                  renderSelectView={this.renderStopTakingOrderCategoryPicker}
                />
              </View>
            </View>
          </View>
          <TouchableHighlight
            onPress={this.handleAddProduct}
            style={[styles.finishButton]}>
            <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
              Finish
            </Text>
          </TouchableHighlight>
        </View>
        {this.state.processingData && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mailContainer: {
    flex: 1,
  },
  orderTaking: {
    flexDirection: 'row',
    paddingHorizontal: wp(3),
    paddingVertical: wp(4),
  },
  orderTakingPart: {
    flex: 1,
  },

  timeSlotContainer: {
    // flex: 1,
    backgroundColor: '#f5f5f5',
    // padding: wp(1.5),
    // flexDirection: 'row',
    marginBottom: wp(2),
    alignItems: 'center',
    paddingTop: wp(1.2),
    marginTop: wp(2),
  },

  title: {
    color: '#666',
    width: wp(10),
    fontSize: wp(3.8),
  },

  addSlot: {
    borderWidth: 1,
    borderColor: '#e5910c',
    height: wp(8),
    width: wp(8),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },

  available24: {
    backgroundColor: '#fff',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#f5f5f5',
    borderTopWidth: 4,
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 4,
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
    margin: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
  },
  input: {
    fontSize: wp(3),
    marginLeft: wp(2),
  },
  dayButton: {
    width: wp(19),
    alignItems: 'center',
    padding: wp(0.5),
    borderRadius: 5,
  },
  slotItem: {
    fontSize: wp(3),
    borderWidth: 1,
    borderColor: '#ccc4',
    padding: wp(0.8),
    margin: wp(0.5),
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  times: {
    backgroundColor: '#fff',
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    borderWidth: 1,
    borderColor: '#ccc8',
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

  header: {backgroundColor: '#f65e83'},
  // text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#E7E6E1'},
  dayEarning: {
    fontSize: wp(3),
    textAlign: 'center',
    // marginLeft: wp(2),
    // marginTop: hp(2),
  },
  addIcon: {
    width: 25,
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: 'row',
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
  addButton: {
    position: 'absolute',
    // bottom: hp(2),
    marginTop: hp(26.8),
    right: wp(2),
    backgroundColor: '#f6416c',
    borderRadius: 26,
  },
  editIcon: {
    height: hp(6),
    width: hp(6),
    backgroundColor: '#f65e83',
    textAlign: 'center',
    lineHeight: hp(6),
    borderRadius: hp(3),
  },
  dayContainerStyle: {
    // backgroundColor: '#000'
  },
  iconRow: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(3),
  },
  multiLineInputDesign: {
    fontSize: wp(3.5),
    flex: 1,
    textAlignVertical: 'top',
  },
  separator: {
    width: 5,
  },
  inputContainer: {
    height: hp(5.5),
    justifyContent: 'center',
    paddingHorizontal: wp(2),
    marginBottom: wp(3),
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    marginTop: wp(3),
  },
  finishButton: {
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F57C00',
    margin: wp(3),
    borderRadius: 10,
  },
  time: {
    fontSize: wp(3),
    // width: wp(10),
    paddingLeft: wp(2),
    fontWeight: '700',
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
    color: '#000',
    fontWeight: '700',
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1.5),
  },
  slotRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1.5),
    // backgroundColor: '#f65e83',
    paddingVertical: wp(2),
  },
});
