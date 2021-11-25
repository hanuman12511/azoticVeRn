import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import ImageSlider from 'react-native-image-slider';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// icons
import ic_like_fill from '../../../assets/icons/ic_like_fill.png';
import ic_comment_border from '../../../assets/icons/ic_comment_border.png';
import ic_send from '../../../assets/icons/ic_send.png';
import ic_show_more from '../../../assets/icons/ic_show_more.png';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Style
import basicStyles from '../../../styles/BasicStyles';

// Components
import HeaderComponent from '../../vendorScreens/VendorComponent/HeaderComponent';
import ProcessLoader from '../../../components/ProcessingLoader';
import VendorGalTabCommentComponent from './VendorGalTabCommentComponent';

// UserPreference
import {KEYS, getData, clearData} from '../../../api/UserPreference';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {showToast} from '../../../components/CustomToast';

export default class VendorGalleryDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorName: '',
      city: '',
      vendorImage: null,
      mediaUrl: '',
      likes: '',
      description: '',
      comments: '',
      postTime: '',
      likedBy: '',
      isMenuVisible: false,
      isProcessing: false,
    };
  }

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleCommentScreen = async () => {
    const item = this.props.navigation.getParam('item', null);

    this.props.navigation.navigate('VendorComment', {item});
  };

  deletePost = () => {
    Alert.alert('Delete post!', 'Press Confirm to delete post', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Confirm', onPress: this.handleDeletePost},
    ]);
  };

  handleDeletePost = async () => {
    const item = this.props.navigation.getParam('item', null);

    const {postId} = item;

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

  renderItem = ({item}) => (
    <VendorGalTabCommentComponent
      item={item}
      nav={this.props.navigation}
      handleLikeUnlike={this.handleLikeUnlike}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const item = this.props.navigation.getParam('item', null);

    const {
      vendorName,
      city,
      vendorImage,
      mediaUrl,
      likes,
      description,
      commentCount,
      comments,
      postTime,
      likedBy,
    } = item;

    const {isMenuVisible} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          headerTitle="Post"
          nav={this.props.navigation}
          navAction="back"
          showCartIcon
        />

        <ScrollView style={basicStyles.mainContainer}>
          <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            <Image
              source={{uri: vendorImage}}
              resizeMode="cover"
              style={styles.newsFeedsImage}
            />
            <View style={basicStyles.flexOne}>
              <Text style={basicStyles.heading}>{vendorName}</Text>
              <Text style={[basicStyles.textSmall, basicStyles.grayColor]}>
                {postTime}
              </Text>
            </View>

            <Menu
              visible={isMenuVisible}
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
              style={{right: wp(2), left: wp(92), top: hp(13), width: wp(30)}}
              onRequestClose={() => {
                this.setState({isMenuVisible: false});
              }}>
              <MenuItem onPress={this.deletePost}>Delete Post</MenuItem>
            </Menu>
          </View>

          <Text
            style={[
              basicStyles.text,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfBottom,
              basicStyles.marginTopHalf,
            ]}>
            {/* <Text style={basicStyles.textBold}>{vendorName}</Text>  */}
            {description}
          </Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyCenter,
              {borderWidth: 0.3, borderColor: '#888'},
            ]}>
            {/* <Image
              source={vendorImage}
              resizeMode="cover"
              style={styles.imageBig}
            /> */}
            <ImageSlider
              images={mediaUrl}
              style={{width: wp(100), aspectRatio: 1 / 1}}
            />
          </View>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.paddingHorizontal,
              basicStyles.paddingHalfVentricle,
            ]}>
            <TouchableOpacity
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                styles.likeBtnActive,
              ]}>
              <Image
                source={ic_like_fill}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              <Text style={[basicStyles.text, styles.activeText]}>{likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handleCommentScreen}
              style={[
                basicStyles.marginRight,
                basicStyles.alignCenter,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_comment_border}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              <Text style={basicStyles.text}>{commentCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.handelComment}
              style={[
                basicStyles.marginRight,
                basicStyles.directionRow,
                basicStyles.alignCenter,
              ]}>
              <Image
                source={ic_send}
                resizeMode="cover"
                style={basicStyles.iconRowSmallMargin}
              />
              {/* <Text style={basicStyles.text}>11</Text> */}
            </TouchableOpacity>
          </View>

          <Text style={[basicStyles.text, basicStyles.paddingHorizontal]}>
            <Text style={[basicStyles.text, basicStyles.textBold]}>
              {likedBy}
            </Text>
            <Text style={basicStyles.grayColor}> liked this post.</Text>
          </Text>

          <TouchableOpacity onPress={this.handleCommentScreen}>
            <Text
              style={[
                basicStyles.headingLarge,
                basicStyles.paddingHorizontal,
                basicStyles.marginTop,
              ]}>
              All Comments ({commentCount})
            </Text>
          </TouchableOpacity>

          <FlatList
            data={comments}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={this.itemSeparator}
            contentContainerStyle={styles.listContainer}
          />
        </ScrollView>
        {this.state.isProcessing && <ProcessLoader />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  newsFeedsImage: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(2),
    borderColor: '#666',
    borderWidth: 0.5,
  },
  showMoreIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },

  imageBig: {
    width: wp(92),
    aspectRatio: 1 / 1,
  },
  likeBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f57c0040',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    marginRight: wp(2),
  },
  activeText: {
    color: '#f57c00',
    fontWeight: 'bold',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
  commentContainer: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc4',
  },
});
