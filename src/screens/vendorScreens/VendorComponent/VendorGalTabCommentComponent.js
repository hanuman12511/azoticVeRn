import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Style
import basicStyles from '../../../styles/BasicStyles';

export default class GalTabCommentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {comment, date, userImage, userName} = this.props.item;
    return (
      <View
        style={[
          basicStyles.padding,
          basicStyles.directionRow,
          styles.commentContainer,
        ]}>
        <Image
          source={{uri: userImage}}
          resizeMode="cover"
          style={styles.userImg}
        />
        <View style={basicStyles.flexOne}>
          <Text style={basicStyles.heading}>{userName}</Text>
          <Text>{comment}</Text>

          <View
            style={[
              basicStyles.directionRow,
              basicStyles.justifyBetween,
              basicStyles.marginTopHalf,
            ]}>
            <Text style={basicStyles.text}></Text>
            <Text style={basicStyles.grayColor}>{date}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  commentContainer: {
    borderBottomWidth: 4,
    borderBottomColor: '#ccc4',
  },
  userImg: {
    width: wp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(5),
    marginRight: wp(3),
  },
});
