import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, {
  MAP_TYPES,
  Polygon,
  ProviderPropType,
  PROVIDER_GOOGLE,
} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;

let id = 0;

class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      polygons: [
        {
          id: 1,
          coordinates: [
            {
              latitude: 26.926482,
              longitude: 75.826095,
            },
            {
              latitude: 26.926061,
              longitude: 75.826353,
            },
            {
              latitude: 26.938496,
              longitude: 75.802578,
            },
            {
              latitude: 26.930308,
              longitude: 75.771507,
            },
            {
              latitude: 26.919862,
              longitude: 75.789703,
            },
            {
              latitude: 26.917375,
              longitude: 75.805839,
            },
            {
              latitude: 26.925869,
              longitude: 75.826439,
            },
          ],
        },
      ],
      editing: null,
      creatingHole: false,
    };
  }

  componentDidMount() {
    this.fetchMapPolygons();
  }

  fetchMapPolygons = async () => {
    const LATITUDE = 26.9124;
    const LONGITUDE = 75.7873;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

    this.setState({
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    });
  };

  render() {
    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType={MAP_TYPES.STANDARD}
          initialRegion={this.state.region}
          {...mapOptions}>
          {this.state.polygons.map(polygon => (
            <Polygon
              key={polygon.id}
              coordinates={polygon.coordinates}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.9)"
              strokeWidth={2.5}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

Maps.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default Maps;
