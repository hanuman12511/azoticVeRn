import React, {Component} from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../BasicStyles';

// Images
import image1 from '../assets/images/image1.jpeg';

// Icons
import ic_delete_black from '../assets/icons/ic_delete_black.png';
import ic_down from '../assets/icons/ic_down.png';
import ic_order from '../../../assets/icons/ic_order.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//api
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';
import {showToast} from '../../../components/CustomToast';
import ProcessLoader from '../../../components/ProcessLoader';
import CancleOrder from '../../../components/CancleOrder';

export default class NewOrderTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isCancel: false,
    };
  }

  handleMoreInfo = (moreInfo) => () => {
    this.setState((prevState) => ({[moreInfo]: !prevState[moreInfo]}));
  };

  handleDetail = () => {
    const {item, fetchNewProducts} = this.props;

    this.props.nav.navigate('VendorNewOrderDetail', {
      item,
      fetchNewProducts: fetchNewProducts,
    });
  };

  renderItem = ({item}) => {
    return (
      <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
        <Text style={[styles.productName]}>{item.productName}</Text>
        <Text style={[styles.productQuantity]}>{item.quantity}</Text>
      </View>
    );
  };

  renderAddonDetail = ({item}) => {
    return (
      <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
        <Text style={styles.moreContent}>{item.name} </Text>
        <Text style={styles.moreContent}>₹ {item.price}</Text>
      </View>
    );
  };
  itemSeparator = () => <View style={{height: 4, backgroundColor: '#fff'}} />;

  render() {
    const {moreInfo, isLoading, isCancel} = this.state;
    const {
      orderId,
      orderDate,
      completeBy,
      customerName,
      customerMobile,
      orderTotal,
      customerAddress,
      customerLocation,
      orderStatus,
      productImage,
      slotsList,
      images,
      orderItems,
    } = this.props.item;

    if (isLoading) {
      return <ProcessLoader />;
    }
    if (isCancel) {
      return <CancleOrder />;
    }
    return (
      <TouchableOpacity
        onPress={this.handleDetail}
        style={[styles.orderListContainer, basicStyles.padding]}>
        <View>
          <View style={[basicStyles.directionRow]}>
            <View style={[basicStyles.flexOne, basicStyles.justifyCenter]}>
              <View>
                <View style={styles.idContainer}>
                  <View style={styles.iconCover}>
                    <Image
                      source={ic_order}
                      resizeMode="cover"
                      style={styles.idIcon}
                    />
                  </View>
                  <Text
                    style={[
                      basicStyles.text,
                      basicStyles.flexOne,
                      styles.idText,
                    ]}>
                    Order ID: {orderId}
                  </Text>
                </View>

                <FlatList
                  data={orderItems}
                  renderItem={this.renderItem}
                  keyExtractor={(item) => item.id}
                  ItemSeparatorComponent={this.itemSeparator}
                />

                <View
                  style={[
                    basicStyles.justifyBetween,
                    basicStyles.directionRow,
                    basicStyles.alignCenter,
                    styles.totalContainer,
                  ]}>
                  <Text style={styles.total}>Total</Text>
                  <Text style={styles.amount}>Rs. {orderTotal}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  orderListContainer: {
    backgroundColor: '#fff',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(2),
  },
  iconCover: {
    backgroundColor: '#F57C0020',
    height: wp(8),
    width: wp(8),
    borderRadius: 4,
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  idIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  idText: {
    fontSize: wp(3.2),
    color: '#999',
  },

  productName: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#333',
  },
  totalContainer: {
    paddingTop: wp(2),
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    marginTop: wp(2),
  },
  total: {
    fontSize: wp(4.2),
    fontWeight: '700',
    color: '#555',
  },
  amount: {
    fontSize: wp(4.2),
    color: '#F57C00',
    fontWeight: '700',
  },

  downIcon: {
    width: wp(3.5),
    aspectRatio: 1 / 1,
    marginLeft: wp(3),
  },
  moreInfoContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: wp(2),
    paddingTop: wp(2),
    // flexDirection: 'row',
  },
  moreInfoList: {
    padding: hp(1),
    borderBottomWidth: 0.5,
    borderBottomColor: '#cccccc80',
  },
  moreInfoText: {
    fontSize: wp(2.8),
  },
  addValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  quantity: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 40,
    lineHeight: 20,
    textAlign: 'center',
  },
  lessValue: {
    borderWidth: 0.5,
    borderColor: '#999',
    height: 20,
    width: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  iconRow: {
    marginRight: wp(1),
  },
  moreContentTitle: {
    fontSize: wp(3),
    fontWeight: '700',
    marginBottom: wp(0.5),
  },
  moreContent: {
    fontSize: wp(2.8),
  },
  // itemSeparator: {
  //   height: 1,
  //   backgroundColor: '#ccc',
  //   marginVertical: wp(1),
  // },
});
