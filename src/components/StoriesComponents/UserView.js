/* eslint-disable */
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

import ic_show_more_white from '../../assets/icons/ic_show_more_white.png';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMenuVisible: false,
    };
  }

  onDeletePress = () => {
    this.props.deleteTheStory();
    this.setState({isMenuVisible2: false});
  };
  onClsPress = () => {
    this.props.onClosePress();
    this.setState({isMenuVisible2: false});
  };

  render() {
    const {props} = this;

    return (
      <View style={styles.userView}>
        <Image source={{uri: props.profile}} style={styles.image} />
        <View style={{flex: 1}}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.time}>{props.duration}</Text>
        </View>
        {/* <TouchableOpacity onPress={props.onClosePress}>
          <Icon name="close" color="white" size={25} style={{marginRight: 8}} />
        </TouchableOpacity> */}
        <Menu
          visible={this.state.isMenuVisible2}
          anchor={
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                this.setState({isMenuVisible2: true});
              }}>
              <Image
                source={ic_show_more_white}
                resizeMode="cover"
                style={styles.showMoreIcon}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => {
            this.setState({isMenuVisible2: false});
          }}>
          <MenuItem onPress={this.onDeletePress}>Delete Story</MenuItem>
          <MenuItem onPress={this.onClsPress}>Close</MenuItem>
        </Menu>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 25,
    width: '98%',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    color: '#fff',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: '#888',
  },
  showMoreIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  buttonStyle: {
    padding: wp(1.5),
    borderRadius: wp(6),
    marginRight: wp(1),
    backgroundColor: 'rgba(131,131,131,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserView;
