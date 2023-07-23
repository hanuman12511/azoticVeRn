import React, {Component} from 'react';
import {View, Text, Animated, StyleSheet, Image} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import Logo from '../assets/images/Logo_Pizza.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class ProcessingLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0),
      visible: true,
    };
  }
  componentDidMount() {
    // this.start();
    // setInterval(() => {
    //   this.setState({
    //     visible: !this.state.visible
    //   });
    // }, 10000);
  }
  // start = () => {
  //   Animated.loop(
  //     Animated.timing(this.state.rotateValue, {
  //       toValue: 1,
  //       duration: 2500,
  //       Infinite: true,
  //       useNativeDriver: true,
  //     }),
  //   ).start();
  // };

  render() {
    return (
      <View style={styles.container}>
        {/* <Animated.View
          style={{
            transform: [
              {
                rotate: this.state.rotateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '380deg'],
                }),
              },
            ],
            height: hp(11),
            width: wp(11),
            margin: 5,
            //borderWidth: 6,
            borderColor: '#199cda',
            borderBottomColor: '#000',
            borderRadius: 50,
            justifyContent: 'center',
          }}
        >
          <Image source={Logo} style={{ height: hp(45), aspectRatio: 1 / 1, alignSelf: 'center', }} />
        </Animated.View>
        <Animated.View /> */}
        <AnimatedLoader
          visible={this.state.visible}
          overlayColor="rgb(255,255,255)"
          source={require('./LoderNew.json')}
          animationStyle={styles.lottie}
          speed={3}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: wp(50),
    height: wp(50),
  },
});
