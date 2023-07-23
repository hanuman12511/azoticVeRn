import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Alert,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

//image picker and permission
import ImagePicker from 'react-native-image-picker';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

//Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';
import FooterComponent from '../vendorScreens/VendorComponent/FooterComponent';
//Styles
import basicStyles from '../vendorScreens/BasicStyles';
import new_products from '../../assets/images/new_products.jpg';
// VectorIcons
import Feather from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class AddGalleryItemsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      fileData: '',
      fileUri: '',
      userPic: '',
      userImage: '',
      userImageName: '',
    };
  }

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
      ImagePicker.launchImageLibrary(
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

  // componentDidMount() {
  //   this.handlePermission();
  // }

  render() {
    const {userImage} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Add Post"
          nav={this.props.navigation}
          navAction="back"
        />

        <View style={[basicStyles.mainContainer, basicStyles.padding]}>
          <View style={[styles.imageTilesContainer]}>
            <View style={[styles.imageTiles]}>
              {userImage ? (
                <Image
                  source={{uri: userImage}}
                  resizeMode="cover"
                  style={styles.preImage}
                />
              ) : (
                <Image source={new_products} style={styles.preImage} />
              )}
            </View>
          </View>
        </View>
        <View
          style={[
            basicStyles.directionRow,
            basicStyles.padding,
            basicStyles.marginBottom,
            basicStyles.justifyBetween,
          ]}>
          <TouchableOpacity
            style={[{height: wp(8), aspectRatio: 1.2 / 1}]}
            onPress={this.handlePermission}>
            <Image
              source={require('../vendorScreens/assets/icons/video_playlist.png')}
              style={[{height: wp(8), aspectRatio: 1.2 / 1}]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[{height: wp(8), aspectRatio: 1.2 / 1}]}
            onPress={this.handlePermission}>
            <Image
              source={require('../vendorScreens/assets/icons/openCamera.png')}
              style={[{height: wp(8), aspectRatio: 1.2 / 1}]}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[{height: wp(8), aspectRatio: 1.2 / 1}]}>
            <Image
              source={require('../vendorScreens/assets/icons/image_gallery.png')}
              style={[{height: wp(8), aspectRatio: 1.2 / 1}]}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: wp(3),
    height: hp(5.5),
    flex: 1,
  },
  multiLineInputDesign: {
    fontSize: wp(3),
    flex: 1,
    textAlignVertical: 'top',
  },
  postButton: {
    backgroundColor: '#f65e83',
    paddingHorizontal: wp(10),
    paddingVertical: wp(2),
    alignSelf: 'center',
    marginTop: wp(2),
  },
  preImage: {
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: 20,
  },
  imageTilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  imageTiles: {
    width: wp(30),
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: wp(1),
    borderWidth: 1,
  },
});
