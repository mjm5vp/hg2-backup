import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import allNamedPoos from '../../assets/namedPooExport';

class MapScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Map',
    };
  }

  state = {
    mapLoaded: false,
    location: null,
    errorMessage: null,
    region: {
      longitude: -77.31586374342442,
      latitude: 38.77684642130346,
      longitudeDelta: 1.04,
      latitudeDelta: 1.09
    }
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      // this._getLocationAsync();
    }
  }

  componentDidMount() {
    this.setState({ mapLoaded: true });
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    const { coords: { latitude, longitude } } = location
    this.setState({
      location,
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }
     });
  };

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      )
    }

    const allMarkers = this.props.myPoos.map((poo, key) => {
      const pooImage = allNamedPoos[poo.currentPooName].image;
      return (
        <MapView.Marker
          key={key}
          coordinate={poo.location}
          image={pooImage}
          anchor={{ x: 0, y: 0 }}
        />
      );
    });

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={this.state.region}
      >
        {allMarkers}
      </MapView>
    );
  }
}

const mapStateToProps = state => {
  return { myPoos: state.pooReducer.myPoos };
};

export default connect(mapStateToProps)(MapScreen);
