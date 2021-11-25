import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_plus from '../assets/icons/ic_plus.png';
import replies_on_stories from '../assets/images/replies_on_stories.jpg';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Style
import basicStyles from '../BasicStyles';

export default class LiveTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleOrderCompleteDetail=()=>{
    this.props.nav.push('OrderDetail');
  };

  render() {
    const {
      VendorName,
      items,
      TotalOrder,
      Date,
      image,
      deliverTime,
    } = this.props.item;

    return (
      <View style={styles.mainContainer}>
       <Text style={[basicStyles.grayColor, basicStyles.textBold, styles.dateTimeContainer]}>
              Item(s) : {items}
            </Text>
      
      <TouchableOpacity style={styles.orderContainer} onPress={this.handleOrderCompleteDetail}>
       
        <Image source={image} resizeMode="cover" style={styles.imageStyle} />

        <View style={styles.contentContainer}>
          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text
              style={[
                basicStyles.grayColor,
                basicStyles.textBold,
                basicStyles.marginRight,
                basicStyles.flexOne,
              ]}>
              Complete By 
            </Text>
             <Text style={[styles.textStyle]}>{Date}, {deliverTime}</Text>
          </View>

          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
        <Text style={[basicStyles.blackColor, basicStyles.textBold]}>
            {VendorName}
          </Text>
          </View>

         

          <View style={styles.barContainer}>
            {/* <View style={styles.barStyle} /> */}
          </View>

        

          <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
            <Text style={[styles.textStyle, basicStyles.textBold]}>
              TotalOrder
            </Text>
            <Text style={[styles.textStyle]}>{TotalOrder}</Text>
          </View>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer:{
     flex: 1,
    marginVertical: hp(0.5),
   
    //alignItems: 'center',
    backgroundColor: 'rgba(255,255,240,0.7)',
    borderRadius: wp(2),
  },
  orderContainer: {
    flex: 1,
    marginVertical: hp(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: wp(2),
  },
  contentContainer: {
    width: wp(60),
  },
  barContainer: {
    height: hp(2),
    width: wp(38),
    marginVertical: hp(0.5),
    //borderWidth: 1,
    borderColor: '#318956',
    borderRadius: 2,
  },
  barStyle: {
    height: hp(2),
    width: wp(26),
    backgroundColor: '#318956',
  },
  imageStyle: {
    //marginTop: wp(1),
    width: hp(15),
    aspectRatio: 1 / 1,
    margin: wp(1.5),
    borderRadius: wp(2),
  },
  pmTextStyle: {
    textAlign: 'right',
    fontSize: wp(3),
  },
  textStyle: {
    color:'#000',
    fontSize: wp(3.2),
  },
  dateTimeContainer:{
   marginLeft: wp(4),
   marginTop:hp(1),
  },
});
