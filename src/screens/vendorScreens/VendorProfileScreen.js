import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';
import CustomLoader from '../../components/CustomLoader';
import VendorStories from '../VendorStories';
// Styles
import basicStyles from '../../styles/BasicStyles';

// Images
import login_background from '../vendorScreens/assets/images/login_background.png';
import chef_image from '../vendorScreens/assets/images/chef_image.png';

//popup screen
import UpdatePopup from '../vendorScreens/UpdateProfileBackGroundImage';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
// Tabs
import VendorGalleryScreen from '../vendorScreens/VendorComponent/VendorGalleryScreen';
import VendorMenuScreen from '../vendorScreens/VendorComponent/VendorMenuScreen';

//api
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, storeData, getData, clearData} from '../../api/UserPreference';
import {showToast} from '../../components/CustomToast';

export default class CusVendorsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      tabActive: 'Gallery',

      showQualityPopup: false,
      profileImage: null,
      backgroundImage: null,
      isListRefreshing: false,
      vendorName: '',
      vendorImage: '',
      vendorAddress: '',
      totalLikes: '',
      totalFollowers: '',
      avgRatings: '',
      ratingCount: '',
      gstNumber: '',
      fssaiNumber: '',

      liveStories: null,
    };
  }

  componentDidMount() {
    this.fetchLiveStories();
    this.fetchVendorProfile();
  }

  fetchLiveStories = async () => {
    try {
      this.setState({isLoading: true});
      const userInfo = await getData(KEYS.USER_INFO);
      const {vendorCode} = userInfo;
      const params = {vendorCode};
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/liveStories',
        params,
        true,
        false,
      );

      if (response) {
        const {success, message} = response;
        if (success) {
          const {liveStories} = response;
          this.setState({
            liveStories,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            isLoading: false,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log('there are some  issues in liveStories', error);
    }
  };

  fetchVendorProfile = async () => {
    try {
      const params = null;
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getVendorProfile',
        params,
        true,
        false,
      );

      this.fetchLiveStories();

      if (response) {
        const {success, message} = response;
        this.setState({isLoading: false});
        if (success) {
          const {vendorProfile} = response;
          const {
            name,
            vendorImage,
            backgroundImage,
            vendorCode,
            vendorMobile,
            vendorEmail,
            vendorAddress,
            gstNumber,
            fssaiNumber,
            activeOrders,
            totalPosts,
            totalLikes,
            totalFollowers,
            avgRatings,
            ratingCount,
          } = vendorProfile;

          this.setState({
            vendorImage,
            vendorName: name,
            backgroundImage,
            vendorAddress,
            totalFollowers,
            totalLikes,
            ratingCount,
            avgRatings,
            gstNumber,
            fssaiNumber,
            isListRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  closePopup = () => {
    this.setState({showQualityPopup: false});
  };
  handleTabIndexChange = (index) => {
    const tabView = {...this.state.tabView, index};
    this.setState({tabView});
  };

  handleProfileImage = async () => {
    try {
      this.setState({showQualityPopup: true});
    } catch (error) {}
  };

  renderSlots = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Gallery') {
      return (
        <VendorGalleryScreen
          navigation={this.props.navigation}
          fetchLiveStories={this.fetchLiveStories}
        />
      );
    } else if (tabActive === 'Menu') {
      return (
        <VendorMenuScreen
          navigation={this.props.navigation}
          fetchLiveStories={this.fetchLiveStories}
        />
      );
    }
  };

  handleGallery = () => {
    this.setState({tabActive: 'Gallery'});
  };
  handleMenu = () => {
    this.setState({tabActive: 'Menu'});
  };

  handleAddItems = () => {
    const {tabActive} = this.state;
    if (tabActive === 'Gallery') {
      this.props.navigation.navigate('CameraComponent');
    } else if (tabActive === 'Menu') {
      this.props.navigation.navigate('AddMenuItems', {
        fetchVendorProfile: this.fetchVendorProfile,
      });
    }
  };

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.componentDidMount();
    } catch (error) {
      console.log(error.message);
    }
  };

  handleDeleteStory = async (postId) => {
    try {
      // starting loader
      this.setState({
        isProcessing: true,
        contentLoading: true,
        isMenuVisible: false,
      });

      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        postId,
      };

      // calling api

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/postDelete',
        params,
        true,
        false,
      );

      // Processing Response
      if (response) {
        const {success} = response;

        this.setState({
          contentLoading: false,
          isProcessing: false,
        });

        if (success) {
          const {message} = response;
          const refreshCallBack = this.props.navigation.getParam(
            'refreshCallBack',
            null,
          );
          showToast(message);
          await refreshCallBack();
          this.props.navigation.pop();
        } else {
          const {message, isAuthTokenExpired} = response;

          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            return;
          }
          showToast(message);
        }
      } else {
        this.setState({
          contentLoading: false,
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('VendorLogin');
  };

  render() {
    const {liveStories, profileImage, isLoading, tabActive} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      vendorImage,
      vendorName,
      vendorAddress,
      totalFollowers,
      totalLikes,
      ratingCount,
      avgRatings,
      gstNumber,
      fssaiNumber,
    } = this.state;

    const items = {vendorName, vendorAddress, gstNumber, fssaiNumber};

    const activeStyle = [styles.tabBarIndicator, {backgroundColor: '#f57c00'}];
    const tabActiveText = [
      styles.tabBarLabel,
      {color: '#333', fontWeight: '700'},
    ];

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Vendor Profile"
          nav={this.props.navigation}
        />
        <ScrollView
          // contentContainerStyle={basicStyles.flexOne}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          }>
          <View style={styles.profileBgContainer}>
            <Image
              source={{uri: this.state.backgroundImage}}
              resizeMode="cover"
              style={[styles.bg]}
            />
          </View>

          <View style={[styles.profileContainer]}>
            {liveStories ? (
              <View style={styles.imageContainer}>
                <VendorStories
                  liveStories={liveStories}
                  handleDeleteStory={this.handleDeleteStory}
                />
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: vendorImage}}
                  style={styles.profileImageStyle}
                />
              </View>
            )}
            <Text style={styles.vendorName}>{vendorName}</Text>
            <Text style={styles.VendorAddressStyle}>{vendorAddress}</Text>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyCenter,
                basicStyles.paddingVentricle,
                basicStyles.marginVentricle,
              ]}>
              <View
                style={[
                  basicStyles.alignCenter,
                  basicStyles.paddingHorizontal,
                ]}>
                <Text style={[basicStyles.text]}>Followers</Text>
                <Text style={[basicStyles.heading]}>{totalFollowers}</Text>
              </View>
              <View style={basicStyles.separatorVertical} />
              <View
                style={[
                  basicStyles.alignCenter,
                  basicStyles.paddingHorizontal,
                ]}>
                <Text style={[basicStyles.text]}>Likes</Text>
                <Text style={[basicStyles.heading]}>{totalLikes}</Text>
              </View>
              <View style={basicStyles.separatorVertical} />
              <View
                style={[
                  basicStyles.alignCenter,
                  basicStyles.paddingHorizontal,
                ]}>
                <Text style={[basicStyles.text]}>Rating</Text>
                <Text style={[basicStyles.heading]}>
                  {avgRatings} ({ratingCount})
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editImage}
              onPress={this.handleProfileImage}>
              {/* <Material size={14} name={'pencil'} color="#fff" /> */}
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={this.handleGallery}
              style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Gallery' ? tabActiveText : styles.tabBarLabel
                }>
                Gallery
              </Text>
              <View
                style={
                  tabActive === 'Gallery' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={this.handleMenu} style={styles.tabStyle}>
              <Text
                style={
                  tabActive === 'Menu' ? tabActiveText : styles.tabBarLabel
                }>
                Menu
              </Text>
              <View
                style={
                  tabActive === 'Menu' ? activeStyle : styles.tabBarIndicator
                }
              />
            </TouchableOpacity>
          </View>
          {this.renderSlots()}
        </ScrollView>

        {/* <TouchableHighlight
          onPress={this.handleAddItems}
          style={styles.addButton}
          underlayColor="#f57c00">
          <Entypo size={40} name={'plus'} color="#fff" style={styles.addIcon} />
        </TouchableHighlight>*/}

        <TouchableOpacity
          onPress={this.handleAddItems}
          style={styles.addButton}
          underlayColor="#f57c00">
          <Entypo size={40} name={'plus'} color="#fff" style={styles.addIcon} />
        </TouchableOpacity>

        {this.state.showQualityPopup && (
          <UpdatePopup
            closePopup={this.closePopup}
            items={items}
            nav={this.props.navigation}
            fetchVendorProfile={this.fetchVendorProfile}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileBgContainer: {
    flexDirection: 'row',
    width: wp(100),
    height: hp(20),
  },
  bg: {
    width: wp(100),
  },
  profileContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profileStory: {
    borderRadius: wp(15),
  },
  vendorName: {
    fontSize: wp(5),
    fontWeight: '700',
    marginTop: hp(1),
    marginBottom: hp(1),
    color: '#333',
  },
  VendorAddressStyle: {
    fontSize: wp(3.7),
    fontWeight: '400',
    // marginTop: hp(1.5),
    marginBottom: hp(1),
    textAlign: 'center',
    color: '#555',
  },
  flatContainer: {
    flex: 1,
    backgroundColor: 'rgba( 0, 0, 0, 0.9 )',
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    elevation: 5,
  },
  profileImgStyle: {
    margin: wp(1),
    height: wp(18),
    aspectRatio: 1 / 1,
    borderRadius: wp(9),
    borderWidth: 2,
    borderColor: '#f6416c',
  },
  imageContainer: {
    margin: wp(1),
    height: hp(15),
    aspectRatio: 1 / 1,
    borderRadius: hp(7.5),
    borderWidth: 6,
    borderColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: hp(-7.5),
    shadowColor: '#0008',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#fff',
    // flexDirection: 'row',
  },
  profileImageStyle: {
    margin: wp(1),
    width: '100%',
    aspectRatio: 1 / 1,
    borderRadius: hp(7.5),
  },
  separator: {
    height: wp(2),
  },
  listContainer: {
    padding: wp(2),
  },
  cartIconStyle: {
    position: 'absolute',
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    top: 8,
    right: 0,
  },
  vectorIconRow: {
    aspectRatio: 1 / 1,
    marginRight: wp(3),
    alignSelf: 'flex-end',
  },
  profileNameStyle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: wp(3.5),
    marginLeft: wp(2),
  },

  tabBarStyle: {
    backgroundColor: 'transparent',
    width: wp(50),
  },

  editImage: {
    // position: 'absolute',
    bottom: 0,
    borderColor: '#f57c00',
    borderWidth: 1,
    // height: wp(6),
    // width: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: hp(1),
    height: hp(4.5),
    paddingHorizontal: wp(4),
  },
  editText: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#f57c00',
  },
  tabContainer: {
    backgroundColor: '#fff',
    elevation: 0,
    flexDirection: 'row',
    borderBottomWidth: 4,
    borderBottomColor: '#f2f1f1',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabStyle: {
    flex: 1,
    alignItems: 'center',
    // height: '100%',
    justifyContent: 'center',
    zIndex: 7,
    height: hp(6),
  },
  tabBarLabel: {
    color: '#999',
    fontSize: wp(4),
    textTransform: 'capitalize',
    textAlign: 'center',
    flex: 1,
    // marginBottom: hp(-1.8),
    textAlignVertical: 'center',
  },
  tabBarIndicator: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 1,
    // alignSelf: 'center',
    borderRadius: 2.5,
    // marginLeft: wp(12.2),
  },
  addButton: {
    position: 'absolute',
    bottom: hp(2),
    height: wp(16),
    width: wp(16),
    right: wp(2),
    backgroundColor: '#f57c00',
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {},
});
