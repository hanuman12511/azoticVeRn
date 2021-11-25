import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import your_story from '../assets/images/your_story.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import basicStyles from '../styles/BasicStyles';

const Notification = (props) => (
  <View
    style={[
      basicStyles.padding,
      styles.notificationContainer,
      basicStyles.directionRow,
      // basicStyles.alignCenter,
    ]}>
    <View>
      <Image
        source={your_story}
        // source={{uri: props.item.name}}
        resizeMode="cover"
        style={styles.userImg}
      />
      {/* <Material name="bell" color="#fff" size={21} style={styles.iconRow} /> */}
    </View>
    <View style={basicStyles.flexOne}>
      <Text style={basicStyles.heading}>{props.item.userName}</Text>
      <Text style={styles.notificationDescription}>{props.item.comment}</Text>
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.alignCenter,
          // basicStyles.marginTop,
          styles.commentStyle,
          // basicStyles.justifyEnd,
        ]}>
        <Material name="clock-time-four-outline" color="#333" size={16} />
        <Text style={styles.notificationDate}> {props.item.date}</Text>
      </View>
    </View>
  </View>
);

export default Notification;

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    // borderTopWidth: 0.5,
    // backgroundColor: 'rgba(158, 116, 83, .12)',
    elevation: 5,
    borderRadius: 5,
  },
  iconRow: {
    backgroundColor: '#db9058',
    height: hp(5),
    width: hp(5),
    textAlign: 'center',
    lineHeight: hp(5),
    borderRadius: hp(2.5),
    marginRight: wp(3),
  },
  notificationDescription: {
    flex: 1,
    fontSize: wp(3),
    marginTop: hp(0.5),
    marginBottom: wp(1),
  },

  notificationDate: {
    fontSize: wp(3),
    textAlign: 'right',
  },
  userImg: {
    // alignSelf: 'flex-start',
    // marginTop: wp(-5),
    height: wp(10),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
    borderRadius: wp(5),
  },
  commentStyle: {
    marginTop: wp(1.2),
  },
});
