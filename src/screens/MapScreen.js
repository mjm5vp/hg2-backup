import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import allNamedPoos from '../../assets/namedPooExport';
import { identifyStackLocation, setLogType } from '../actions';

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

  renderAllMarkers = () => {
    const poosWithLocation = this.props.myPoos.filter(poo => {
      return poo.location.latitude !== null;
    });

    const sortedPoos = _.sortBy(poosWithLocation, (o) => {
      return new moment(o.datetime);
    }).reverse();

    const uniqPoos = _.uniqBy(sortedPoos, 'location.latitude');

    return uniqPoos.map((poo, key) => {
      const pooImage = allNamedPoos[poo.currentPooName].image;
      return (
        <MapView.Marker
          key={key}
          coordinate={poo.location}
          image={pooImage}
          anchor={{ x: 0.5, y: 0.5 }}
          // onPress={e => console.log(e.nativeEvent)}
        >
          <MapView.Callout onPress={() => this.onCalloutStack(poo)}>
            <View>
              <Text>View Stack</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }

  onCalloutStack = ({ location }) => {
    this.props.setLogType('stack')
    this.props.identifyStackLocation(location);
    this.props.navigation.navigate('log');
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={this.state.region}
      >
        {this.renderAllMarkers()}
      </MapView>
    );
  }
}

const mapStateToProps = state => {
  return { myPoos: state.pooReducer.myPoos };
};

export default connect(mapStateToProps, { identifyStackLocation, setLogType })(MapScreen);
