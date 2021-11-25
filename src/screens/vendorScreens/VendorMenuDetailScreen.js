import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  FlatList,
  ScrollView,
  clearData,
  Alert,
} from 'react-native';
//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

//Api's
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';
import {Table, Row, Rows} from 'react-native-table-component';

// Components
import HeaderComponent from '../vendorScreens/VendorComponent/HeaderComponent';

// Styles
import basicStyles from '../../styles/BasicStyles';

// Images
import foodImage1 from '../vendorScreens/assets/images/foodImage1.jpg';
import ic_food from '../../assets/icons/ic_food.png';

// VectorIcons
import Entypo from 'react-native-vector-icons/Entypo';
import CustomLoader from '../../components/CustomLoader';

export default class VendorMenuDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorImage: '',
      status: '',
      productName: '',
      qty: '',
      productDescription: '',
      productStatus: '',
      foodType: '',
      isCustom: '',
      productVariants: [],
      availabilites: [],
      isAddOns: '',
      productPrice: '',
      productAddOns: [],
      tableHead: ['Days', 'Start', 'End', 'Delivery', 'Take Away'],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.handleMenuDetails();
  }
  handleTokenExpire = async () => {
    const info = await getData(KEYS.USER_INFO);
    if (!(info === null)) {
      await clearData();
      this.props.navigation.navigate('VendorLogin');
    } else {
      console.log('there is an error in sign-out');
    }
  };
  handleMenuDetails = async () => {
    try {
      const productId = this.props.navigation.getParam('productId', null);
      console.log(productId);
      const params = {
        productId,
      };
      const response = await makeRequest(
        BASE_URL + 'api/Vendors/getMenuDetail',
        params,
        true,
        false,
      );
      if (response) {
        const {success, message, isAuthTokenExpired} = response;
        this.setState({isLoading: false});
        if (success) {
          // const {name, expertise, qualification, image, languages} = response;
          const {menuDetail} = response;
          const {
            productName,
            qty,
            productDescription,
            productStatus,
            foodType,
            isCustom,
            productVariants,
            availabilites,
            productPrice,
            isAddOns,
            productAddOns,
            vendorImage,
          } = menuDetail;
          this.setState({
            productName,
            vendorImage,
            qty,
            productDescription,
            productStatus,
            foodType,
            isCustom,
            productVariants,
            availabilites,
            isAddOns,
            productPrice,
            productAddOns,
            status: message,
          });
        } else {
          this.setState({menuDetail: null, status: message});
          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [
                {
                  text: 'OK',
                },
              ],
              {
                cancelable: false,
              },
            );
            this.handleTokenExpire();
          }
        }
      }
    } catch (error) {
      console.log('menu screen error', error);
    }
  };

  handleAddItems = () => {
    const {
      productName,
      qty,
      productDescription,
      productStatus,
      foodType,
      isCustom,
      productVariants,
      availabilites,
      isAddOns,
      productAddOns,
      productPrice,
    } = this.state;
    const productId = this.props.navigation.getParam('productId', null);
    const productData = {
      productId,
      productName,
      qty,
      productDescription,
      productStatus,
      foodType,
      isCustom,
      productVariants,
      availabilites,
      isAddOns,
      productAddOns,
      productPrice,
    };
    this.props.navigation.navigate('EditMenuItems', {
      productData,
      refreshCallback: this.handleMenuDetails,
    });
  };
  renderItem = ({item, index}) => {
    index += 1;
    return (
      <View>
        <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
          <Text>
            {index}. {item.name}
          </Text>
          <Text>₹ {item.price}</Text>
        </View>
      </View>
    );
  };
  keyExtractor = (item, index) => index.toString();

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      status,
      productName,
      qty,
      productDescription,
      productStatus,
      foodType,
      isCustom,
      productVariants,
      availabilites,
      isAddOns,
      productAddOns,
      productPrice,
      vendorImage,
    } = this.state;
    return (
      <SafeAreaView
        style={[basicStyles.container, basicStyles.whiteBackgroundColor]}>
        <View style={basicStyles.mainContainer}>
          <HeaderComponent
            headerTitle="Menu Detail"
            nav={this.props.navigation}
            navAction="back"
          />
          <View style={[basicStyles.flexOne]}>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.paddingHorizontal,
              ]}>
              <Image
                source={{uri: vendorImage}}
                resizeMode="cover"
                style={styles.productImage}
              />
              <View
                style={[
                  basicStyles.flexOne,
                  basicStyles.marginLeft,
                  basicStyles.directionRow,
                ]}>
                <Image
                  source={ic_food}
                  resizeMode="cover"
                  style={styles.foodIcon}
                />
                <Text>{productName}</Text>
              </View>

              <Text>₹ {productPrice}</Text>
            </View>
            <Text
              style={[
                basicStyles.paddingHorizontal,
                basicStyles.paddingHalfTop,
                basicStyles.text,
              ]}>
              Quantity: {qty}
            </Text>
            <View style={basicStyles.separatorHorizontal} />

            <View style={basicStyles.paddingHorizontal}>
              <Text style={[basicStyles.text, basicStyles.marginBottom]}>
                Order Type: {foodType}
              </Text>
              <Text style={basicStyles.heading}>Sort Description</Text>
              <Text style={basicStyles.text}>{productDescription}</Text>
              {isCustom ? (
                <View>
                  <Text style={[basicStyles.heading, basicStyles.marginTop]}>
                    Customization
                  </Text>
                  <FlatList
                    data={productVariants}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    //numColumns={2}
                  />
                </View>
              ) : (
                <View>
                  <Text style={[basicStyles.heading, basicStyles.marginTop]}>
                    No Customization Available
                  </Text>
                </View>
              )}

              {isAddOns ? (
                <View>
                  <Text style={[basicStyles.heading, basicStyles.marginTop]}>
                    Add Ons
                  </Text>
                  <FlatList
                    data={productAddOns}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    //numColumns={2}
                  />
                </View>
              ) : (
                <View>
                  <Text style={[basicStyles.heading, basicStyles.marginTop]}>
                    No Add-On's Available
                  </Text>
                </View>
              )}
            </View>

            <ScrollView style={basicStyles.marginTop}>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#cccccc80',
                }}>
                <Row
                  data={this.state.tableHead}
                  style={styles.head}
                  textStyle={[styles.text, basicStyles.whiteColor]}
                />
                <Rows data={this.state.availabilites} textStyle={styles.text} />
              </Table>
            </ScrollView>
          </View>
          <TouchableHighlight
            onPress={this.handleAddItems}
            style={styles.addButton}
            underlayColor="#f65e8380">
            <Entypo
              size={22}
              name={'pencil'}
              color="#fff"
              style={styles.editIcon}
            />
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  productImage: {
    width: wp(16),
    aspectRatio: 1 / 1,
    borderRadius: wp(8),
  },
  foodIcon: {
    width: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
  addButton: {
    position: 'absolute',
    bottom: hp(2),
    right: wp(2),
    backgroundColor: '#fff',
    borderRadius: 26,
  },
  head: {
    backgroundColor: '#f65e83',
  },
  text: {
    padding: 5,
    fontSize: wp(3),
  },
  editIcon: {
    height: hp(6),
    width: hp(6),
    backgroundColor: '#f65e83',
    textAlign: 'center',
    lineHeight: hp(6),
    borderRadius: hp(3),
  },
});
