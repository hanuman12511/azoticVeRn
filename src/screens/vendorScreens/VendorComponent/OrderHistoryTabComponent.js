import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ic_order from '../../../assets/icons/ic_order.png';

//rating stars
//import { Rating, AirbnbRating } from 'react-native-ratings';
import StarRating from 'react-native-star-rating';

export default class OrderHistoryTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 4.5,
      orderItems: [
        {
          itemName: 'Butter Naan',
          itemQuantity: '2',
        },
        {
          itemName: 'Chicken Tikka',
          itemQuantity: '1',
        },
      ],
    };
  }
  handleMoreInfo = (moreInfo) => () => {
    this.setState((prevState) => ({[moreInfo]: !prevState[moreInfo]}));
  };

  handleDetail = () => {
    let {item} = this.props;
    const titleType = 'Completed';
    item.titleType = titleType;
    this.props.nav.navigate('OrderHistoryDetail', {item});
  };

  // componentDidMount() {
  //   this.onStarRatingPress();
  // }

  // onStarRatingPress() {
  //   const { rating } = this.props.item;
  //   this.setState({
  //     starCount: rating
  //   });
  // }

  renderItem = ({item}) => {
    const {productName, quantity} = item;
    return (
      <View
        style={[
          basicStyles.directionRow,
          basicStyles.justifyBetween,
          basicStyles.paddingHalfVertical,
        ]}>
        <Text style={[styles.productName]}>{productName}</Text>
        <Text style={[styles.productQuantity]}>{quantity}</Text>
      </View>
    );
  };

  itemSeparator = () => <View style={{height: 8, backgroundColor: '#fff'}} />;

  render() {
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
      orderRatings,
      orderItems,
    } = this.props.item;

    return (
      <TouchableOpacity
        onPress={this.handleDetail}
        style={[styles.orderListContainer, basicStyles.padding]}>
        <View style={styles.idContainer}>
          <View style={styles.iconCover}>
            <AntDesign name="checkcircle" size={20} color="#43a047" />
          </View>
          <Text style={[basicStyles.flexOne, styles.idText]}>
            Order Completed on {completeBy}
          </Text>
        </View>

        <Text style={[basicStyles.flexOne, styles.idText2]}>
          Order ID: {orderId}
        </Text>
        <FlatList
          data={orderItems}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id}
          // ItemSeparatorComponent={this.itemSeparator}
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

        <View style={[styles.ratingContainer]}>
          <Text style={styles.ratingTitle}>
            Customer Rating:{/* ({parseInt(orderRatings)}) */}
          </Text>
          <StarRating
            disabled={true}
            maxStars={5}
            starSize={20}
            rating={parseInt(orderRatings)}
            fullStarColor={'#F57C00'}
            // emptyStarColor={'#999'}
          />
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
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingBottom: wp(2),
    marginBottom: wp(2),
  },
  iconCover: {
    backgroundColor: '#43a04720',
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
    fontSize: wp(4),
    fontWeight: '700',
    color: '#444',
  },
  idText2: {
    fontSize: wp(3.5),
    fontWeight: '400',
    color: '#666',
    paddingBottom: wp(0.5),
  },

  productName: {
    fontSize: wp(4),
    fontWeight: '400',
    color: '#333',
  },

  productQuantity: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#333',
  },

  totalContainer: {
    paddingTop: wp(3),
    paddingBottom: wp(3),
    color: '#999',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    marginTop: wp(2),
  },
  total: {
    fontSize: wp(3.8),
    color: '#777',
    fontWeight: '700',
  },
  amount: {
    fontSize: wp(4),
    color: '#F57C00',
    fontWeight: '700',
  },
  ratingContainer: {
    padding: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ratingTitle: {
    fontSize: wp(3.5),
    color: '#555',
    marginRight: wp(3),
  },
});
