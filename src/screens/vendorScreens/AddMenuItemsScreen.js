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
  {label: '5%', value: 'veg'},
  {label: '18%', value: 'non-veg'},
];
// var radio_ProductType = [
//   { label: 'Farm', value: 'Farm', key: '2' },
//   { label: 'Restaurant', value: 'Restaurant', key: '1' },
// ];

export default class AddGalleryItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gstType: [],
      itemName: '',
      description: '',
      gstId: -1,
      userPic: null,
      userImage: null,
      price: '',
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
        BASE_URL + 'api/Vendors/gstList',
        params,
        true,
        false,
      );

      if (response) {
        this.setState({isLoading: false});
        const {gst} = response;
        if (gst) {
          const gstType = gst.map(item => ({
            label: item.value,
            value: item.key,
          }));
          this.setState({gstType, gstId: gst[0].key});
        } else {
          this.setState({gstType: [], gstId: -1});
        }
      } else {
        this.setState({isLoading: false, gstType: [], gstId: -1});
      }
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error.message);
    }
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
        response => {
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

  handlePriceChange = price => {
    this.setState({price});
  };
  handleShortChange = description => {
    this.setState({description});
  };
  handleNameChange = itemName => {
    this.setState({itemName});
  };

  handleGstChange = gstId => {
    console.log(gstId);
    this.setState({gstId});
  };

  handleCustomizationNav = () => {
    let item = {...this.state};

    const fetchVendorProfile = this.props.navigation.getParam(
      'fetchVendorProfile',
      null,
    );

    // if (item.userPic === null) {
    //   // Alert.alert('Alert!', 'Please Upload Image First', [{text: 'OK'}], {
    //   //   cancelable: false,
    //   // });
    //   showToast('Please Upload Image First');
    //   return;
    // }

    if (item.itemName.trim() === '') {
      // Alert.alert('Alert!', 'Please Enter Item Name', [{text: 'OK'}], {
      //   cancelable: false,
      // });
      showToast('Please Enter Item Name');
      return;
    }

    if (item.price.trim() === '') {
      // Alert.alert('Alert!', 'Please Enter Price', [{text: 'OK'}], {
      //   cancelable: false,
      // });
      showToast('Please Enter Price');
      return;
    }

    if (item.description.trim() === '') {
      // Alert.alert('Alert!', 'Please Enter Short Description', [{text: 'OK'}], {
      //   cancelable: false,
      // });
      showToast('Please Enter Description');
      return;
    }

    if (item.gstId === -1) {
      // Alert.alert('Alert!', 'Please Enter Short Description', [{text: 'OK'}], {
      //   cancelable: false,
      // });
      showToast('Please Select Gst');
      return;
    }

    this.props.navigation.navigate('AddMenuItemsStep2', {
      item,
      refreshCall: fetchVendorProfile,
    });
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
      gstType,
      gstId,
      productTypes,
    } = this.state;
    console.log(gstId);

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={[basicStyles.container]}>
          <HeaderComponent
            headerTitle="Add Product"
            nav={this.props.navigation}
            navAction="back"
          />
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{borderTopWidth: 4, borderTopColor: '#f5f5f5'}}>
            <View style={[basicStyles.mainContainer, basicStyles.padding]}>
              <Text
                style={[
                  basicStyles.heading,
                  basicStyles.marginTop,
                  basicStyles.marginBottom,
                ]}>
                Product Information
              </Text>
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

              <TextInput
                placeholder="Item Name"
                placeholderTextColor="#999"
                style={styles.inputDesign}
                value={this.state.itemName}
                onChangeText={this.handleNameChange}
              />

              <TextInput
                placeholder="Price"
                placeholderTextColor="#999"
                style={styles.inputDesign}
                value={this.state.price}
                onChangeText={this.handlePriceChange}
              />

              <TextInput
                placeholder="Short Description"
                multiline={true}
                numberOfLines={5}
                placeholderTextColor="#999"
                style={styles.multiLineInputDesign}
                value={this.state.description}
                onChangeText={this.handleShortChange}
              />

              <Text style={[basicStyles.heading, basicStyles.marginTop]}>
                GST Slab
              </Text>

              <RadioForm
                radio_props={gstType}
                onPress={this.handleGstChange}
                formHorizontal={true}
                labelHorizontal={true}
                animation={true}
                buttonSize={12}
                buttonOuterSize={24}
                buttonColor={'#ccc'}
                selectedButtonColor={'#f57c00'}
                labelColor={'#ccc'}
                labelStyle={styles.radioButtonLabel}
                style={styles.radioButton}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>

        <TouchableOpacity
          style={styles.postButton}
          underlayColor="#f57c0080"
          onPress={this.handleCustomizationNav}>
          <Text style={[basicStyles.heading, basicStyles.whiteColor]}>
            Add Customization
          </Text>
          <MaterialIcons
            size={24}
            name={'arrow-right-alt'}
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
    height: hp(6),
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingLeft: wp(3),
    marginBottom: hp(2),
  },
  multiLineInputDesign: {
    height: hp(14),
    fontSize: wp(3.5),
    marginBottom: wp(2),
    backgroundColor: '#f5f5f5',
    flex: 1,
    textAlignVertical: 'top',
    paddingLeft: wp(3),
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
    fontSize: wp(3.5),
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
    width: wp(30),
    height: wp(30),
    marginRight: wp(2),
    marginTop: wp(1),
    marginBottom: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc8',
  },
  preImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 10,
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
  addIcon: {
    position: 'absolute',
    right: wp(3),
    // top: 0,
  },
});
