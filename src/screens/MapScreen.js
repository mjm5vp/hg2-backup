import React, { Component } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import allNamedPoos from '../../assets/namedPooExport';
import { identifyStackLocation, setLogType } from '../actions';

class MapScreen extends Component {

  static navigationOptions = () => {
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

  componentDidMount() {
    this.setState({ mapLoaded: true });
    this.getLocationAsync();
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    const location = await Location.getCurrentPositionAsync({});
    const { coords: { latitude, longitude } } = location;
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
    this.props.setLogType('stack');
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
        showsUserLocation
        showsMyLocationButton
        showsPointsOfInterest
        showsBuildings
        showsIndoors
        showsIndoorLevelPicker
        showsCompass
        moveOnMarkerPress
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
