import React, { Component } from 'react';
import { Platform, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import { setLocation } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';

class MapSelectScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Map',
      // headerRight: (
      //   <Button
      //     title='Poo'
      //     onPress={() => navigation.navigate('select')}
      //     backgroundColor='rgba(0,0,0,0)'
      //     color='rgba(0, 122, 255, 1)'
      //   />
      // )
    };
  }

  state = {
    renderCenterMarker: null,
    selectedIndex: 0,
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
      this.props.location.latitude ? this.setRegionToCoordinate() : this._getLocationAsync();
    }
  }

  componentDidMount() {
    this.setState({ mapLoaded: true });
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

  handlePlaceMarker = () => {
    this.props.setLocation(this.state.region);
    this.props.navigation.goBack();
  }

  updateIndex = (selectedIndex) => {
    this.setState({ selectedIndex });
  }

  renderAllMarkers = () => {
    const poosWithLocation = this.props.myPoos.filter(poo => {
      return poo.location.latitude !== null;
    });

    return poosWithLocation.map((poo, key) => {
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
            style={styles.buttonStyle}
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
      )
    }
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    const buttons = ['New Marker', 'Add to Existing']

    console.log('selectedIndex: ' + this.state.selectedIndex);

    return (
      <View style={styles.containerStyle}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapViewStyle}
          // initialRegion={this.state.initialRegion}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >

          {this.renderAllMarkers()}

          {this.renderCenterMarker()}

        </MapView>

        <View style={styles.topButtonContainer}>
          <ButtonGroup
            onPress={this.updateIndex}
            selectedIndex={this.state.selectedIndex}
            buttons={buttons}
            // containerStyle={{height: 100}}
          />
        </View>

        {this.renderPlaceMarkerButton()}

      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
  },
  mapViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  markerContainer: {
    height: 50,
    width: 50,
    position: 'absolute'
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  topButtonContainer: {
    width: '90%',
    flex: 1,
    position: 'absolute',
    top: 20,
    // left: 0,
    // right: 0
  },
  topButtonStyle: {
    margin: 20
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0
  },
  buttonStyle: {
    flex: 1,
  }
};


const mapStateToProps = state => {
  const { currentPooName, location } = state.input;
  const { myPoos } = state.pooReducer;
  return { currentPooName, location, myPoos };
};

export default connect(mapStateToProps, { setLocation })(MapSelectScreen);
