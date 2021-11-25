import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Image } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import Logo from '../assets/images/Logo_Pizza.png';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class ProcessLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
            visible: true,
        };
    }


    render() {
        return (
            <View style={styles.container}>
                <AnimatedLoader
                    visible={this.state.visible}
                    overlayColor="rgba(255,255,255,0.75)"
                    source={require("./FoodProgress.json")}
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
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: wp(50),
        height: wp(50),
    },
});