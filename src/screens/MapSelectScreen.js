import React, { Component } from 'react';
import { Text, View, Image, ActivityIndicator } from 'react-native';
import { Button, ButtonGroup, Icon } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { setLocation } from '../actions';
import MapSettingsModal from '../modals/MapSettingsModal';
import allNamedPoos from '../../assets/namedPooExport';
import styles from '../styles/mapStyles';

class MapSelectScreen extends Component {

  static navigationOptions = () => {
    return {
      title: 'Select Location',
    };
  }

  state = {
    renderCenterMarker: null,
    selectedIndex: 0,
    mapType: 'standard',
    mapLoaded: false,
    location: null,
    showSettings: false,
    showLocationButton: false,
    errorMessage: null,
    region: {
      longitude: -77.31586374342442,
      latitude: 38.77684642130346,
      longitudeDelta: 2.04,
      latitudeDelta: 2.09
    }
  };

  componentDidMount() {
    this.setState({ mapLoaded: true, mapType: this.props.mapType });
    this.getLocationAsync();
  }

  componentWillReceiveProps(nextProps) {
    const { mapType } = nextProps;

    console.log(mapType);
    console.log(this.props.mapType);

    if (mapType !== this.props.mapType) {
      this.setState({ mapType });
    }
  }

  onRegionChange = (region) => {
    this.setState({ region });
  }

  setRegionToCoordinate = () => {
    const { longitude, latitude } = this.props.location;

    this.setState({
      region: {
        longitude,
        latitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
       }
    });
  }

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        showLocationButton: false,
        errorMessage: 'Permission to access location was denied',
      });
    }

    const location = await Location.getCurrentPositionAsync({});
    const { coords: { latitude, longitude } } = location;
    this.setState({
      showLocationButton: true,
      location,
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      }
     });
  };

  handlePlaceMarker = () => {
    this.props.setLocation(this.state.region);
    this.props.navigation.goBack();
  }

  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
  }

  renderAllMarkers = () => {
    const poosWithLocation = this.props.myPoos.filter(poo => {
      return poo.location.latitude;
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
          onPress={e => this.onMarkerTap(e, poo)}
        >
          <MapView.Callout onPress={e => this.onCalloutTap(e, poo)}>
            <View style={{ flex: 1 }}>
              <Text>Add to this Marker</Text>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }

  onMarkerTap = (e, poo) => {
    console.log(poo.location);
  }

  onCalloutTap = (e, poo) => {
    console.log('onCalloutTap');
    this.props.setLocation(poo.location);
    this.props.navigation.goBack();
  }

  renderCenterMarker = () => {
    const pooImage = allNamedPoos[this.props.currentPooName].image;

    if (this.state.selectedIndex === 0) {
      return (
        <Image
          source={pooImage}
          style={styles.imageStyle}
        />
      );
    }
    return (
      <Image />
    );
  }

  renderPlaceMarkerButton = () => {
    if (this.state.selectedIndex === 0) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            title='Place Marker'
            buttonStyle={styles.buttonStyle}
            onPress={this.handlePlaceMarker}
          />
        </View>
      );
    }
  }

  render() {
    if (!this.state.mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    const buttons = ['New Marker', 'Add to Existing'];

    return (
      <View style={styles.containerStyle}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapViewStyle}
          mapTye={this.state.mapType}
          // initialRegion={this.state.initialRegion}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
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

          {this.renderCenterMarker()}

        </MapView>

        <Icon
          raised
          name='settings'
          type='feather'
          containerStyle={styles.selectSettingsButton}
          onPress={() => this.setState({ showSettings: true })}
        />

        <View style={styles.topButtonContainer}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
          />
        </View>

        <MapSettingsModal
          showSettings={this.state.showSettings}
          closeSettings={() => this.setState({ showSettings: false })}
          locationOn={this.state.showLocationButton}
        />

        {this.renderPlaceMarkerButton()}

      </View>
    );
  }
}

const mapStateToProps = state => {
  const { currentPooName, location } = state.input;
  const { myPoos } = state.pooReducer;
  const { mapType } = state.settings;

  return { currentPooName, location, myPoos, mapType };
};

export default connect(mapStateToProps, { setLocation })(MapSelectScreen);
