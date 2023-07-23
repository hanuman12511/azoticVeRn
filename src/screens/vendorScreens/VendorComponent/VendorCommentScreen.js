import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  InteractionManager,
  Keyboard,
} from 'react-native';

// Libraries
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommentUserDetailScreen from './Comments/CommentUserDetailScreen';

// Components
import HeaderComponent from '../../vendorScreens/VendorComponent/HeaderComponent';
import {showToast} from '../../../components/CustomToast';
import ProcessingLoader from '../../../components/ProcessingLoader';
import AddCommentListComponent from './Comments/AddCommentListComponent';
import Modal, {ModalContent, BottomModal} from 'react-native-modals';

//Images
import your_story from '../../../assets/images/your_story.png';

// Styles
import basicStyles from '../BasicStyles';

// API
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';

// User Preference
import {clearData} from '../../../api/UserPreference';

import {FacebookLoader} from 'react-native-easy-content-loader';

export default class VendorCommentScreen extends Component {
  constructor(props) {
    super(props);

    const item = props.navigation.getParam('item', null);
    const {postId, vendorImage} = item;

    this.state = {
      postId,
      vendorImage,
      contentLoading: false,
      isProcessing: false,
      comments: null,
      comment: '',
      status: '',
      loadMore: false,
      offset: 0,
      commentId: null,
      is_reply_or_comment: 'comment',
      placeholderUpdate: 'Enter Comment',
      canLoad: true,
      isListRefreshing: false,
      showFormPopup: false,
      buttonType: 'post',
      profileDate: {},
      isFocus: false,
    };
  }

