import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../BasicStyles';

// Icons
import ic_food from '../assets/icons/ic_food.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Modal, {ModalContent, BottomModal} from 'react-native-modals';

export default class ToCompleteItemsTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idPopUp: false,
    };
  }

  handleDetail = () => {
    this.setState({idPopUp: true});
  };

  renderIdView = ({item, index}) => {
    console.log(index);
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          basicStyles.marginHorizontalHalf,
        ]}>
        <View style={[basicStyles.directionRow, basicStyles.justifyCenter]}>
          <Text
            style={[
              basicStyles.textBold,
              basicStyles.grayColor,
              basicStyles.textAlign,
              {marginRight: wp(2), width: wp(5)},
            ]}>
            {index + 1}
          </Text>
          <Text style={[basicStyles.textBold]}>Order Id :</Text>
        </View>
        <Text style={[basicStyles.textBold]}># {item.orderId}</Text>
      </View>
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {
      productId,
      productName,
      itemInOrder,
      totalRegularOrder,
      totalCustomOrder,
      orderIds,
      productImage,
    } = this.props.item;

    return (
      <View>
        <TouchableOpacity
          onPress={this.handleDetail}
          style={[styles.orderListContainer]}>
          <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: productImage}}
                resizeMode="cover"
                style={styles.cartImage}
              />
            </View>

            <View
              style={[
                basicStyles.flexOne,
                basicStyles.justifyCenter,
                basicStyles.paddingHalfVertical,
              ]}>
              <Text style={styles.orderName}>{productName}</Text>
              <Text style={styles.orderItems}>
                Items in Order : {itemInOrder}
              </Text>
              <View style={[basicStyles.directionRow, basicStyles.alignCenter]}>
                <Text style={[basicStyles.textLight]}>
                  Regular Orders ({totalRegularOrder})
                </Text>
                <Text
                  style={[basicStyles.marginHorizontal, basicStyles.textLight]}>
                  |
                </Text>
                <Text style={[basicStyles.textLight]}>
                  Custom Orders ({totalCustomOrder})
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.idPopUp}
          onTouchOutside={() => this.setState({idPopUp: false})}
          // modalStyle={{  }}
        >
          <ModalContent
            style={{
              // flex: 1,
              // backgroundColor: 'fff',
              height: hp(65),
              width: wp(85),
            }}>
            <View style={[basicStyles.flexOne]}>
              <Text
                style={[
                  basicStyles.headingLarge,
                  basicStyles.textAlign,
                  basicStyles.marginBottom,
                ]}>
                Order Id(s)
              </Text>
              <FlatList
                data={orderIds}
                renderItem={this.renderIdView}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={true}
              />
            </View>
          </ModalContent>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  orderListContainer: {
    // marginVertical: hp(0.5),
    backgroundColor: '#fff',
    // borderBottomRightRadius: wp(5),
    // borderTopLeftRadius: wp(5),
    // marginTop: hp(1),
    // elevation: 5,
    paddingVertical: wp(3),
  },
  imageContainer: {
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#ccc8',
    marginRight: wp(2),
  },
  cartImage: {
    width: wp(20),
    aspectRatio: 1 / 1,
    borderRadius: 5,
  },
  buttonsContainer: {
    marginTop: hp(-4.5),
  },
  checkButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f6416c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
  },
  callButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f6416c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
  },
  deleteButton: {
    height: hp(4),
    width: hp(4),
    backgroundColor: '#f6416c',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(2),
    marginHorizontal: wp(1),
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
    width: 14,
    textAlign: 'center',
  },
  moreContentTitle: {
    fontSize: wp(3),
    fontWeight: '700',
    marginBottom: wp(1.5),
  },
  moreContent: {
    fontSize: wp(2.8),
  },
  foodIcon: {
    width: wp(4),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  orderName: {
    fontSize: wp(4),
    color: '#333',
    fontWeight: '700',
  },
  orderItems: {
    fontSize: wp(3.2),
    color: '#f57c00',
    flex: 1,
    paddingTop: wp(1),
  },
  separator: {
    height: 2.5,
    marginVertical: wp(2),
    backgroundColor: '#f5f5f5',
  },
});
