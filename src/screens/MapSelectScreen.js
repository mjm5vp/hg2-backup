import React, { Component } from 'react';
import { Platform, Text, View, Image, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
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
    // if (Platform.OS === 'android' && !Constants.isDevice) {
    //   this.setState({
    //     errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
    //   });
    // } else {
    //   this._getLocationAsync();
    // }
  }

  componentDidMount() {
    this.setState({ mapLoaded: true })
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

  handlePlaceMarker = () => {
    this.props.setLocation(this.state.region);
  }

  onRegionChange= (region) => {
    this.setState({ region });
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
    console.log(this.state.initialRegion);

    const pooImage = allNamedPoos[this.props.currentPooName].image;
    console.log(this.props.currentPooName)

    return (
      <View style={styles.containerStyle}>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapViewStyle}
          // initialRegion={this.state.initialRegion}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
        >

          {/* <View style={styles.markerContainer}> */}
            <Image
              source={pooImage}
              style={styles.imageStyle}
            />
          {/* </View> */}

        </MapView>

          <View style={styles.buttonContainer}>
            <Button
              title='Place Marker'
              style={styles.buttonStyle}
              onPress={this.handlePlaceMarker}
            />
          </View>

      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  },
  mapViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  markerContainer: {
    position: 'absolute',
    backgroundColor: 'blue',
    height: 200,
    width: 200
  },
  imageStyle: {
    height: 50,
    width: 50,
    position: 'absolute'
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
  const { currentPooName } = state.input;
  return { currentPooName };
};

export default connect(mapStateToProps, { setLocation })(MapSelectScreen);
