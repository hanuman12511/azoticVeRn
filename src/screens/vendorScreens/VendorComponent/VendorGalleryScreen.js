import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {KEYS, clearData, getData} from '../../../api/UserPreference';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
//basciStyles
import basicStyles from '../BasicStyles';
// Components
// import HeaderComponent from '../components/HeaderComponent';
import VendorGalleryComponent from '../../vendorScreens/VendorComponent/VendorGalleryComponent';
//component
import HeaderComponent from '../../vendorScreens/VendorComponent/HeaderComponent';

export default class GalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      status: '',
      isListRefreshing: false,
      isLoading: true,
    };
  }
  componentDidMount() {
    this.fetchGalleryPost();
    // this.props.fetchLiveStories();
  }
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
  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
      console.log('there is an error in sign-out');
    }
  };
  fetchGalleryPost = async () => {
    try {
      this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);
      const {vendorCode} = userInfo;
      const params = {vendorCode};
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/vendorGalleryListing',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        this.setState({isLoading: false});
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {posts} = response;
          this.setState({posts, status: message, isListRefreshing: false});
        } else {
          this.setState({
            posts: null,
            status: message,
            isListRefreshing: false,
            isLoading: false,
          });
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
      } else {
        this.setState({isLoading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderItem = ({item}) => (
    <VendorGalleryComponent
      item={item}
      nav={this.props.navigation}
      fetchGalleryPost={this.fetchGalleryPost}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleAddItems = () => {
    this.props.navigation.navigate('CameraComponent');
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color="#f57c00"
          style={{marginTop: hp(12)}}
        />
      );
    }

    return (
      <View
        style={basicStyles.flexOne}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={this.state.isListRefreshing}
        //     onRefresh={this.handleListRefresh}
        // }  />
      >
        <View style={styles.flatContainer}>
          {this.state.posts ? (
            <FlatList
              data={this.state.posts}
              renderItem={this.renderItem}
              numColumns="2"
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
              // refreshing={this.state.isListRefreshing}
              // onRefresh={this.handleListRefresh}
            />
          ) : (
            <View style={basicStyles.noDataStyle}>
              <Text style={basicStyles.noDataTextStyle}>
                {this.state.status}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusMessage: {
    fontSize: 20,
  },
  flatContainer: {
    flex: 1,
  },
  textStyle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  // separator: {
  //   height: wp(2),
  // },
  listContainer: {
    // paddingVertical: wp(3),
  },
  addButton: {
    position: 'absolute',
    bottom: hp(3),
    right: wp(2),
    backgroundColor: '#f6416c',
    borderRadius: 26,
  },
  // addIcon: {
  //   borderWidth: 3,
  //   borderColor: '#00000080',
  //   borderRadius: 26,
  //   height: 42,
  //   width: 42,
  // },
});
