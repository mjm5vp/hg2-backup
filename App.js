import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Constants, Location, Permissions } from 'expo';


export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
    initialRegion: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
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
      initialRegion: {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }
     });
  };

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    console.log(this.state.initialRegion)
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={this.state.initialRegion}
        region={this.state.initialRegion}
      />
    );
  }
}
