import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../../../../styles/BasicStyles';

// Images

const PopupDemoComponent = (props) => {
  const {handlePopupShow, item} = props;

  const {
    commented,
    followedVendors,
    likedDishes,
    userBio,
    userImage,
    userName,
  } = item;

  let parentView = null;

  const setViewRef = (ref) => {
    parentView = ref;
  };

  //   const handleStartShouldSetResponder = (event) => {
  //     if (parentView._nativeTag === event.target) {
  //       props.closePopup();
  //     }
  //   };
  const handleStartShouldSetResponder = (event) => {
    if (parentView._nativeTag === event.target._nativeTag) {
      props.closePopup();
    }
  };
  // const handleProductPickerPopup = () => {
  //   handlePopupShow(null, false);
  // };

  return (
    <View
      ref={setViewRef}
      onStartShouldSetResponder={handleStartShouldSetResponder}
      style={styles.modalContainer}>
      <View style={styles.popupContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: userImage}}
            resizeMode="cover"
            style={styles.profileImage}
          />
        </View>

        <Text
          style={[
            basicStyles.headingXLarge,
            basicStyles.textAlign,
            basicStyles.marginVentricleHalf,
          ]}>
          {userName}
        </Text>

        {userBio !== '' ? (
          <Text
            style={[
              basicStyles.textLarge,
              basicStyles.textAlign,
              basicStyles.marginBottomHalf,
            ]}>
            {userBio}
          </Text>
        ) : null}

        <View style={[basicStyles.directionRow, basicStyles.justifyAround]}>
          <View style={styles.likeTile}>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#777'}]}>
              Followed Vendors
            </Text>
            <Text style={[basicStyles.headingLarge]}>{followedVendors}</Text>
          </View>
          <View style={styles.likeTile}>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#777'}]}>
              Likes
            </Text>
            <Text style={[basicStyles.headingLarge]}>{likedDishes}</Text>
          </View>
          <View style={styles.likeTile}>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#777'}]}>
              Comments
            </Text>
            <Text style={[basicStyles.headingLarge]}>{commented}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PopupDemoComponent;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    zIndex: 999,
    justifyContent: 'flex-end',
  },
  popupContainer: {
    backgroundColor: '#fff',
    padding: wp(5),
    borderTopRightRadius: wp(3),
    borderTopLeftRadius: wp(3),
    width: wp(100),
  },
  likeTile: {
    paddingVertical: wp(4),
    alignItems: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    width: wp(24),
    height: wp(24),
    borderRadius: wp(12),
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    alignSelf: 'center',
    width: wp(22),
    height: wp(22),
    borderRadius: wp(11),
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
