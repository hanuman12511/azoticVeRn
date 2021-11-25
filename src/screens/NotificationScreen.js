import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from './vendorScreens/VendorComponent/HeaderComponent';
import NotificationComponent from './vendorScreens/VendorComponent/NotificationComponent';
import CustomLoader from '../components/CustomLoader';
import {showToast} from '../components/CustomToast';

// Styles
import basicStyles from '../styles/BasicStyles';

//UserPreference
import {getData, clearData, KEYS} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

// import {
//   ContentLoader,
//   FacebookLoader,
//   InstagramLoader,
// } from 'react-native-easy-content-loader';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      output: null,
    };
  }

  componentDidMount() {
    this.fetchNotification();
  }

  fetchNotification = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      const userInfo = await getData(KEYS.USER_INFO);

      let params = null;
      let response = null;

      // calling api
      response = await makeRequest(
        BASE_URL + 'api/Notifications/vendorNotificationList',
        params,
        true,
        false,
      );

      // Processing Response
      if (response) {
        const {success} = response;
        if (success) {
          const {output} = response;

          this.setState({
            output,
            status: null,
            isLoading: false,
            contentLoading: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            output: null,
            contentLoading: false,
            isLoading: false,
          });
        }
        // }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <NotificationComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }
    const {output} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Notifications"
          nav={this.props.navigation}
          navAction="back"
        />
        {output ? (
          <View style={basicStyles.mainContainer}>
            <FlatList
              data={output}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <View style={basicStyles.noDataStyle}>
            <Text style={basicStyles.noDataTextStyle}>
              Notification Box Empty.
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 4,
  },
  listContainer: {
    padding: wp(2),
    // borderTopWidth: 4,
    borderTopColor: '#f5f5f5',
  },
});
