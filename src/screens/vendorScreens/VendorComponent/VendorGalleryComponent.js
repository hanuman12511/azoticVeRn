import React, {Component} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// VectorIcons
import AntDesign from 'react-native-vector-icons/AntDesign';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Pop-up Module
import Modal, {ModalContent, BottomModal} from 'react-native-modals';

//slider
import {SliderBox} from 'react-native-image-slider-box';
import ImageSlider from 'react-native-image-slider';

//VideoBox
import Video from 'react-native-video';
// Style
import basicStyles from '../../../styles/BasicStyles';

export default class CusVendorsComponent extends Component {
  constructor(props) {
    super(props);
    const {likeStatus} = props.item;
    this.state = {
      likeStatus,
      profileDetailPopup: false,
    };
  }

  handleFollow = () => {
    const {likeStatus} = this.state;
    if (likeStatus === true) {
      this.setState({likeStatus: false});
    } else {
      this.setState({likeStatus: true});
    }
  };

  handleGalleryDetail = () => {
    const {item, fetchGalleryPost} = this.props;

    this.props.nav.push('VendorGalleryDetail', {
      item,
      refreshCallBack: fetchGalleryPost,
    });
  };

  // handleVendorPage = () => {
  //   this.props.nav.push('CuVendors');
  // };

  render() {
    const {
      vendorName,
      vendorImage,
      description,
      mediaType,
      mediaUrl,
      likes,
      comments,
      city,
      singleMediaImage,
    } = this.props.item;
    const {likeStatus} = this.state;
    const bufferConfig = {
      minBufferMs: 15000,
      maxBufferMs: 50000,
      bufferForPlaybackMs: 2500,
      bufferForPlaybackAfterRebufferMs: 5000,
    };

    return (
      <View style={[styles.imageContainer]}>
        <TouchableOpacity
          style={[basicStyles.container, styles.feedsContainer]}
          onPress={this.handleGalleryDetail}>
          <Image
            source={{uri: singleMediaImage}}
            resizeMode="cover"
            style={styles.imageTile}
          />
        </TouchableOpacity>

        {/* {mediaType === 'image' ? (
          <SliderBox
            images={mediaUrl}
            dotColor="#555"
            inactiveDotColor="#ccc"
            dotStyle={styles.dotStyle}
          />
        ) : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  imageTile: {
    width: '100%',
    aspectRatio: 1.1 / 1,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 15,
    marginHorizontal: -5,
  },
  imageContainer: {
    width: wp(50),
    borderWidth: 1,
    borderColor: '#fff',
  },
  contentContainer: {
    marginLeft: wp(-0.5),
  },
  orderContainer: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: wp(0.5),
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageStyle: {
    width: wp(94),
    aspectRatio: 2.5 / 1,
  },
  vectorIconRow: {
    marginHorizontal: wp(3),
  },
  galleryMenuIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    height: hp(5),
    alignItems: 'center',
    marginTop: hp(-5),
  },
  vendorImage: {
    width: wp(12),
    aspectRatio: 1 / 1,
    borderRadius: wp(6),
    marginRight: wp(2),
  },
  imgContainer: {
    width: wp(94),
  },
  VideoContainer: {
    width: wp(94),
    height: hp(20),
  },
});
