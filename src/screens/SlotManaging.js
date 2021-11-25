import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

//date Picker
import DateTimePicker from 'react-native-modal-datetime-picker';

//apis

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// Styles
import basicStyles from '../styles/BasicStyles';

// Components

import ProcessingLoader from '../components/ProcessingLoader';
// VectorIcons
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlatList} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import close from '../assets/icons/ic_close.png';

import {showToast} from '../components/CustomToast';
import CustomLoader from '../components/CustomLoader';
import ProcessLoader from '../components/ProcessLoader';
import DeliveryTimingCheckboxComponent from '../components/DeliveryTimingCheckboxComponent';
import HeaderComponent from '../screens/vendorScreens/VendorComponent/HeaderComponent';
// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// User Preference
import {KEYS, getData, clearData} from '../api/UserPreference';

export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: '',
      endTime: '',
      deliveryTime: '',
      takeAwayTime: '',
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      item: [],
      days: [],
      timeLine: [],
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      isDeliveryPickerVisible: false,
      isTakePickerVisible: false,
      tableHead: [
        'Days',
        'Start Time',
        'End Time',
        'Delivery Time',
        'Take Away Time',
      ],
      message: '',
      newDays: [],
      selectedId: null,
      SlDays: [],
      temp: 0,
      newTemp: 0,
      isSelectedDay: false,
      isSelectedDayId: -1,
      processingData: false,
    };
  }

  handleDataForm = async () => {
    const editMenuData = this.props.navigation.getParam('editMenuData', null);
    const {timeLine} = this.state;
    const addData = this.props.navigation.getParam('addMenuData', null);

    //validation
    if (timeLine.length === 0) {
      Alert.alert('', 'Please Enter TimeLine Data ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    this.setState({processingData: true});
    if (!(addData === null)) {
      if (addData) {
        const {
          Addones,
          Custom,
          FoodCategory,
          Qty,
          RestraType,
          gst,
          itemName,
          shortDescription,
          userPic,
          FoodType,
          price,
        } = addData;

        const params = {
          categoryId: FoodCategory,
          qty: Qty,
          productTypeId: RestraType,
          gstId: gst,
          price,
          name: itemName,
          description: shortDescription,
          image: userPic,
          foodType: FoodType,
          timeLine: JSON.stringify(timeLine),
          addOns: JSON.stringify(Addones),
          custom: JSON.stringify(Custom),
        };
        const response = await makeRequest(
          BASE_URL + 'api/Vendors/addItem',
          params,
          true,
          false,
        );
        if (response) {
          const {success, message, isAuthTokenExpired} = response;
          this.setState({processingData: false});
          if (success) {
            // const {name, expertise, qualification, image, languages} = response;
            // const { newOrders } = response;
            const refreshCallback = this.props.navigation.getParam(
              'refreshCallback',
              null,
            );
            this.setState({message, isLoading: false});
            showToast(message);
            if (refreshCallback) {
              this.props.navigation.popToTop();
              refreshCallback(message);
            }
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
      }
    } else {
      try {
        if (editMenuData) {
          const {
            productId,
            Addones,
            Custom,
            FoodCategory,
            Qty,
            RestraType,
            gst,
            itemName,
            shortDescription,
            userPic,
            FoodType,
            price,
          } = editMenuData;

          const params = {
            productId,
            categoryId: FoodCategory,
            qty: Qty,
            productTypeId: RestraType,
            gstId: gst,
            price,
            name: itemName,
            description: shortDescription,
            image: userPic,
            foodType: FoodType,
            timeLine: JSON.stringify(timeLine),
            addOns: JSON.stringify(Addones),
            custom: JSON.stringify(Custom),
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
              // const {name, expertise, qualification, image, languages} = response;
              // const { newOrders } = response;
              const refreshCallback = this.props.navigation.getParam(
                'refreshCallback',
                null,
              );
              this.setState({message, isLoading: false});
              showToast(message);
              if (refreshCallback) {
                this.props.navigation.popToTop();
                refreshCallback(message);
              }
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
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  showStartTimePicker = () => {
    this.setState({isTimePickerVisible: true});
  };
  hideStartTimePicker = () => {
    this.setState({isTimePickerVisible: false});
  };
  showEndTimePicker = () => {
    this.setState({isDatePickerVisible: true});
  };
  hideEndTimePicker = () => {
    this.setState({isDatePickerVisible: false});
  };
  showDeliveryTimePicker = () => {
    this.setState({isDeliveryPickerVisible: true});
  };
  hideDeliveryTimePicker = () => {
    this.setState({isDeliveryPickerVisible: false});
  };
  showTakeTimePicker = () => {
    this.setState({isTakePickerVisible: true});
  };
  hideTakeTimePicker = () => {
    this.setState({isTakePickerVisible: false});
  };

  handleStartTimeChange = (startTime) => {
    const options = {hour: '2-digit', minute: '2-digit'};
    startTime = startTime.toLocaleTimeString('en-US', options);
    this.setState({startTime, isTimePickerVisible: false});
  };
  handleEndTimeChange = (endTime) => {
    const options = {hour: '2-digit', minute: '2-digit'};
    endTime = endTime.toLocaleTimeString('en-US', options);
    this.setState({endTime, isDatePickerVisible: false});
  };
  handleDeliveryTimeChange = (deliveryTime) => {
    this.setState({deliveryTime});
  };
  handleTakeTimeChange = (takeAwayTime) => {
    this.setState({takeAwayTime});
  };
  handleAddItems = () => {
    const {startTime, endTime, deliveryTime, takeAwayTime, days} = this.state;
    if (startTime.trim() === '') {
      Alert.alert('', 'Please enter Start Time Line ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (endTime.trim() === '') {
      Alert.alert('', 'Please enter End Time Line ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (deliveryTime.trim() === '') {
      Alert.alert('', 'Please enter Delivery Time Line ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (takeAwayTime.trim() === '') {
      Alert.alert('', 'Please enter TakeAway Time Line ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (days.length === 0) {
      Alert.alert('', 'Please enter Days Time Line ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    const temper = {startTime, endTime, deliveryTime, takeAwayTime, days};
    const {timeLine} = this.state;
    timeLine.push(temper);
    this.setState({timeLine});

    this.handleStateReset();
  };

  removeItmeLine = (item) => {
    const {timeLine} = this.state;
    let temper = timeLine.indexOf(item);
    timeLine.splice(temper, 1);
    this.setState({timeLine});
  };
  handleStateReset = () => {
    this.setState({
      startTime: null,
      endTime: null,
      deliveryTime: null,
      takeAwayTime: null,
      isDatePickerVisible: false,
      isTimePickerVisible: false,
      isDeliveryPickerVisible: false,
      isTakePickerVisible: false,
      temp: null,
      newTemp: null,
    });
    this.setState({days: [], SlDays: []});
  };
  handleMoreInfo = (moreInfo) => () => {
    this.setState((prevState) => ({[moreInfo]: !prevState[moreInfo]}));
  };
  renderItem = ({item}) => {
    const {SlDays} = this.state;
    const {moreInfo} = this.state;

    //this.setState({ newTemp });
    return (
      <View>
        <View
          style={[
            basicStyles.directionRow,
            // basicStyles.marginBottom,
            basicStyles.alignCenter,
          ]}>
          {/* <Text style={styles.inputFFF2}>{item.days}</Text> */}
          <Text
            style={styles.inputFFF2}
            onPress={this.handleMoreInfo('moreInfo')}>
            {item.days}
          </Text>

          <Text style={styles.inputFFF2}>{item.startTime}</Text>
          <Text style={styles.inputFFF2}>{item.endTime}</Text>
          <Text style={styles.inputFFF2}>{item.deliveryTime}</Text>
          <TouchableOpacity
            style={[
              styles.inputFFF2,
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.alignCenter,
            ]}
            onPress={() => this.removeItmeLine(item)}>
            <Text style={{fontSize: wp(3)}}>{item.takeAwayTime}</Text>
            <Image source={close} style={[styles.iconRow]} />
          </TouchableOpacity>
        </View>
        {moreInfo && (
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.lightBackgroundColor,
              basicStyles.padding,
              basicStyles.alignCenter,
            ]}>
            <Text>{item.days}</Text>
          </View>
        )}
      </View>
    );
  };
  renderSelectDays = ({item}) => {
    const selectedDayStyle = {
      ...styles.dayButton,
      color: '#f65e83',
      backgroundColor: '#f65e83',
    };
    const {isSelectedDay, isSelectedDayId, days} = this.state;
    const temp = days.indexOf(item);

    // if (isSelectedDay === false) {
    //   this.setState({ isSelectedDay: true });
    // } else {
    //   this.setState({ isSelectedDay: false });
    // };
    return (
      <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
        <TouchableHighlight
          style={[
            isSelectedDayId !== temp ? selectedDayStyle : styles.dayButton,
          ]}
          onPress={() => this.selectDaysCallBack(item)}
          underlayColor="#f65e83">
          <Text>{item}</Text>
        </TouchableHighlight>
      </View>
    );
  };
  selectDaysCallBack = (item) => {
    const {days, SlDays} = this.state;
    const slDay = item;
    const newDay = '/';
    const nDay = slDay.concat(newDay);

    const value = item;
    SlDays.push(nDay);

    days.push(value);

    this.setState({days});
  };

  render() {
    const state = this.state;

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View
          style={[
            basicStyles.flexOne,
            basicStyles.justifyCenter,
            // basicStyles.padding,
          ]}>
          <HeaderComponent
            headerTitle="Add Product"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[styles.container]}>
            <View style={[basicStyles.directionRow, basicStyles.paddingHalf]}>
              <View style={[basicStyles.directionRow, basicStyles.flexOne]}>
                <TouchableOpacity
                  onPress={this.showStartTimePicker}
                  style={styles.inputView}>
                  <View
                    style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                    <Ionicons
                      size={21}
                      name={'time-outline'}
                      color="#f65e83"
                      style={styles.addIcon}
                    />
                    <Text style={styles.dayEarning}>
                      Start Time: {this.state.startTime}
                    </Text>
                    <DateTimePicker
                      style={styles.datePickerContainer}
                      isVisible={this.state.isTimePickerVisible}
                      placeholder="Select Date"
                      mode="time"
                      onConfirm={this.handleStartTimeChange}
                      onCancel={this.hideStartTimePicker}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[basicStyles.directionRow, basicStyles.flexOne]}>
                <TouchableOpacity
                  onPress={this.showEndTimePicker}
                  style={styles.inputView}>
                  <View
                    style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                    <Ionicons
                      size={21}
                      name={'time-outline'}
                      color="#f65e83"
                      style={styles.addIcon}
                    />
                    <Text style={styles.dayEarning}>
                      End Time: {this.state.endTime}
                    </Text>
                    <DateTimePicker
                      style={styles.datePickerContainer}
                      isVisible={this.state.isDatePickerVisible}
                      placeholder="Select Date"
                      mode="time"
                      onConfirm={this.handleEndTimeChange}
                      onCancel={this.hideEndTimePicker}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[basicStyles.directionRow, basicStyles.paddingHalf]}>
              <View style={[basicStyles.directionRow, basicStyles.flexOne]}>
                <TouchableOpacity
                  onPress={this.showDeliveryTimePicker}
                  style={styles.inputView}>
                  <View
                    style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                    <Ionicons
                      size={21}
                      name={'time-outline'}
                      color="#f65e83"
                      style={styles.addIcon}
                    />
                    {/* <Text style={styles.dayEarning}>
                      Delivery Time: {this.state.deliveryTime}
                    </Text>
                    <DateTimePicker
                      style={styles.datePickerContainer}
                      isVisible={this.state.isDeliveryPickerVisible}
                      placeholder="Select Date"
                      mode="time"
                      // display="spinner" 
                      timeZoneOffsetInMinutes={60}
                      onConfirm={this.handleDeliveryTimeChange}
                      onCancel={this.hideDeliveryTimePicker}
                    /> */}
                    <TextInput
                      placeholder="Delivery Time"
                      multiline={true}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      style={styles.multiLineInputDesign}
                      value={this.state.deliveryTime}
                      onChangeText={this.handleDeliveryTimeChange}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[basicStyles.directionRow, basicStyles.flexOne]}>
                <TouchableOpacity
                  onPress={this.showTakeTimePicker}
                  style={styles.inputView}>
                  <View
                    style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                    <Ionicons
                      size={21}
                      name={'time-outline'}
                      color="#f65e83"
                      style={styles.addIcon}
                    />
                    {/* <Text style={styles.dayEarning}>
                      Take Time: {this.state.takeAwayTime}
                    </Text>
                    <DateTimePicker
                      style={styles.datePickerContainer}
                      isVisible={this.state.isTakePickerVisible}
                      placeholder="Select Date"
                      mode="time"
                      timeZoneOffsetInMinutes={60}
                      onConfirm={this.handleTakeTimeChange}
                      onCancel={this.hideTakeTimePicker}
                    /> */}
                    <TextInput
                      placeholder="Take Away Time"
                      multiline={true}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                      style={styles.multiLineInputDesign}
                      value={this.state.takeAwayTime}
                      onChangeText={this.handleTakeTimeChange}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <FlatList
                data={this.state.day}
                renderItem={this.renderSelectDays}
                showsVerticalScrollIndicator={false}
                horizontal={true}
                keyExtractor={(item) => item.id}
                //numColumns={2}
                // ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.dayContainerStyle}
              />
            </View>
            <TouchableHighlight
              onPress={this.handleAddItems}
              style={[
                basicStyles.button,
                basicStyles.pinkBgColor,
                basicStyles.alignSelfCenter,
                basicStyles.marginBottom,
              ]}>
              <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                Update Time Line
              </Text>
            </TouchableHighlight>

            {/* <TouchableHighlight
              onPress={this.handleAddTimeLine}
              style={styles.addButton}
              underlayColor="#f65e8380">
              <Entypo
                size={45}
                name={'circle-with-plus'}
                color="#fff"
                style={styles.editIcon}
              />
            </TouchableHighlight> */}

            <View style={[basicStyles.flexOne]}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#ffffff80'}}>
                <Row
                  data={state.tableHead}
                  style={styles.header}
                  textStyle={[styles.text, basicStyles.whiteColor]}
                />
              </Table>
              {/* <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderWidth: 0.5, borderColor: '#f65e83' }}>
                  <Rows data={this.state.tableData} textStyle={styles.text} />
                </Table>
              </ScrollView> */}
              <View>
                <FlatList
                  data={this.state.timeLine}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  //numColumns={2}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={[basicStyles.marginBottom]}
                />
              </View>
            </View>
          </View>
          <TouchableHighlight
            onPress={this.handleDataForm}
            style={[basicStyles.button, basicStyles.pinkBgColor]}>
            <Text style={[basicStyles.text, basicStyles.whiteColor]}>
              Submit
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
    borderColor: '#ccc',
    borderWidth: 1,
    width: wp(14),
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
});
