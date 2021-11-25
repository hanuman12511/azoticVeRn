import React, {Component} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
//  map Functionality
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
navigator.geolocation = require('@react-native-community/geolocation');
export default class GoogleAddressPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: '',
      lat: '',
      lng: '',
    };
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps="always">
        <GooglePlacesAutocomplete
          placeholder="Vendor Address"
          onPress={(data, details) => this.handleVendorAddress(data, details)}
          returnKeyType={'default'}
          fetchDetails={true}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: hp(4),
              color: '#999',
              fontSize: 16,
              backgroundColor: 'transparent',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
          query={{
            key: 'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k',
            language: 'en',
            components: 'country:Ind',
            fields: 'geometry',
          }}
          // currentLocation={true}
          // currentLocationLabel="Current location"
          enableHighAccuracyLocation={true}
          GooglePlacesDetailsQuery={{
            fields: ['formatted_address', 'geometry'],
          }}
        />
      </ScrollView>
    );
  }
}
