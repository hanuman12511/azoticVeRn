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

// Images
import upload_image from '../../assets/images/upload_image.png';
import CustomLoader from '../../components/CustomLoader';

var radio_props = [
  {label: 'Veg', value: 'veg'},
  {label: 'Non-Veg', value: 'non-veg'},
];
// var radio_ProductType = [
//   { label: 'Farm', value: 'Farm', key: '2' },
//   { label: 'Restaurant', value: 'Restaurant', key: '1' },
// ];

export default class AddGalleryItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      CustomName: '',
      CustomPrice: '',
      AddName: '',
      AddPrice: '',
      Customization: [{name: '', price: ''}],
      Custom: [],
      AddOns: [{name: '', price: ''}],
      Addones: [],
      tableHead: ['Name', 'Price'],
      CategoryList: [],
      gstType: [],
      productTypes: [],
      itemName: '',
      Qty: '',
      shortDescription: '',
      RestraType: '',
      FoodType: 'veg',
      FoodCategory: '',
      userPic: '',
      imageData: '',
      userImage: '',
      gst: '',
      selectedCat: '',
      price: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.handleCategoryList();
  }

  handleCategoryList = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO, null);
      const {vendorCode} = userInfo;
      const params = {vendorCode};
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/categoryList',
        params,
        true,
        false,
      );
      const responseB = await makeRequest(
        BASE_URL + 'api/Vendors/productTypeList',
        params,
        true,
        false,
      );
      const responseC = await makeRequest(
        BASE_URL + 'api/Vendors/gstList',
        params,
        true,
        false,
      );

      if (response && responseB && responseC) {
        this.setState({isLoading: false});
        const {categories} = response;
        const {productTypes} = responseB;
        const {gst} = responseC;
        this.setState({CateGoryList: categories});
        this.setState({productTypes});
        this.setState({gstType: gst});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleCustomization = () => {
    let {Customization, CustomName, CustomPrice, Custom} = this.state;
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

  renderContactForm = (item) => {
    const {Customization} = this.state;
    // console.log(importantContacts);

    return Customization.map((item, index) => {
      const handleNameChange = (newName) => {
        item.name = newName;
        this.setState({CustomName: newName});
      };

      const handlePriceChange = (newPrice) => {
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
  renderAddOnsForm = (item) => {
    const {AddOns} = this.state;
    // console.log(importantContacts);

    return AddOns.map((item, index) => {
      const handleNameChange = (newName) => {
        item.name = newName;
        this.setState({AddName: newName});
      };

      const handlePriceChange = (newPrice) => {
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

      <TouchableHighlight
        onPress={() => this.removeCustomItem(item)}
        style={styles.addField2}>
        <Feather
          size={16}
          name={'delete'}
          color=" #fff"
          style={styles.addIcon}
        />
      </TouchableHighlight>
    </View>
  );
  removeCustomItem = (item) => {
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
      <TouchableHighlight
        onPress={() => this.removeAddonItem(item)}
        style={styles.addField2}>
        <Feather
          size={16}
          name={'delete'}
          color=" #fff"
          style={styles.addIcon}
        />
      </TouchableHighlight>
    </View>
  );
  removeAddonItem = (item) => {
    const {Addones} = this.state;
    let temp = Addones.indexOf(item);
    Addones.splice(temp, 1);
    this.setState({Addones});
    console.log('AddOns Product Deleted', Addones);
  };

  updateUser = (user) => {
    this.setState({user: user});
  };

  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Location" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('Unable to open App Settings:', error);
    }
  };

  handleImagePick = async () => {
    try {
      ImagePicker.showImagePicker(
        {noData: true, mediaType: 'photo'},
        (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            if (Platform.OS === 'android') {
              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: response.fileName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: response.fileName,
              });
            } else if (Platform.OS === 'ios') {
              let imgName = response.name;

              if (typeof fileName === 'undefined') {
                const {uri} = response;
                // on iOS, using camera returns undefined fileName. This fixes that issue, so API can work.
                var getFilename = uri.split('/');
                imgName = getFilename[getFilename.length - 1];
              }

              const imageData = {
                size: response.fileSize,
                type: response.type,
                name: imgName,
                fileCopyUri: response.uri,
                uri: response.uri,
              };

              this.setState({
                userPic: imageData,
                userImage: response.uri,
                userImageName: imgName,
              });
            }
          }
        },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  handleQtyChange = (Qty) => {
    this.setState({Qty});
  };
  handlePriceChange = (price) => {
    this.setState({price});
  };
  handleShortChange = (shortDescription) => {
    this.setState({shortDescription});
  };
  handleNameChange = (itemName) => {
    this.setState({itemName});
  };

  handleFoodTypeChange = (FoodType) => {
    this.setState({FoodType});
    console.log(FoodType);
  };

  handleTimeSlot = () => {
    const refreshCallback = this.props.navigation.getParam(
      'refreshCallback',
      null,
    );

    const {
      Addones,
      itemName,
      Qty,
      shortDescription,
      FoodType,
      RestraType,
      Custom,
      userPic,
      FoodCategory,
      gst,
      price,
    } = this.state;
    //Validation
    if (FoodCategory.length === 0) {
      Alert.alert('Alert!', 'Please Enter Food Category', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    if (Qty.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Qty', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (RestraType.length === 0) {
      Alert.alert('Alert!', 'Please Enter Restra Type', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (gst.length === 0) {
      Alert.alert('Alert!', 'Please Enter GST Slab', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (itemName.trim() === '') {
      Alert.alert('Alert!', 'Please Enter Product Name', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (shortDescription.trim() === '') {
      Alert.alert('', 'Please enter Food Description ', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (FoodType.trim() === '') {
      Alert.alert('', 'Please enter Food Food Type', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    if (price.trim() === '') {
      Alert.alert('', 'Please enter Food Price', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }
    const addMenuData = {
      Addones,
      itemName,
      Qty,
      shortDescription,
      FoodType,
      RestraType,
      Custom,
      userPic,
      FoodCategory,
      gst,
      price,
    };
    if (refreshCallback) {
      this.props.navigation.navigate('AddProduct', {
        addMenuData,
        refreshCallback,
      });
    }
  };
  FoodCategoryChange = (key, value) => {
    this.setState({FoodCategory: key});
  };

  itemSeparator = () => <View style={styles.separator} />;
  keyCustom = (item, index) => index.toString();
  keyAddons = (item, index) => index.toString();

  async onValueChangeCat(value) {
    this.setState({selectedCat: value});
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      userImage,
      Customization,
      Custom,
      AddOns,
      RestraType,
      Addones,
      FoodCategory,
      gst,
      productTypes,
    } = this.state;
    const paymentData = Object.keys(Customization).map((keys) =>
      Object.values(Customization[keys]),
    );

    return (
      <SafeAreaView style={[basicStyles.container]}>
        <View style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
          <HeaderComponent
            headerTitle="Add Menu"
            nav={this.props.navigation}
            navAction="back"
          />
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={[basicStyles.mainContainer, basicStyles.padding]}>
              {/* <View style={styles.productTypeContainer}> */}
              <View style={styles.viewStyle}>
                <FlatListPicker
                  ref={(ref) => {
                    this.FlatListPicker = ref;
                  }}
                  data={this.state.productTypes}
                  containerStyle={styles.mContainer}
                  dropdownStyle={{
                    width: wp(96),
                    position: 'absolute',
                    right: wp(5),
                  }}
                  dropdownTextStyle={{fontSize: 15}}
                  pickedTextStyle={{color: 'black', fontWeight: 'bold'}}
                  // animated="slide"
                  defaultValue="Product Type"
                  renderDropdownIcon={() => (
                    <AntDesign
                      name="caretdown"
                      color="#333"
                      size={15}
                      style={{padding: 15}}
                    />
                  )}
                  onValueChange={(key, index) =>
                    this.setState({RestraType: key})
                  }
                />
              </View>

              {/* <View style={styles.viewStyle}>
                <View style={[basicStyles.flexOne]}>
                  <Picker
                    itemStyle={styles.itemStyle}
                    mode="dropdown"
                    style={styles.pickerStyle}
                    selectedValue={this.state.selectedCat}
                    onValueChange={this.onValueChangeCat.bind(this)}>
                    {this.state.category.map((item, index) => (
                      <Picker.Item
                        color="#333"
                        label={item.itemName}
                        value={item.itemName}
                        index={index}
                      />
                    ))}
                  </Picker>
                </View>
              </View> */}

              <View style={basicStyles.directionRow}>
                <TouchableOpacity
                  style={styles.imagePreview}
                  onPress={this.handlePermission}>
                  {userImage ? (
                    <Image
                      source={{uri: userImage}}
                      resizeMode="cover"
                      style={styles.preImage}
                    />
                  ) : (
                    <Image
                      source={upload_image}
                      resizeMode="cover"
                      style={styles.preImage}
                    />
                  )}
                </TouchableOpacity>

                <View style={basicStyles.flexOne}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Item Name"
                      placeholderTextColor="#999"
                      style={styles.inputDesign}
                      value={this.state.itemName}
                      onChangeText={this.handleNameChange}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Quantity"
                      placeholderTextColor="#999"
                      style={styles.inputDesign}
                      value={this.state.Qty}
                      onChangeText={this.handleQtyChange}
                    />
                    <View style={{width: wp(2)}}></View>
                    <TextInput
                      placeholder="Price"
                      placeholderTextColor="#999"
                      style={styles.inputDesign}
                      value={this.state.price}
                      onChangeText={this.handlePriceChange}
                    />
                  </View>
                </View>
              </View>

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <View
                  style={[
                    styles.inputContainer,
                    basicStyles.flexOne,
                    styles.pickerGst,
                  ]}>
                  <View style={[styles.viewStyle, basicStyles.marginTop]}>
                    <FlatListPicker
                      ref={(ref) => {
                        this.FlatListPicker = ref;
                      }}
                      data={this.state.CateGoryList}
                      containerStyle={styles.mContainer}
                      dropdownStyle={{
                        width: wp(96),
                        position: 'absolute',
                        right: wp(5),
                      }}
                      dropdownTextStyle={{fontSize: 15}}
                      pickedTextStyle={{color: 'black', fontWeight: 'bold'}}
                      // animated="slide"
                      defaultValue="Food Category"
                      renderDropdownIcon={() => (
                        <AntDesign
                          name="caretdown"
                          color="#333"
                          size={15}
                          style={{padding: 15}}
                        />
                      )}
                      onValueChange={this.FoodCategoryChange}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    basicStyles.flexOne,
                    styles.pickerType,
                  ]}>
                  <View style={[styles.viewStyle, basicStyles.marginTop]}>
                    <FlatListPicker
                      ref={(ref) => {
                        this.FlatListPicker = ref;
                      }}
                      data={this.state.gstType}
                      containerStyle={styles.mContainer}
                      dropdownStyle={{
                        width: wp(96),
                        position: 'absolute',
                        left: wp(2),
                      }}
                      dropdownTextStyle={{fontSize: 15}}
                      pickedTextStyle={{color: 'black', fontWeight: 'bold'}}
                      // animated="slide"
                      defaultValue="GST Slab"
                      renderDropdownIcon={() => (
                        <AntDesign
                          name="caretdown"
                          color="#333"
                          size={15}
                          style={{padding: 15}}
                        />
                      )}
                      onValueChange={(key, index) => this.setState({gst: key})}
                    />
                  </View>
                </View>
              </View>

              {/* <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <View style={[styles.viewStyle2, styles.mRight]}>
                  <View style={[basicStyles.flexOne]}>
                    <Picker
                      itemStyle={styles.itemStyle}
                      mode="dropdown"
                      style={styles.pickerStyle}
                      selectedValue={this.state.selectedCat}
                      onValueChange={this.onValueChangeCat.bind(this)}>
                      {this.state.category2.map((item, index) => (
                        <Picker.Item
                          color="#333"
                          label={item.itemName}
                          value={item.itemName}
                          index={index}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <View style={[styles.viewStyle2, styles.mRight]}>
                  <View style={[basicStyles.flexOne]}>
                    <Picker
                      itemStyle={styles.itemStyle}
                      mode="dropdown"
                      style={styles.pickerStyle}
                      selectedValue={this.state.selectedCat}
                      onValueChange={this.onValueChangeCat.bind(this)}>
                      {this.state.category3.map((item, index) => (
                        <Picker.Item
                          color="#333"
                          label={item.itemName}
                          value={item.itemName}
                          index={index}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View> */}

              <View style={styles.multiLineInputContainer}>
                <TextInput
                  placeholder="Short Description"
                  multiline={true}
                  numberOfLines={5}
                  placeholderTextColor="#999"
                  style={styles.multiLineInputDesign}
                  value={this.state.shortDescription}
                  onChangeText={this.handleShortChange}
                />
              </View>

              <Text style={[basicStyles.heading, basicStyles.marginBottom]}>
                Customization
              </Text>

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <View style={[styles.inputContainer, basicStyles.flexOne]}>
                  <FlatList
                    data={Customization}
                    renderItem={this.renderContactForm}
                    keyExtractor={(item) => item.id}
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
                keyExtractor={(item) => item.id}
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
                    keyExtractor={(item) => item.id}
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
                keyExtractor={(item) => item.id}
                //numColumns={2}
                ItemSeparatorComponent={this.itemSeparator}
                contentContainerStyle={styles.containerStyle}
              />

              <RadioForm
                radio_props={radio_props}
                onPress={this.handleFoodTypeChange}
                formHorizontal={true}
                labelHorizontal={true}
                animation={true}
                buttonSize={12}
                buttonOuterSize={24}
                buttonColor={'#ccc'}
                selectedButtonColor={'#f65e83'}
                labelColor={'#ccc'}
                labelStyle={styles.radioButtonLabel}
                style={styles.radioButton}
              />

              <TouchableHighlight
                style={styles.postButton}
                underlayColor="#f6416c80"
                onPress={this.handleTimeSlot}>
                <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                  Time line for Ordering and delivery
                </Text>
              </TouchableHighlight>
            </View>
          </KeyboardAwareScrollView>
        </View>
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
    borderColor: '#cccccc80',
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
    borderColor: '#cccccc80',
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
    backgroundColor: '#f65e83',
    paddingHorizontal: wp(10),
    paddingVertical: wp(2.5),
    alignItems: 'center',
    marginTop: wp(2),
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
  addField2: {
    backgroundColor: '#f65e83',
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
    marginTop: hp(1.5),
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
    backgroundColor: '#cccccc80',
  },
  input1: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
  },
  inputFFF: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginRight: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
    lineHeight: hp(5.5),
  },
  inputFFF2: {
    height: hp(5.5),
    fontSize: wp(3.5),
    flex: 1,
    borderRadius: 3,
    marginLeft: wp(1.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#cccccc80',
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
    backgroundColor: '#cccccc80',
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
    borderColor: '#cccccc80',
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
