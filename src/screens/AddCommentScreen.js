import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableHighlight,
  Alert,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import HeaderComponent from './vendorScreens/VendorComponent/HeaderComponent';
import {showToast} from '../components/CustomToast';
import ProcessingLoader from '../components/ProcessLoader';
import AddCommentListComponent from '../components/AddCommentListComponent';

// Styles
import basicStyles from '../styles/BasicStyles';

// UserPreference
import {KEYS, storeData, getData} from '../api/UserPreference';

// API
import {BASE_URL, makeRequest} from '../api/ApiInfo';

import {
  ContentLoader,
  FacebookLoader,
  InstagramLoader,
} from 'react-native-easy-content-loader';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentLoading: true,
      isProcessing: false,
      comments: null,
      comment: '',
      status: '',
    };
  }

  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});
      const postId = this.props.navigation.getParam('postId', null);
      // const userInfo = await getData(KEYS.USER_INFO);

      const params = {
        postId,
      };

      // calling api

      const response = await makeRequest(
        BASE_URL + 'api/Customers/viewComments',
        params,
        true,
      );

      // Processing Response
      if (response) {
        const {success} = response;

        if (success) {
          const {comments} = response;

          this.setState({
            comments,
            status: null,
            isLoading: false,
            contentLoading: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            comments: null,
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

  // handlePostComment = async () => {
  //   const { comment } = this.state;

  //   // validations
  //   if (comment.trim() === '') {
  //     Alert.alert('', 'Please enter comment!', [{ text: 'OK' }], {
  //       cancelable: false,
  //     });
  //     return;
  //   }

  //   try {
  //     // starting loader
  //     this.setState({ isProcessing: true, contentLoading: true });

  //     const postId = this.props.navigation.getParam('postId', null);

  //     // const userInfo = await getData(KEYS.USER_INFO);

  //     const params = {
  //       postId,
  //       comment,
  //     };

  //     // calling api

  //     const response = await makeRequest(
  //       BASE_URL + 'Customers/commentPost',
  //       params,
  //       true,
  //       // true,
  //     );

  //     // Processing Response
  //     if (response) {
  //       const { success } = response;

  //       this.setState({
  //         contentLoading: false,
  //         isProcessing: false,
  //         comment: '',
  //       });

  //       if (success) {
  //         const { message } = response;
  //         this.fetchComments();
  //         showToast(message);
  //       } else {
  //         const { message } = response;
  //         // this.setState({status: message});
  //         showToast(message);
  //       }
  //     } else {
  //       this.setState({
  //         isProcessing: false,
  //         isLoading: false,
  //       });
  //       showToast('Network Request Error...');
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  renderItem = ({item}) => (
    <AddCommentListComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleCommentChange = (comment) => {
    this.setState({comment});
  };

  render() {
    const {contentLoading, comments, status} = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <HeaderComponent
          // showHeaderLogo
          headerTitle="Comments"
          nav={this.props.navigation}
          navAction="back"
        />

        <View style={basicStyles.mainContainer}>
          {/* <View>
            <TextInput
              placeholder="Enter Your Comment"
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={8}
              style={styles.multiLineInputDesign}
              value={this.state.comment}
              onChangeText={this.handleCommentChange}
            />
            <TouchableHighlight
              underlayColor="transparent"
              onPress={this.handlePostComment}
              style={[styles.postButton, basicStyles.pinkBgColor]}>
              <Text style={[basicStyles.text, basicStyles.whiteColor]}>
                Post
              </Text>
            </TouchableHighlight>
          </View> */}

          {contentLoading === true ? (
            <View>
              <FacebookLoader active loading={contentLoading} />
              <FacebookLoader active loading={contentLoading} />
              <FacebookLoader active loading={contentLoading} />
            </View>
          ) : (
            <View style={basicStyles.flexOne}>
              {comments ? (
                <FlatList
                  data={comments}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={this.itemSeparator}
                  contentContainerStyle={styles.listContainer}
                />
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>{status}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        {this.state.isProcessing && <ProcessingLoader />}
        {/* <FooterComponent nav={this.props.navigation} /> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  separator: {
    height: wp(0.5),
    // borderWidth: 1,
  },
  listContainer: {
    padding: wp(2),
    // backgroundColor: '#5555',
  },

  multiLineInputDesign: {
    fontSize: wp(3),
    // flex: 1,
    textAlignVertical: 'top',
    height: hp(10),
    margin: wp(2),
    borderWidth: 1,
    borderColor: '#cccccc80',
    borderRadius: 5,
    padding: wp(2),
  },
  postButton: {
    paddingHorizontal: wp(3),
    paddingVertical: wp(1.5),
    position: 'absolute',
    right: wp(4),
    bottom: wp(4),
    borderRadius: 5,
  },
});
