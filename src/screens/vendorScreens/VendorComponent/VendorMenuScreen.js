import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Alert,
  clearData,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {KEYS, getData} from '../../../api/UserPreference';

// Components
import VendorMenuTabComponent from '../../vendorScreens/VendorComponent/VendorMenuTabComponent';

// Styles
import basicStyles from '../../../styles/BasicStyles';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';

export default class MenuScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: [],
      status: '',
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.showMenuList();
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

  showMenuList = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      if (!userInfo) {
        return;
      }
      const {vendorCode} = userInfo;
      const params = {vendorCode};
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getMenuList',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {menu} = response;
          this.setState({menu, status: message, isListRefreshing: false});
        } else {
          this.setState({menu: null, status: message, isListRefreshing: false});
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

  renderItem = ({item}) => (
    <VendorMenuTabComponent
      item={item}
      nav={this.props.navigation}
      handleQualityPopup={this.handleQualityPopup}
      showMenuList={this.showMenuList}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleAddItems = () => {
    this.props.navigation.navigate('AddMenuItems', {
      refreshCallback: this.showMenuList,
    });
  };

  render() {
    // const {showQualityPopup} = this.state;
    return (
      <View style={styles.container}>
        {/* <View style={basicStyles.paddingTop}> */}
        {this.state.menu ? (
          <FlatList
            data={this.state.menu}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
            refreshing={this.state.isListRefreshing}
            onRefresh={this.handleListRefresh}
          />
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>{this.state.status}</Text>
          </View>
        )}
        {/* </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: wp(2),
  },

  topOptionImg: {
    height: wp(15),
    aspectRatio: 1 / 1,
    borderRadius: wp(10),
    marginVertical: hp(0.5),
  },
  screenInfo: {
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: wp(20),
    marginHorizontal: wp(1),
  },
  screenInfoTitle: {
    color: '#fff',
    fontSize: wp(3),
    textAlign: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: wp(3.2),
    textAlign: 'center',
    color: '#fff',
  },
  filterButton: {
    marginVertical: hp(2),
    backgroundColor: '#333',
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  separator: {
    height: 4,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    // marginTop: hp(2),
    padding: wp(3),
  },
  addButton: {
    position: 'absolute',
    bottom: hp(2),
    right: wp(2),
    backgroundColor: '#f57c00',
    borderRadius: 26,
  },
  statusStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusMessage: {
    fontSize: wp(3.5),
  },
});