  inputRef = React.createRef();

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = async () => {
    const {comments: oldComments, offset, postId} = this.state;

    try {
      // starting loader
      this.setState({isLoading: true});

      const params = {
        postId,
        offset,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/viewPostComments',
        params,
        true,
      );

      // Processing Response

      console.log('====================================');
      console.log(response);
      console.log('====================================');

      if (response) {
        this.setState({
          isLoading: false,
          isProcessing: false,
          contentLoading: false,
          isListRefreshing: false,
        });
        const {success} = response;

        if (success) {
          const {comments, loadMore} = response;

          if (loadMore === false) {
            this.setState({canLoad: false});
            return;
          }

          let newComments = comments;
          if (oldComments !== null && offset !== 0) {
            oldComments.push(...comments);
            newComments = oldComments;
          }

          this.setState({
            comments: newComments,
            status: null,
            isLoading: false,
            contentLoading: false,
            isListRefreshing: false,
          });
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

          this.setState({
            status: message,
            comments: null,
            contentLoading: false,
            isLoading: false,
            isListRefreshing: false,
          });
        }

        // }
      } else {
        this.setState({
          comments: null,
          status: 'No comments! Be the first to comment',
          isProcessing: false,
          isLoading: false,
          contentLoading: false,
          isListRefreshing: false,
        });
        showToast('Network Request Error...');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handlePostComment = async () => {
    Keyboard.dismiss();
    const {comment, postId, commentId, is_reply_or_comment} = this.state;

    // validations
    if (comment.trim() === '') {
      Alert.alert('Alert', 'Please enter comment!', [{text: 'OK'}], {
        cancelable: false,
      });
      this.setState({comment: ''});
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true, contentLoading: true});

      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        postId,
        comment,
        commentId,
        is_reply_or_comment,
      };

      // calling api

      const response = await makeRequest(
        BASE_URL + 'api/Vendors/vendorCommentPost',
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
          comment: '',
        });

        if (success) {
          const {message} = response;

          this.setState({
            is_reply_or_comment: 'comment',
            placeholderUpdate: 'Enter comment',
          });
          await this.fetchComments();

          showToast(message);
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
    this.props.navigation.navigate('Login');
  };

  handleReplyUser = (commentId, is_reply_or_comment, isFocus) => {
    let placeholderUpdate = 'Enter reply';
    this.setState({
      // isFocus,
      buttonType: 'cancel',
      commentId,
      is_reply_or_comment,
      placeholderUpdate,
    });
    this.focusInputWithKeyboard();
  };

  handleCancelReply = () => {
    let placeholderUpdate = 'Enter Comment';
    Keyboard.dismiss();
    this.setState({
      buttonType: 'post',
      commentId: null,
      is_reply_or_comment: 'comment',
      placeholderUpdate,
    });
  };

  handleProductPickerPopupShow = (
    productSizePickerPopup,
    showProductSizePickerPopup,
  ) => {
    this.productSizePickerPopup = productSizePickerPopup;
    this.setState({showProductSizePickerPopup});
  };

  renderItem = ({item}) => (
    <AddCommentListComponent
      item={item}
      nav={this.props.navigation}
      handleReplyUser={this.handleReplyUser}
      handlePopupShow={this.handleProfilePopup}
      fetchComments={this.fetchComments}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

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

  handleComment = comment => {
    const {is_reply_or_comment} = this.state;
    if (is_reply_or_comment === 'reply' && comment === '') {
      this.setState({comment, buttonType: 'cancel'});
    } else {
      this.setState({comment, buttonType: 'post'});
    }
    this.setState({comment});
  };

  renderFooter = () => {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.loadMore) {
      return null;
    }

    this.setState({loadMore: true});

    return <ActivityIndicator style={{color: '#000'}} />;
  };

  handleLoadMore = async () => {
    let {offset, canLoad, comments} = this.state;
    if (comments.length < 15) {
      return;
    }
    try {
      if (canLoad) {
        var offs = ++offset;
        await this.setState({offset: offs});

        await this.fetchComments(); // method for API call
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleProfilePopup = async item => {
    await this.setState({profileDate: item});
    this.setState({showFormPopup: true});
  };

  closePopup = () => {
    this.setState({showFormPopup: false});
  };

  focusInputWithKeyboard() {
    InteractionManager.runAfterInteractions(() => {
      this.inputRef.current.focus();
    });
  }

  render() {
    const {
      contentLoading,
      comments,
      status,
      placeholderUpdate,
      showProductSizePickerPopup,
      buttonType,
      profileDate,
      isFocus,
      vendorImage,
    } = this.state;

    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          headerTitle="Comments"
          nav={this.props.navigation}
          navAction="back"
          showAccountIcon
        />
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={basicStyles.flexOne}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={basicStyles.mainContainer}>
            {contentLoading === true ? (
              <View>
                <FacebookLoader active loading={contentLoading} />
                <FacebookLoader active loading={contentLoading} />
                <FacebookLoader active loading={contentLoading} />
              </View>
            ) : (
              <View style={[basicStyles.flexOne, {height: hp(75)}]}>
                {comments ? (
                  <FlatList
                    data={comments}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                    refreshing={this.state.isListRefreshing}
                    onRefresh={this.handleListRefresh}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReachedThreshold={0.2}
                    onEndReached={this.handleLoadMore.bind(this)}
                  />
                ) : (
                  <View style={basicStyles.noDataStyle}>
                    <Text
                      style={[basicStyles.noDataTextStyle, {width: wp(60)}]}>
                      {status}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
          <View
            // style={{marginTop: hp(-0.5)}}
            style={[styles.messageContainer]}>
            <Image
              source={{uri: vendorImage}}
              resizeMode="cover"
              style={styles.userImg}
            />
            <TextInput
              ref={this.inputRef}
              placeholder={placeholderUpdate}
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={8}
              style={styles.multiLineInputDesign}
              value={this.state.comment}
              onChangeText={this.handleComment}
            />
            {buttonType === 'post' ? (
              <TouchableOpacity
                underlayColor="transparent"
                onPress={this.handlePostComment}
                style={[styles.postButton]}>
                <Text style={[basicStyles.heading, basicStyles.themeColor]}>
                  Post
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                underlayColor="transparent"
                onPress={this.handleCancelReply}
                style={[styles.postButton]}>
                <Text style={[basicStyles.heading, basicStyles.themeColor]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAwareScrollView>
        {this.state.isProcessing && <ProcessingLoader />}

        {/* <BottomModal
          visible={this.state.showQualityPopup}
          onTouchOutside={() => this.setState({showQualityPopup: false})}
          // modalStyle={{  }}
        >
          <ModalContent
            style={{
              // flex: 1,
              // backgroundColor: 'fff',
              minHeight: hp(30),
            }}>
            <View style={styles.popupContainer}>
              <Text>Hello</Text>
            </View>
          </ModalContent>
        </BottomModal> */}

        {/* {showProductSizePickerPopup && this.productSizePickerPopup} */}

        {this.state.showFormPopup && (
          <CommentUserDetailScreen
            item={profileDate}
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
        )}

        {/* <FooterComponent nav={this.props.navigation} /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {},
  listContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },

  multiLineInputDesign: {
    fontSize: wp(3.5),
    flex: 1,
    // textAlignVertical: 'top',
    height: hp(5.5),
    margin: wp(2),
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: hp(3),
    paddingHorizontal: wp(4),
    backgroundColor: '#ccc4',
  },
  postButton: {
    paddingHorizontal: wp(1.5),
    paddingVertical: wp(1.5),
    // position: 'absolute',
    // right: wp(4),
    // bottom: wp(4),
    borderRadius: 5,
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
  },
});
