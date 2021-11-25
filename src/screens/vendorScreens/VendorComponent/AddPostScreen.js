import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  FlatList,
  Alert,
} from 'react-native';

// Document Picker Import
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-customized-image-picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import SafeAreaView from 'react-native-safe-area-view';
import ToggleSwitch from 'toggle-switch-react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Components
import HeaderComponent from '../VendorComponent/HeaderComponent';
import FooterComponent from '../VendorComponent/FooterComponent';
import ProcessLoader from '../../../components/ProcessingLoader';
import Geolocation from 'react-native-geolocation-service';

//Styles
import basicStyles from '../BasicStyles';
import ic_camera from '../assets/icons/ic_camera.png';
// VectorIcons
import Feather from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {showToast} from '../../../components/CustomToast';
import SwitchToggle from 'react-native-switch-toggle';

export default class AddPostScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      isPost: false,
      postType: '',
      description: '',
      uploadFile: null,
      imageData: null,
      isProcessing: false,
      currentLocationAddress: '',
    };
    // current location coordinates
    this.coords = null;
    this.isLocationPermissionBlocked = false;
  }

  componentDidMount() {
    this.handlePermission();
  }

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          this.isLocationPermissionBlocked = true;
          Alert.alert(
            'Location Services Not Available',
            'Press OK, then check and enable the Location Services in your Privacy Settings',
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
          break;
        case RESULTS.DENIED:
          // console.log(
          //   'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
              this.fetchCurrentPosition();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.fetchCurrentPosition();
          break;
        case RESULTS.BLOCKED:
          this.isLocationPermissionBlocked = true;
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

  fetchCurrentPosition = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
      showLocationDialog: true,
      forceRequestLocation: true,
    };

    Geolocation.getCurrentPosition(
      this.geolocationSuccessCallback,
      this.geolocationErrorCallback,
      options,
    );
  };

  geolocationSuccessCallback = async (position) => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing info
      const API_KEY = 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k';
      this.coords = position.coords;
      const {latitude, longitude} = this.coords;

      // calling api
      const response = await makeRequest(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`,
      );

      // processing response
      if (response) {
        const {status} = response;

        if (status === 'OK') {
          const {results} = response;

          // filtering addresses result(taking first address only)
          const filteredResult = results[9];
          const currentLocationAddress = filteredResult.formatted_address;

          this.setState({
            currentLocationAddress,
            isProcessing: false,
          });
        } else {
          const {error_message} = response;
          console.log(error_message);

          this.setState({
            currentLocationAddress: null,
            isProcessing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  geolocationErrorCallback = (error) => {
    if (
      error.code === 2 &&
      error.message === 'No location provider available.'
    ) {
      Alert.alert(
        '',
        "Make sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      console.log(error.code, error.message);

      Alert.alert(
        'Error',
        "Something went wrong...\nMake sure your device's Location/GPS is ON",
        [{text: 'OK'}],
        {cancelable: false},
      );
    }
  };

  handleUpdatePost = async () => {
    // check
    const {
      description,
      uploadFile,
      postType,
      imageData,
      currentLocationAddress,
    } = this.state;

    if (uploadFile === null || uploadFile.length < 1) {
      Alert.alert('Alert!', 'Please upload media first.');
      return;
    }

    if (description.trim() === '') {
      Alert.alert('Alert!', 'Please enter caption.');
      return;
    }

    if (postType === 'both') {
      let items = {uploadFile, postType, description, currentLocationAddress};
      this.props.navigation.navigate('AddStory', {items});
      return;
    }

    try {
      this.setState({isProcessing: true});

      const params = {
        postType: 'post',
        mediaType: 'image',
        description,
        location: currentLocationAddress,
        isPoll: false,
        pollQuestion: '',
        file: imageData,
      };

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/addGallery',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message} = response;
        this.setState({isProcessing: false});
        if (success) {
          this.props.navigation.popToTop();
          showToast(message);
          this.cleanTempFiles();
          this.setState({uploadFile: null, imageData: null});
        } else {
          showToast(message);
        }
      } else {
        this.setState({isProcessing: false});
      }
    } catch (error) {
      this.setState({uploadFile: null, imageData: null, isProcessing: false});
      console.log(error.message);
    }
  };

  handlePermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.CAMERA,
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
              this.handleUploadFile();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          this.handleUploadFile();
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

  handleUploadFile = async () => {
    try {
      ImagePicker.openPicker({
        multiple: true,
        isCamera: true,
        maxSize: 6,
        isHidePreview: true,
        title: '',
        compressQuality: 80,
        cropping: true,
        hideCropBottomControls: false,
        aspectRatioX: 5,
        aspectRatioY: 5,
      }).then(async (images) => {
        // console.log(images.data);
        this.setState({
          uploadFile: images.map((i) => {
            console.log('Image Response', i);
            return {
              uri: i.path,
              width: i.width,
              height: i.height,
              mime: i.mime,
            };
          }),

          imageData: images.map((i) => {
            var getFilename = i.path.split('/');
            let imgName = getFilename[getFilename.length - 1];
            return {
              size: i.size,
              type: i.mime,
              name: imgName,
              uri: i.path,
              fileCopyUri: i.path,
            };
          }),
        });
        // await this.cleanTempFiles();
      });
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  cleanTempFiles = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  renderGalleryMedia = ({item}) => {
    return (
      <View style={[basicStyles.mainContainer]}>
        <View style={{margin: wp(1)}}>
          <Image
            source={{uri: item.uri}}
            resizeMode="cover"
            style={styles.preImage}
          />
        </View>
      </View>
    );
  };

  handlePostType = () => {
    let {isPost} = this.state;

    isPost = !isPost;
    if (isPost === true) {
      this.setState({isPost, postType: 'both'});
    } else if (isPost === false) {
      this.setState({isPost, postType: ''});
    }
  };

  handleToggleSwitch = async () => {
    let {isOn} = this.state;

    isOn = !isOn;
    if (isOn === true) {
      await this.setState({isOn});
      await this.checkPermission();
    } else if (isOn === false) {
      this.setState({isOn});
    }
  };

  handleStory = () => {
    const {
      uploadFile,
      description,
      imageData,
      currentLocationAddress,
    } = this.state;

    const postType = 'story';

    if (uploadFile === null || uploadFile.length < 1) {
      Alert.alert('Alert!', 'Please upload media first.');
      return;
    }

    if (description.trim() === '') {
      Alert.alert('Alert!', 'Please enter caption.');
      return;
    }

    let items = {
      uploadFile,
      postType,
      description,
      imageData,
      currentLocationAddress,
    };
    this.props.navigation.navigate('AddStory', {items});
  };

  handleAddPost = () => {
    const {
      description,
      uploadFile,
      postType,
      imageData,
      currentLocationAddress,
    } = this.state;

    if (uploadFile === null || uploadFile.length < 1) {
      Alert.alert('Alert!', 'Please upload media first.');
      return;
    }

    if (description.trim() === '') {
      Alert.alert('Alert!', 'Please enter caption.');
      return;
    }

    if (postType === 'both') {
      let items = {
        uploadFile,
        postType,
        description,
        imageData,
        currentLocationAddress,
      };
      this.props.navigation.navigate('AddStory', {items});
      return;
    }

    Alert.alert(
      'Post!',
      'Press Confirm to add post.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: this.handleUpdatePost,
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    const {
      uploadFile,
      postType,
      isProcessing,
      currentLocationAddress,
    } = this.state;

    if (isProcessing) {
      return <ProcessLoader />;
    }
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Add New Post"
          nav={this.props.navigation}
          navAction="back"
        />

        <View
          style={[
            basicStyles.mainContainer,
            // basicStyles.paddingHalf,
            basicStyles.marginHorizontal,
          ]}>
          <View>
            {uploadFile ? (
              <View>
                <FlatList
                  data={this.state.uploadFile}
                  renderItem={this.renderGalleryMedia}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  numColumns={3}
                />
                <TouchableOpacity
                  style={styles.blankImageContainer}
                  onPress={this.handleUploadFile}>
                  <Image source={ic_camera} style={styles.iconColumn} />
                  <Text style={styles.uploadTextStyle}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.blankImageContainer}
                onPress={this.handleUploadFile}>
                <Image source={ic_camera} style={styles.iconColumn} />
                <Text style={styles.uploadTextStyle}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            placeholder="Write a caption...."
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={4}
            style={styles.multiLineInputDesign}
            value={this.state.description}
            onChangeText={(e) => {
              this.setState({description: e});
            }}
          />

          <View style={[basicStyles.marginVentricle]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                // basicStyles.marginVentricle,
              ]}>
              <Text>Add Location</Text>
              {/* <ToggleSwitch
                isOn={this.state.isOn}
                trackOffStyle={styles.switchTrackStyle}
                thumbOffStyle={{...styles.switchButtonStyle, marginLeft: -3}}
                trackOnStyle={styles.switchTrackStyle}
                thumbOnStyle={styles.switchButtonStyle}
                size="small"
                onToggle={this.handleToggleSwitch}
              /> */}
              <SwitchToggle
                switchOn={this.state.isOn}
                onPress={this.handleToggleSwitch}
                circleColorOff="#6D6D6D"
                circleColorOn="#f57c00"
                backgroundColorOn="#C4C4C4"
                backgroundColorOff="#C4C4C4"
                containerStyle={styles.switchButton}
                circleStyle={styles.switchCircle}
              />
            </View>
            {this.state.isOn ? (
              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[basicStyles.text, {color: '#F57C00'}]}>
                  Location :
                </Text>
                <Text style={[basicStyles.text, {color: '#555'}]}>
                  {' '}
                  {currentLocationAddress}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              // basicStyles.marginVentricle,
            ]}>
            <Text>Add Post as Story</Text>

            <SwitchToggle
              switchOn={this.state.isPost}
              onPress={this.handlePostType}
              circleColorOff="#6D6D6D"
              circleColorOn="#f57c00"
              backgroundColorOn="#C4C4C4"
              backgroundColorOff="#C4C4C4"
              containerStyle={styles.switchButton}
              circleStyle={styles.switchCircle}
            />
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.justifyBetween,
            basicStyles.alignCenter,
            basicStyles.paddingHalf,
          ]}>
          <TouchableOpacity
            onPress={this.handleAddPost}
            style={[basicStyles.flexOne, basicStyles.marginHalf]}>
            <View style={styles.nextButton}>
              <Text style={[styles.content]}>Post</Text>
            </View>
          </TouchableOpacity>
          {postType !== 'both' ? (
            <TouchableOpacity
              onPress={this.handleStory}
              style={[basicStyles.flexOne, basicStyles.marginHalf]}>
              <View style={styles.nextButton}>
                <Text style={[styles.content]}>Story</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    color: '#fff',
    fontSize: wp(4),
  },
  switchTrackStyle: {
    width: 35,
    backgroundColor: '#dadfe3',
  },
  switchButtonStyle: {
    height: 20,
    width: 20,
    borderRadius: 40,
    backgroundColor: '#ee7b03',
  },
  nextButton: {
    height: hp(6),
    backgroundColor: '#F57C00',
    justifyContent: 'center',
    alignItems: 'center',
    // width: wp(45.5),
    // marginLeft: wp(2),
    borderRadius: 5,
  },
  text: {
    fontSize: wp(4),
    alignItems: 'center',
    color: '#000',
  },
  separator: {
    height: wp(2),
  },
  inputContainer: {
    borderRadius: 3,
    height: hp(5.5),
    paddingHorizontal: wp(2),
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(2),
    borderWidth: 1,
    borderColor: '#cccccc80',
  },

  inputDesign: {
    fontSize: wp(3),
    height: hp(5.5),
    flex: 1,
  },
  multiLineInputDesign: {
    minHeight: hp(8),
    marginVertical: hp(2),
    borderRadius: wp(1.5),
    fontSize: wp(3.5),
    paddingLeft: wp(2),
    backgroundColor: '#f2f2f2',
    color: '#444',
    textAlignVertical: 'top',
  },

  preImage: {
    width: wp(27),
    aspectRatio: 1 / 1,
    borderRadius: 10,
    backgroundColor: '#555',
  },
  iconColumn: {
    height: hp(3.2),
    aspectRatio: 1 / 1,
  },
  uploadTextStyle: {
    marginTop: wp(1),
    fontSize: wp(3),
    color: '#777',
  },
  blankImageContainer: {
    backgroundColor: '#f2f2f2',
    height: wp(27),
    aspectRatio: 1 / 1,
    borderRadius: wp(2),
    margin: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchButton: {
    width: wp(9.4),
    height: hp(2.2),
    borderRadius: 25,
    marginLeft: wp(1),
  },
  switchCircle: {
    width: wp(5.2),
    height: wp(5.2),
    borderRadius: wp(10.2),
  },
});
