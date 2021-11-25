import React, {Component} from 'react';
import {Text, View, FlatList, StyleSheet, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import basicStyles from '../../BasicStyles';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import ic_show_more from '../../../../assets/icons/ic_show_more.png';

import {showToast} from '../../../../components/CustomToast';
import {BASE_URL, makeRequest} from '../../../../api/ApiInfo';
import {clearData} from '../../../../api/UserPreference';
import ProcessingLoader from '../../../../components/ProcessingLoader';

export default class AddCommentListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuVisible2: false,
    };
  }

  deleteComment = () => {
    Alert.alert('Reply!', 'Press Confirm to delete', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: this.handleDeleteComment},
    ]);
  };

  handleDeleteComment = async () => {
    const {commentId} = this.props;
    const {replyId} = this.props.item;

    try {
      // starting loader
      this.setState({
        isProcessing: true,
        isMenuVisible: false,
      });

      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        commentId: '',
        replyId,
      };

      // calling api

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/postCommentDelete',
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

          showToast(message);
          await this.props.fetchComments();
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
    const {reply, replierName, replierImage, replierDate} = this.props.item;

    return (
      <View style={styles.subComment}>
        <View
          style={[
            basicStyles.padding,
            styles.notificationContainer,
            basicStyles.directionRow,
            basicStyles.alignStart,
          ]}>
          <Image
            source={{uri: replierImage}}
            resizeMode="cover"
            style={styles.userImg2}
          />

          <View style={[basicStyles.flexOne]}>
            <View>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                  ]}>
                  <Text style={[styles.userNameStyle]}>{replierName}</Text>
                </View>
                <Menu
                  visible={this.state.isMenuVisible2}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({isMenuVisible2: true});
                      }}>
                      <Image
                        source={ic_show_more}
                        resizeMode="cover"
                        style={styles.showMoreIcon}
                      />
                    </TouchableOpacity>
                  }
                  onRequestClose={() => {
                    this.setState({isMenuVisible2: false});
                  }}>
                  <MenuItem onPress={this.deleteComment}>Delete Reply</MenuItem>
                </Menu>
              </View>

              <Text style={styles.notificationDescription}>{reply}</Text>
            </View>
            <View style={[basicStyles.directionRow, basicStyles.justifyEnd]}>
              <Text style={[styles.notificationDate]}>{replierDate}</Text>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                // basicStyles.marginTopHalf,
              ]}>
              <View
                style={[basicStyles.directionRow, basicStyles.alignCenter]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#fff',
  },
  iconRow: {
    backgroundColor: '#db9058',
    height: hp(5),
    width: hp(5),
    textAlign: 'center',
    lineHeight: hp(5),
    borderRadius: hp(2.5),
    marginRight: wp(2),
  },
  notificationDescription: {
    flex: 1,
    fontSize: wp(3.8),
    color: '#666',
  },
  userNameStyle: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: wp(1),
  },

  commentReply: {
    fontSize: wp(3.5),
    textAlign: 'right',
    color: '#666',
  },

  notificationDate: {
    fontSize: wp(3.5),
    textAlign: 'right',
    color: '#666',
  },

  userImg: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#000',
  },
  userImg2: {
    height: wp(8),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: '#ccc',
  },

  commentStyle: {},

  subComment: {
    borderTopWidth: 1,
    borderTopColor: '#ccc4',
    paddingLeft: wp(12),
  },
  showMoreIcon: {
    height: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  icon: {
    height: wp(4),
    aspectRatio: 1 / 1,
    opacity: 0.5,
  },
});
