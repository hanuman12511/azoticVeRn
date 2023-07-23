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
import ReplyCommentComponent from './ReplyCommentComponent';

export default class AddCommentListComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReplyComments: false,
      isMenuVisible: false,
      isProcessing: false,
    };
  }

  handleReply = () => {
    const {handleReplyUser} = this.props;
    const {commentId} = this.props.item;
    let is_reply_or_comment = 'reply';
    let isFocus = true;
    handleReplyUser(commentId, is_reply_or_comment, isFocus);
  };

  renderItem = ({item}) => (
    <ReplyCommentComponent
      item={item}
      nav={this.props.nav}
      commentId={this.props.item.commentId}
      fetchComments={this.props.fetchComments}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleShowSubCategory = () => {
    this.setState((prevState) => ({
      showReplyComments: !prevState.showReplyComments,
    }));
  };

  handleProductPickerPopup = () => {
    const {item} = this.props;

    this.props.handlePopupShow(item);
  };

  deleteComment = () => {
    Alert.alert('Comment!', 'Press Confirm to delete comment', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: this.handleDeleteComment},
    ]);
  };

  handleDeleteComment = async () => {
    const {commentId} = this.props.item;

    try {
      // starting loader
      this.setState({
        isProcessing: true,
        isMenuVisible: false,
      });

      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        commentId,
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
    this.props.nav.navigate('VendorLogin');
  };

  render() {
    const {
      userImage,
      userName,
      comment,
      replyCount,
      date,
      reply,
    } = this.props.item;
    const {showReplyComments} = this.state;
    return (
      <View>
        <View
          onPress={this.handleShowSubCategory}
          style={[
            basicStyles.padding,
            styles.notificationContainer,
            basicStyles.directionRow,
            basicStyles.alignStart,
          ]}>
          <TouchableOpacity onPress={this.handleProductPickerPopup}>
            <Image
              source={{uri: userImage}}
              resizeMode="cover"
              style={styles.userImg}
            />
          </TouchableOpacity>

          <View style={[basicStyles.flexOne]}>
            <TouchableOpacity
              onPress={this.handleShowSubCategory}
              style={
                [
                  // basicStyles.directionRow,
                  // basicStyles.alignCenter,
                  // basicStyles.justifyEnd,
                ]
              }>
              <View
                style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
                <Text style={[styles.userNameStyle]}>{userName}</Text>
                <Menu
                  visible={this.state.isMenuVisible}
                  anchor={
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({isMenuVisible: true});
                      }}>
                      <Image
                        source={ic_show_more}
                        resizeMode="cover"
                        style={styles.showMoreIcon}
                      />
                    </TouchableOpacity>
                  }
                  style={{
                    right: wp(2),
                    left: wp(92),
                    top: hp(13),
                    width: wp(40),
                  }}
                  onRequestClose={() => {
                    this.setState({isMenuVisible: false});
                  }}>
                  <MenuItem onPress={this.deleteComment}>
                    Delete Comment
                  </MenuItem>
                </Menu>
              </View>

              {comment ? (
                <Text style={styles.notificationDescription}>{comment}</Text>
              ) : null}
            </TouchableOpacity>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.justifyBetween,
                basicStyles.marginTopHalf,
              ]}>
              <View style={basicStyles.directionRow}>
                {/* <TouchableOpacity style={[basicStyles.marginRight]}>
                  <Image
                    source={ic_edit_black}
                    resizeMode="cover"
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={[basicStyles.marginRight]}>
                  <Image
                    source={ic_delete_black}
                    resizeMode="cover"
                    style={styles.icon}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    basicStyles.marginRightHalf,
                  ]}
                  onPress={this.handleReply}>
                  {replyCount ? (
                    <Text style={[styles.notificationDate]}>
                      Reply ({replyCount})
                    </Text>
                  ) : (
                    <Text style={[styles.notificationDate]}>Reply</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[styles.notificationDate]}>{date}</Text>
              </View>
            </View>
          </View>
        </View>

        {showReplyComments && (
          <View style={[basicStyles.flexOne]}>
            <FlatList
              data={reply}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.flatStyle}
            />
          </View>
        )}
        {this.state.isProcessing && <ProcessingLoader />}
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
