import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../BasicStyles';

const Notification = (props) => {
  const {title, message, image, date} = props.item;
  return (
    <View style={[basicStyles.padding, styles.notificationContainer]}>
      <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
        <View style={basicStyles.flexOne}>
          <Text style={[basicStyles.headingLarge, styles.notificationTitle]}>
            {title}
          </Text>

          <Text style={styles.notificationDescription}>{message}</Text>
          <Text style={styles.notificationDate}>{date}</Text>
        </View>

        <Image source={{uri: image}} resizeMode="cover" style={styles.img} />
      </View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: '#f2f1f1',
    borderRadius: 5,
  },

  notificationDescription: {
    fontSize: wp(3.5),
    marginVertical: wp(1),
    color: '#222',
  },

  notificationDate: {
    fontSize: wp(2.7),
  },
  notificationTitle: {
    marginBottom: wp(1),
  },
  img: {
    width: wp(22),
    aspectRatio: 1 / 1,
    borderRadius: wp(11),
    marginLeft: wp(3),
  },
});
