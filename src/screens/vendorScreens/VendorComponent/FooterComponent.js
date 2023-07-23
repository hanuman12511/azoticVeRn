import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

//Responsive Screen
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// styles
import basicStyles from '../BasicStyles';
// // VectorIcons
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class FooterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {tab} = this.props;
    const activeStyle = [styles.footerMenu, {borderTopColor: '#00b8a9'}];
    return (
      <View style={[basicStyles.directionRow, styles.footerComponent]}>
        <TouchableHighlight
          onPress={this.handleNewsFeed}
          underlayColor="transparent"
          style={tab === 'Camera' ? activeStyle : styles.footerMenu}>
          {/* <Image
            source={tab === 'News' ? ic_news_feed_green : ic_news_feed}
            resizeMode="cover"
            style={styles.footerIcon}
          /> */}
          <Ionicons size={23} name={'camera'} />

          {/* <Text>{tab}</Text> */}
        </TouchableHighlight>

        <TouchableHighlight
          onPress={this.handleLiveNow}
          underlayColor="transparent"
          style={tab === 'Gallery' ? activeStyle : styles.footerMenu}>
          <FontAwesome size={21} name={'google-photos'} />
        </TouchableHighlight>

        {/* <TouchableHighlight
          onPress={this.handleFoodVendor}
          underlayColor="transparent"
          style={tab === 'Food' ? activeStyle : styles.footerMenu}>
          <MaterialIcons size={21} name={'live-tv'} />
        </TouchableHighlight> */}
      </View>
    );
  }
}

// Commented Code of Video Module

const styles = StyleSheet.create({
  footerComponent: {
    height: hp(6),
    backgroundColor: '#fff',
  },
  footerIcon: {
    height: wp(6),
    aspectRatio: 1 / 1,
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 3,
    borderColor: '#f2f1f1',
  },
});

// import React from 'react';
// import { StyleSheet, View } from 'react-native';

// // VectorIcons
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/MaterialCommunityIcons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import { createAppContainer } from 'react-navigation';
// import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

// // screens
// import LiveTab from '../VendorComponent/GalleryView';
// import FoodTab from '../VendorComponent/PhotoView';
// import FreshTab from '../VendorComponent/CameraView';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// const TabNavigator = createMaterialBottomTabNavigator(
//   // {
//   //   Camera: {
//   //     screen: FreshTab,
//   //     navigationOptions: {
//   //       tabBarIcon: ({ tintColor }) => (
//   //         <View>
//   //           <FontAwesome
//   //             style={[{ color: tintColor }]}
//   //             size={21}
//   //             name={'google-photos'}
//   //           />
//   //         </View>
//   //       ),
//   //     },
//   //   },
//   //   Gallery: {
//   //     screen: LiveTab,
//   //     navigationOptions: ({ navigation }) => {
//   //       tabBarIcon: ({ tintColor }) => (
//   //         <View>
//   //           <MaterialIcons
//   //             style={[{ color: tintColor }]}
//   //             size={21}
//   //             name={'live-tv'}
//   //           />
//   //         </View>
//   //       ),
//   //         activeColor: '#00b8a9',
//   //           inactiveColor: '#999',
//   //     },
//   //   },
//   //   Video: {
//   //     screen: FoodTab,
//   //     navigationOptions: {
//   //       tabBarIcon: ({ tintColor }) => (
//   //         <View>
//   //           <Ionicons style={[{ color: tintColor }]} size={23} name={'camera'} />
//   //         </View>
//   //       ),
//   //       activeColor: '#00b8a9',
//   //       inactiveColor: '#999',
//   //     },
//   //   },
//   // },
//   // {
//   //   initialRouteName: 'Gallery',
//   //   activeColor: '#00b8a9',
//   //   inactiveColor: '#999',
//   //   barStyle: { backgroundColor: '#ffffff' },
//   // },

//   {
//     Camera: {
//       screen: FreshTab
//     },
//     Gallery: {
//       screen: LiveTab
//     },
//     Video: {
//       screen: FoodTab
//     },

//   },
//   {
//     navigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused }) => {
//         const { routeName } = navigation.state;
//         let iconName;
//         if (routeName === "FreshTab") {
//           return (
//             <View>
//               <FontAwesome
//                 size={21}
//                 name={'google-photos'}
//                 color={focused ? "black" : "gray"}
//               />
//             </View>
//           );
//         }
//         if (routeName === "LiveTab") {
//           return (
//             <MaterialIcons
//               size={21}
//               name={'live-tv'}
//               color={focused ? "black" : "gray"}
//             />
//           );
//         }
//         if (routeName === "FoodTab") {
//           return (
//             <Ionicons size={23} name={'camera'}
//               color={focused ? "black" : "gray"}
//             />
//           );
//         }
//       }
//     }),
//     // tabBarOptions: {
//     //   showLabel: false
//     // }
//   },
//   {
//     initialRouteName: 'Gallery',
//     activeColor: '#00b8a9',
//     inactiveColor: '#999',
//     barStyle: { backgroundColor: '#ffffff' },
//   },
// );

// export default createAppContainer(TabNavigator);
