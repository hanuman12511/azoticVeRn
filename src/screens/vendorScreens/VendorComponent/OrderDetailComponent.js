import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import BasicStyles from '../BasicStyles';
//import ic_calendar from '../assets/icons/ic_calendar.png';
import new_products from '../assets/images/new_products.jpg';
import basicStyles from '../../../styles/BasicStyles';

const Payments = (props) => {
  // const handleOrderTrack = () => {
  //   //props.nav.push('OrderTracking');
  // };
  return (
    <View>
      {/* <TouchableOpacity style={styles.paymentContainer} onPress={handleOrderTrack}>
   
      <Text style={styles.bodyInfo}>{props.item.srNo}</Text>
     
      <Text style={styles.bodyInfo}>{props.item.orderId}</Text>
   
      

  </TouchableOpacity>
  <View>
  <Text style={styles.noteInfo}>{props.item.notes}</Text> */}
    </View>
  );
};

export default Payments;

const styles = StyleSheet.create({
  paymentContainer: {
    flex: 1,
    height: hp(10),
    alignItems: 'center',
    backgroundColor: '#f8f8f890',
    borderWidth: 1,
    //borderColor: '#fff',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bodyInfo: {
    fontSize: wp(5),
    color: '#fff',
    paddingHorizontal: wp(5),
  },
  noteInfo: {
    fontSize: wp(3),
    color: '#fff',
    //paddingHorizontal:wp(5),
  },
});
