import React, {useState} from 'react';
import {
  ActivityIndicator,
  TextInput,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Style
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_r_smile from '../../assets/icons/ic_r_smile.png';
import ic_r_inlove from '../../assets/icons/ic_r_inlove.png';
import ic_r_tongue from '../../assets/icons/ic_r_tongue.png';
import ic_r_shocked from '../../assets/icons/ic_r_shocked.png';
import ic_r_fire from '../../assets/icons/ic_r_fire.png';

import {WebView} from 'react-native-webview';
import Modal from 'react-native-modalbox';
import GestureRecognizer from 'react-native-swipe-gestures';
import Story from './Story';
import UserView from './UserView';
import Readmore from './Readmore';
import ProgressArray from './ProgressArray';

import {ModalContent, BottomModal} from 'react-native-modals';

const SCREEN_WIDTH = Dimensions.get('window').width;

const StoryContainer = (props) => {
  const {user, postTheComment, reportTheStory} = props;

  const {stories = []} = user || {};
  const [comment, setComment] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [isModelOpen, setModel] = useState(false);
  const [isModelOpen2, setModel2] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(15);
  const [isMoreRead, setIsReadMore] = useState(true);
  const [isReportPop, setIsReportPop] = useState(false);
  const story = stories.length ? stories[currentIndex] : {};
  const {isReadMore, url} = story || {};

  // const onVideoLoaded = (length) => {
  //   props.onVideoLoaded(length.duration);
  // };

  const changeStory = (evt) => {
    if (evt.locationX > SCREEN_WIDTH / 2) {
      nextStory();
    } else {
      prevStory();
    }
  };

  const nextStory = () => {
    if (stories.length - 1 > currentIndex) {
      setCurrentIndex(currentIndex + 1);
      setLoaded(false);
      setDuration(15);
    } else {
      setCurrentIndex(0);
      props.onStoryNext();
    }
  };

  const prevStory = () => {
    if (currentIndex > 0 && stories.length) {
      setCurrentIndex(currentIndex - 1);
      setLoaded(false);
      setDuration(15);
    } else {
      setCurrentIndex(0);
      props.onStoryPrevious();
    }
  };

  const onImageLoaded = () => {
    setLoaded(true);
  };

  const onVideoLoaded = (length) => {
    setLoaded(true);
    setDuration(length.duration);
  };

  const onPause = (result) => {
    setIsPause(result);
  };

  const onReadMoreOpen = () => {
    setIsPause(true);
    setModel(true);
    setIsReadMore(false);
  };
  const onReadMoreClose = () => {
    setIsPause(false);
    setModel2(false);
    setIsReadMore(true);
  };

  const onReportPopOpen = () => {
    setIsPause(true);
    setModel2(true);
    setIsReportPop(true);
  };

  const onReportPopClose = () => {
    setIsPause(false);
    setModel2(false);
    setIsReportPop(false);
  };

  const loading = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loading}>
          <View style={{width: 1, height: 1}}>
            <Story
              onImageLoaded={onImageLoaded}
              pause
              onVideoLoaded={onVideoLoaded}
              story={story}
            />
          </View>
          <ActivityIndicator color="white" />
        </View>
      );
    }
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const onSwipeDown = () => {
    if (!isModelOpen && !isModelOpen2) {
      props.onClose();
    } else {
      onPause(false);
      setModel(false);
      setIsReportPop(false);
    }
  };

  const onSwipeUp = () => {
    if (!isModelOpen && !isModelOpen2 && isMoreRead) {
      onPause(true);
      setModel(true);
    }
  };

  const handleComment = (changedText) => {
    setComment(changedText);
  };

  const handlePostComment = () => {
    const {id: postId} = story;
    postTheComment(comment, postId);
  };

  const reportHandler = (reason) => () => {
    const postId = stories[currentIndex].id;
    Alert.alert('Report', 'Do you want to Block?', [
      {
        text: 'No',
        onPress: async () => {
          reportTheStory(postId, false, reason);
          props.onClose();
          onPause(false);
          setModel(false);
          setIsReportPop(false);
        },
      },
      {
        text: 'Block',
        onPress: async () => {
          reportTheStory(postId, true, reason);
          props.onClose();
          onPause(false);
          setModel(false);
          setIsReportPop(false);
        },
      },
    ]);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={reportHandler(item.reason)}>
        <Text style={[basicStyles.whiteColor]}>{item.reason}</Text>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => <View style={styles.separator} />;

  let options = [
    {id: 1, reason: "It's spam"},
    {id: 2, reason: 'False information'},
    {id: 3, reason: "I just don't like it"},
    {id: 4, reason: 'Scam or fraud'},
    {id: 5, reason: "It's inappropriate"},
  ];

  const handleDeleteStory = () => {
    const {id: postId} = story;
    props.deleteTheStory(postId);
  };

  return (
    <GestureRecognizer
      onSwipeDown={onSwipeDown}
      onSwipeUp={onSwipeUp}
      config={config}
      style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={400}
        onPress={(e) => changeStory(e.nativeEvent)}
        onLongPress={() => onPause(true)}
        onPressOut={() => onPause(false)}
        style={styles.container}>
        <View style={styles.container}>
          <Story
            onImageLoaded={onImageLoaded}
            pause={isPause}
            isNewStory={props.isNewStory}
            onVideoLoaded={onVideoLoaded}
            story={story}
          />

          {loading()}

          <UserView
            name={user.username}
            profile={user.profile}
            vendorId={user.vendorId}
            onClosePress={props.onClose}
            deleteTheStory={handleDeleteStory}
            onReportPopOpen={onReportPopOpen}
          />

          {isMoreRead && <Readmore onReadMore={onReadMoreOpen} />}

          <ProgressArray
            next={nextStory}
            isLoaded={isLoaded}
            duration={duration}
            pause={isPause}
            isNewStory={props.isNewStory}
            stories={stories}
            currentIndex={currentIndex}
            currentStory={stories[currentIndex]}
            length={stories.map((_, i) => i)}
            progress={{id: currentIndex}}
          />
        </View>

        {/* {commentBox && (
            <TextInput
              style={styles.input}
              placeholder="Search"
              placeholderTextColor="#333"
              value={comment}
              onChangeText={handleComment}
            />
          )} */}
        {isReportPop === false ? (
          <View style={styles.mainPollContainer}>
            <View style={[basicStyles.directionRow]}>
              <Text style={styles.multiLineInputDesign}>
                {story.pollQuestion}
              </Text>
            </View>
            <View style={styles.pollContainer}>
              <View style={[styles.pollButtonStyle]}>
                <Text
                  style={[
                    basicStyles.textBold,
                    basicStyles.textSmall,
                    basicStyles.whiteColor,
                  ]}>
                  Yes
                </Text>
                <Text
                  style={[
                    basicStyles.textBold,
                    styles.textSmall,
                    basicStyles.whiteColor,
                  ]}>
                  {story.pollYes}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#888',
                  height: hp(4.5),
                  width: wp(0.15),
                }}
              />
              <View style={styles.pollButtonStyle}>
                <Text
                  style={[
                    basicStyles.textBold,
                    basicStyles.textSmall,
                    basicStyles.whiteColor,
                  ]}>
                  No
                </Text>
                <Text
                  style={[
                    basicStyles.textBold,
                    styles.textSmall,
                    basicStyles.whiteColor,
                  ]}>
                  {story.pollNo}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {isReportPop === false ? (
          <View style={styles.mainReactionBoxContainer}>
            <View>
              <Image source={ic_r_smile} style={styles.reactionIcon} />
              <Text
                style={[
                  styles.text,
                  basicStyles.whiteColor,
                  basicStyles.textAlign,
                  basicStyles.marginTop1,
                ]}>
                ({story.reactions.likedIt})
              </Text>
            </View>
            <View>
              <Image source={ic_r_inlove} style={styles.reactionIcon} />
              <Text
                style={[
                  styles.text,
                  basicStyles.whiteColor,
                  basicStyles.textAlign,
                  basicStyles.marginTop1,
                ]}>
                ({story.reactions.love})
              </Text>
            </View>
            <View>
              <Image source={ic_r_tongue} style={styles.reactionIcon} />
              <Text
                style={[
                  styles.text,
                  basicStyles.whiteColor,
                  basicStyles.textAlign,
                  basicStyles.marginTop1,
                ]}>
                ({story.reactions.delicious})
              </Text>
            </View>
            <View>
              <Image source={ic_r_shocked} style={styles.reactionIcon} />
              <Text
                style={[
                  styles.text,
                  basicStyles.whiteColor,
                  basicStyles.textAlign,
                  basicStyles.marginTop1,
                ]}>
                ({story.reactions.shock})
              </Text>
            </View>
            <View>
              <Image source={ic_r_fire} style={styles.reactionIcon} />
              <Text
                style={[
                  styles.text,
                  basicStyles.whiteColor,
                  basicStyles.textAlign,
                  basicStyles.marginTop1,
                ]}>
                ({story.reactions.fire})
              </Text>
            </View>
          </View>
        ) : null}

        <Modal
          style={styles.modal}
          position="bottom"
          isOpen={isModelOpen}
          onClosed={onReadMoreClose}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor="#ddd"
            value={comment}
            onChangeText={handleComment}
          />
          <TouchableOpacity style={styles.bar} onPress={handlePostComment}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // paddingTop: 30,
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    fontSize: wp(3.2),
    height: hp(5),
    paddingHorizontal: wp(5),
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: hp(2.5),
    marginBottom: hp(3),
    color: '#fff',
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontSize: wp(2.8),
  },
  textSmall: {
    fontSize: wp(2.9),
  },
  progressBarArray: {
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    width: '98%',
    height: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 55,
    width: '98%',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: 'white',
  },
  content: {width: '100%', height: '100%'},
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: wp(3),
  },
  modal2: {
    height: hp(95),
    width: '100%',
    // backgroundColor: 'rgba(0,0,0,0.3)',
    backgroundColor: '#222',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: wp(3),
    marginTop: hp(5),
  },
  bar: {
    borderWidth: 1.5,
    borderRadius: wp(6),
    borderColor: '#fff',
    height: hp(5),
    width: wp(16),
    justifyContent: 'center',
    marginLeft: wp(3),
    marginBottom: hp(3),
  },
  sendText: {
    fontSize: wp(3),
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  pollContainer: {
    borderRadius: wp(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.7)',
    // backgroundColor: '#0008',
    alignSelf: 'center',
    width: wp(37),
    height: hp(5.5),
    alignItems: 'center',
  },
  pollButtonStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5.5),
    // backgroundColor: '#333',
  },
  mainPollContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
    alignItems: 'center',
    bottom: hp(17),
    elevation: 5,
  },
  multiLineInputDesign: {
    minWidth: wp(35),
    maxWidth: wp(70),
    borderRadius: wp(1.5),
    fontSize: wp(4),
    // fontWeight: '700',
    // borderWidth: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    // backgroundColor: '#0007',
    color: '#fff',
    textAlign: 'center',
    padding: wp(1.5),
    marginBottom: wp(1.8),
  },
  mainReactionBoxContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 5,
    alignItems: 'center',
    bottom: hp(9.2),
    flexDirection: 'row',
    width: wp(80),
    justifyContent: 'space-between',
  },
  reactionIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
  },
  separator: {
    height: wp(5),
  },
  listContainer: {
    marginTop: wp(5),
    // padding: wp(2),
  },
});

export default StoryContainer;
