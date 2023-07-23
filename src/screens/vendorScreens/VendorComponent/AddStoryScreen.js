import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';

//image picker and permission
import ImagePicker from 'react-native-customized-image-picker';

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
import HeaderComponent from '../VendorComponent/HeaderComponent';
import ProcessingLoader from '../../../components/ProcessingLoader';
//Styles
import basicStyles from '../BasicStyles';
import ic_go_back from '../assets/icons/ic_go_back.png';
import ic_poll from '../assets/icons/ic_poll.png';
import ic_removes from '../assets/icons/ic_removes.png';
// VectorIcons
import Feather from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {showToast} from '../../../components/CustomToast';

export default class AddStoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPoll: false,
      isProcessing: false,
      pollQuestion: '',
    };
  }

  handleGoBack = () => {
    this.props.navigation.pop();
  };

  handleActivePoll = () => {
    this.setState({isPoll: true});
  };

  handleUpdateStory = async () => {
    // check
    const {isPoll, pollQuestion} = this.state;

    const items = this.props.navigation.getParam('items', null);

    const {
      uploadFile,
      description,
      imageData,
      postType,
      currentLocationAddress,
    } = items;

    if (uploadFile === null || uploadFile.length < 1) {
      Alert.alert('Alert!', 'Please upload media first.');
      return;
    }

    if (description.trim() === '') {
      Alert.alert('Alert!', 'Please enter caption.');
      return;
    }

    try {
      this.setState({isProcessing: true});

      const params = {
        postType,
        mediaType: 'image',
        description,
        location: currentLocationAddress,
        isPoll,
        pollQuestion,
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

  cleanTempFiles = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleAddStory = () => {
    Alert.alert(
      'Story!',
      'Press Confirm to post story.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: this.handleUpdateStory,
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  render() {
    const {isPoll, isProcessing} = this.state;
    const items = this.props.navigation.getParam('items', null);
    console.log(items);

    return (
      <View style={[basicStyles.container, basicStyles.blackBgColor]}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={this.handleGoBack}>
          <Image
            source={ic_go_back}
            resizeMode="cover"
            style={styles.iconStyle}
          />
        </TouchableOpacity>

        <View style={[basicStyles.mainContainer]}>
          <Image
            source={{uri: items.uploadFile[0].uri}}
            resizeMode="cover"
            style={styles.preImage}
          />
        </View>

        {isPoll === true ? (
          <View style={styles.mainPollContainer}>
            <View style={[basicStyles.directionRow]}>
              <TextInput
                placeholder="Ask a Question..."
                placeholderTextColor="#fff"
                multiline={true}
                style={styles.multiLineInputDesign}
                value={this.state.pollQuestion}
                onChangeText={(e) => {
                  this.setState({pollQuestion: e});
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({isPoll: false, pollQuestion: ''});
                }}>
                <Image source={ic_removes} style={basicStyles.iconColumn} />
              </TouchableOpacity>
            </View>
            {/* <View style={styles.pollContainer}>
            <TouchableOpacity style={[styles.pollButtonStyle]}>
              <Text style={[basicStyles.textBold, basicStyles.blackColor]}>
                Yes
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: '#888',
                height: hp(7.8),
                width: wp(0.15),
              }}
            />
            <TouchableOpacity style={styles.pollButtonStyle}>
              <Text style={[basicStyles.textBold, basicStyles.blackColor]}>
                No
              </Text>
            </TouchableOpacity>
          </View> */}
          </View>
        ) : null}

        {isPoll === false ? (
          <TouchableOpacity
            style={styles.pollButtonContainer}
            onPress={this.handleActivePoll}>
            <Text style={[basicStyles.textBold, basicStyles.whiteColor]}>
              Create Poll
            </Text>
            <Image
              source={ic_poll}
              resizeMode="cover"
              style={styles.pollIconStyle}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.storyButtonContainer}
          onPress={this.handleAddStory}>
          <Text style={[basicStyles.text, basicStyles.whiteColor]}>
            Add Story
          </Text>
        </TouchableOpacity>
        {isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    color: '#fff',
    backgroundColor: '#33333380',
    fontSize: wp(3),
    borderRadius: 5,
  },
  backButtonContainer: {
    backgroundColor: '#0004',
    borderRadius: wp(5),
    position: 'absolute',
    top: hp(4.5),
    left: wp(5),
    zIndex: 5,
    height: hp(3.7),
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollButtonContainer: {
    flexDirection: 'row',
    borderRadius: wp(5),
    position: 'absolute',
    bottom: hp(9.5),
    right: wp(3.5),
    zIndex: 5,
    alignItems: 'center',
  },

  storyButtonContainer: {
    backgroundColor: '#0004',
    borderRadius: wp(5),
    height: hp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollContainer: {
    borderRadius: wp(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignSelf: 'center',
    width: wp(50),
    height: hp(8),
    alignItems: 'center',
  },
  pollButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(7.8),
    // backgroundColor: '#333',
  },
  mainPollContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
    alignItems: 'center',
    bottom: hp(10),
  },
  iconStyle: {
    height: hp(2.2),
    aspectRatio: 1 / 1,
  },
  pollIconStyle: {
    width: hp(3.2),
    aspectRatio: 1 / 1,
    marginLeft: wp(2),
  },
  multiLineInputDesign: {
    minWidth: wp(35),
    maxWidth: wp(70),
    borderRadius: wp(1.5),
    fontSize: wp(4),
    fontWeight: '700',
    // borderWidth: 3,
    color: '#fff',
    textAlign: 'center',
  },
  preImage: {
    flex: 1,
    width: '100%',
    borderRadius: 3,
  },
});
