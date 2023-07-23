import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import FlatListPicker from 'react-native-flatlist-picker';
import {Picker} from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
// Permission
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
//screen SafeAreaView
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import SafeAreaView from 'react-native-safe-area-view';

//Apis
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData, storeData} from '../../api/UserPreference';

// Native Components
import ImagePicker from 'react-native-image-picker';
import RadioForm from 'react-native-simple-radio-button';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';

//Styles
import basicStyles from '../vendorScreens/BasicStyles';

// VectorIcons
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Images
import upload_image from '../../assets/images/upload_image.png';
import CustomLoader from '../../components/CustomLoader';
import {showToast} from '../../components/CustomToast';

var radio_props = [
  {label: 'Veg', value: 'veg'},
  {label: 'Non-Veg', value: 'non-veg'},
];
var radio_props = [
  {label: 'Veg', value: 'veg'},
  {label: 'Non-Veg', value: 'non-veg'},
];

export default class AddGalleryItemsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CustomName: '',
      CustomPrice: '',
      AddName: '',
      AddPrice: '',
      Customization: [{name: '', price: ''}],
      Custom: [],
      AddOns: [{name: '', price: ''}],
      Addones: [],
      foodType: 'veg',
      productType: [],
      productTypeId: -1,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.handleCategoryList();
  }

  handleCategoryList = async () => {
    try {
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/productTypeList',
        params,
        true,
        false,
      );

      console.log('====================================');
      console.log(response);
      console.log('====================================');
      if (response) {
        this.setState({isLoading: false});
        const {productTypes} = response;
        if (productTypes) {
          const productType = productTypes.map(item => ({
            label: item.value,
            value: item.key,
          }));
          this.setState({productType, productTypeId: productTypes[0].key});
        } else {
          this.setState({productType: [], productTypeId: -1});
        }
      } else {
        this.setState({isLoading: false, productType: [], productTypeId: -1});
      }
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error.message);
    }
  };

  handleCustomization = () => {
    let {CustomName, CustomPrice, Custom} = this.state;
    let mnc = {CustomName, CustomPrice};

    Custom.push(mnc);
    console.log(Custom);

    //console.log(important);
    this.setState({Custom});

    this.removeCustoms();
  };

  removeCustoms = () => {
    this.setState({Customization: [{name: '', price: ''}]});
  };

  renderContactForm = item => {
    const {Customization} = this.state;
    // console.log(importantContacts);

    return Customization.map((item, index) => {
      const handleNameChange = newName => {
        item.name = newName;
        this.setState({CustomName: newName});
      };

      const handlePriceChange = newPrice => {
        item.price = newPrice;
        this.setState({CustomPrice: newPrice});
      };

      return (
        <View
          style={[
            basicStyles.directionRow,
            // basicStyles.marginBottom,
            basicStyles.alignCenter,
          ]}
          key={index}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#666"
            style={styles.input}
            value={item.name}
            onChangeText={handleNameChange}
          />
          <TextInput
            placeholder="Price"
            placeholderTextColor="#666"
            maxLength={10}
            keyboardType="numeric"
            style={styles.input1}
            value={item.price ? item.price.toString() : null}
            onChangeText={handlePriceChange}
          />
        </View>
      );
    });
  };

  handleAddOns = () => {
    let {AddName, AddPrice, Addones} = this.state;
    let mnc = {AddName, AddPrice};

    Addones.push(mnc);
    console.log(Addones);
    this.setState({Addones});
    this.removeAddOns();
  };
  removeAddOns = () => {
    this.setState({AddOns: [{name: '', price: ''}]});
  };

  renderAddOnsForm = item => {
    const {AddOns} = this.state;
    // console.log(importantContacts);

    return AddOns.map((item, index) => {
      const handleNameChange = newName => {
        item.name = newName;
        this.setState({AddName: newName});
      };

      const handlePriceChange = newPrice => {
        item.price = newPrice;
        this.setState({AddPrice: newPrice});
      };

      return (
        <View
          style={[
            basicStyles.directionRow,
            // basicStyles.marginBottom,
            basicStyles.alignCenter,
          ]}
          key={index}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#666"
            style={styles.input}
            value={item.name}
            onChangeText={handleNameChange}
          />
          <TextInput
            placeholder="Price"
            placeholderTextColor="#666"
            maxLength={10}
            keyboardType="numeric"
            style={styles.input1}
            value={item.price ? item.price.toString() : null}
            onChangeText={handlePriceChange}
          />
        </View>
      );
    });
  };

  renderItem = ({item}) => (
    <View
      style={[
        basicStyles.directionRow,
        // basicStyles.marginBottom,
        basicStyles.alignCenter,
      ]}>
      <Text style={styles.inputFFF}>{item.CustomName}</Text>

      <Text style={styles.inputFFF2}>
        {item.CustomPrice ? item.CustomPrice.toString() : null}
      </Text>

      <TouchableOpacity
        onPress={() => this.removeCustomItem(item)}
        style={styles.addField2}>
        <MaterialIcons
          size={16}
          name={'close'}
          color="#fff"
          style={styles.addIcon}
        />
      </TouchableOpacity>
    </View>
  );

  removeCustomItem = item => {
    const {Custom} = this.state;
    let temper = Custom.indexOf(item);
    Custom.splice(temper, 1);
    this.setState({Custom});
    console.log('Custom product deleted', Custom);
  };

  renderItems = ({item}) => (
    <View
      style={[
        basicStyles.directionRow,
        // basicStyles.marginBottom,
        basicStyles.alignCenter,
      ]}>
      <Text style={styles.inputFFF}>{item.AddName}</Text>

      <Text style={styles.inputFFF2}>
        {item.AddPrice ? item.AddPrice.toString() : null}
      </Text>
      <TouchableOpacity
        onPress={() => this.removeAddonItem(item)}
        style={styles.addField2}>
        <MaterialIcons
          size={16}
          name={'close'}
          color="#fff"
          style={styles.addIcon}
        />
      </TouchableOpacity>
    </View>
  );
  removeAddonItem = item => {
    const {Addones} = this.state;
    let temp = Addones.indexOf(item);
    Addones.splice(temp, 1);
    this.setState({Addones});
    console.log('AddOns Product Deleted', Addones);
  };

  handleFoodTypeChange = foodType => {
    this.setState({foodType});
  };

  handleProductTypeChange = productTypeId => {
    this.setState({productTypeId});
  };

  handleTimeSlot = () => {
    const {Custom, Addones, foodType, productTypeId} = this.state;

    if (productTypeId === -1) {
      // Alert.alert('Alert!', 'Please Enter Short Description', [{text: 'OK'}], {
      //   cancelable: false,
      // });
      showToast('Please Select Product Type');
      return;
    }

    let item = this.props.navigation.getParam('item', null);
    const refreshCall = this.props.navigation.getParam('refreshCall', null);

    item.Customization = Custom;
    item.AddonsData = Addones;
    item.foodType = foodType;
    item.productTypeId = productTypeId;

    this.props.navigation.navigate('AddProduct', {
      item,
      refreshCallback: refreshCall,
    });
  };

  itemSeparator = () => <View style={styles.separator} />;
  keyCustom = (item, index) => index.toString();
  keyAddons = (item, index) => index.toString();

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {Customization, Custom, AddOns, productType, Addones} = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={[basicStyles.container]}>
          <HeaderComponent
            headerTitle="Add Menu"
            nav={this.props.navigation}
            navAction="back"
          />
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{borderTopWidth: 4, borderTopColor: '#f5f5f5'}}>
            <View style={[basicStyles.mainContainer, basicStyles.padding]}>
              <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                Product Type
              </Text>
              <RadioForm
                radio_props={productType}
                onPress={this.handleProductTypeChange}
                formHorizontal={true}
                labelHorizontal={true}
                animation={true}
                buttonSize={10}
                buttonOuterSize={20}
                buttonColor={'#ccc'}
                selectedButtonColor={'#f57c00'}
                labelColor={'#ccc'}
                labelStyle={styles.radioButtonLabel}
                style={styles.radioButton}
              />

              <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                Food Type
              </Text>
              <RadioForm
                radio_props={radio_props}
                onPress={this.handleFoodTypeChange}
                formHorizontal={true}
                labelHorizontal={true}
                animation={true}
                buttonSize={10}
                buttonOuterSize={20}
                buttonColor={'#ccc'}
                selectedButtonColor={'#f57c00'}
                labelColor={'#ccc'}
                labelStyle={styles.radioButtonLabel}
                style={styles.radioButton}
              />

              <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                Customization
              </Text>

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <View style={[styles.inputContainer, basicStyles.flexOne]}>
                  <FlatList
                    data={Customization}
                    renderItem={this.renderContactForm}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    //numColumns={2}
                    ItemSeparatorComponent={this.itemSeparator}
                  />
                </View>
                <TouchableHighlight
                  style={styles.addField}
                  onPress={this.handleCustomization}>
                  <Feather
                    size={16}
                    name={'plus'}
                    color="#fff"
                    style={styles.addIcon}
                  />
                </TouchableHighlight>
              </View>

              <FlatList
                data={Custom}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                //numColumns={2}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.containerStyle}
              />
              <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                Add Ons
              </Text>

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <View style={[styles.inputContainer, basicStyles.flexOne]}>
                  <FlatList
                    data={AddOns}
                    renderItem={this.renderAddOnsForm}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    //numColumns={2}
                    ItemSeparatorComponent={this.itemSeparator}
                  />
                </View>
                <TouchableHighlight
                  style={styles.addField}
                  onPress={this.handleAddOns}>
                  <Feather
                    size={16}
                    name={'plus'}
                    color="#fff"
                    style={styles.addIcon}
                  />
                </TouchableHighlight>
              </View>

              <FlatList
                data={Addones}
                renderItem={this.renderItems}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                //numColumns={2}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.containerStyle}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        <TouchableOpacity
          style={styles.postButton}
          underlayColor="#f57c0080"
          onPress={this.handleTimeSlot}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Add to Menu
          </Text>
          <AntDesign
            size={20}
            name={'checkcircle'}
            color="#fff"
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  pickerGst: {
    position: 'relative',
    marginRight: wp(1),
  },
  pickerType: {
    position: 'relative',
    marginLeft: wp(1),
  },
  mContainer: {
    borderWidth: 0,
    borderColor: '#f5f5f5',
    flex: 1,
    height: hp(5.5),
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  inputContainer: {
    borderRadius: 3,
    height: hp(5.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(2),
  },
  multiLineInputContainer: {
    borderRadius: 3,
    paddingHorizontal: wp(2),
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(2),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  inputDesign: {
    fontSize: wp(3.5),
    height: hp(5.5),
    flex: 1,
    backgroundColor: '#e2e2e280',
    paddingLeft: wp(2),
  },
  multiLineInputDesign: {
    height: hp(10),
    fontSize: wp(3.5),
    flex: 1,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#f57c00',
    paddingHorizontal: wp(10),
    paddingVertical: wp(2.5),
    alignItems: 'center',
    margin: wp(3),
    height: hp(6),
    justifyContent: 'center',
    borderRadius: 10,
  },
  addIcon: {
    position: 'absolute',
    right: wp(3),
    // top: 0,
  },
  addField: {
    backgroundColor: '#f57c00',
    height: hp(5.5),
    marginBottom: wp(2),
    width: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
    borderRadius: 3,
  },
  addField2: {
    backgroundColor: '#f57c00',
    height: hp(5.5),
    // marginBottom: wp(2),
    width: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
    borderRadius: 3,
  },
  radioButtonLabel: {
    fontSize: wp(3.2),
    color: '#444',
    marginLeft: wp(1),
    marginRight: wp(10),
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: hp(1.5),
  },
  imagePreview: {
    width: wp(25),
    height: hp(11),
    marginRight: wp(2),
    marginTop: wp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  preImage: {
    width: '100%',
    aspectRatio: 1 / 0.9,
    borderRadius: 3,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    height: hp(3.5),
  },
  input: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginRight: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f5f5f5',
  },
  input1: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f5f5f5',
  },
  inputFFF: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginRight: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f5f5f5',
    lineHeight: hp(5.5),
  },
  inputFFF2: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f5f5f5',
    lineHeight: hp(5.5),
  },

  separator: {
    height: wp(2),
  },
  containerStyle: {
    marginBottom: hp(1.5),
  },

  productTypeContainer: {
    paddingHorizontal: wp(2),
    backgroundColor: '#f5f5f5',
    lineHeight: hp(5.5),
    marginBottom: wp(2),
  },
  flatListPicker: {
    width: wp(94),
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: wp(1),
    left: 0,
    borderWidth: 1,
    borderColor: '#999',
  },
  pickerInput: {
    borderWidth: 0,
    borderColor: '#f5f5f5',
    width: wp(6),
    height: hp(5.5),
    flexDirection: 'row',
    padding: 5,
    position: 'relative',
  },

  viewStyle: {
    marginBottom: wp(3),
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    backgroundColor: '#e2e2e280',
    borderRadius: 5,
  },

  viewStyle2: {
    marginBottom: wp(3),
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth: 1,
    backgroundColor: '#e2e2e280',
    borderRadius: 5,
  },
  itemStyle: {
    fontSize: 10,
    color: '#333',
  },
  pickerStyle: {
    width: '100%',
    height: 40,
    color: '#333',
    fontSize: 12,
  },
  textStyle: {
    fontSize: 12,
  },
  mLeft: {
    marginLeft: wp(1.5),
  },
  mRight: {
    marginRight: wp(1.5),
  },
});
