import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// eslint-disable-next-line react/prefer-stateless-function
class Readmore extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    const {onReadMore} = this.props;

    return (
      <TouchableOpacity onPress={onReadMore} style={styles.readMoreWrapper}>
        <View style={styles.readMore}>
          <FontIcon name="send" size={12} color="white" />
        </View>
        {/* <Text style={styles.readText}>Send Reply</Text> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  readMore: {
    marginTop: 5,
    width: 26,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  readText: {
    fontSize: wp(3.2),
    fontWeight: '500',
    // marginLeft: 12,
    color: 'white',
    marginTop: 5,
    textAlign: 'center',
  },
  readMoreWrapper: {
    position: 'absolute',
    bottom: 27,
    height: hp(4.5),
    aspectRatio: 1 / 1,
    borderRadius: wp(2),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0008',
    // backgroundColor: 'rgba(102,102,102,0.3)',
  },
});

export default Readmore;
