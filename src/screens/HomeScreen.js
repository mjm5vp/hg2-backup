import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import feetBackground from '../../assets/backgrounds/feet_background.jpg';
import allNamedPoos from '../../assets/namedPooExport';
import { setInputType, setLogType } from '../actions';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  navToAdd() {
    this.props.setInputType('new');
    this.props.navigation.navigate('input');
  }

  navToMap() {
    this.props.navigation.navigate('map');
  }

  navToLog() {
    this.props.setLogType('normal');
    this.props.navigation.navigate('log');
  }

  render() {
    return (

      <Image source={feetBackground} style={styles.backgroundContainer}>

        <Text style={styles.headerStyle}>Hoos Going 2</Text>

        <TouchableOpacity
          onPress={() => this.navToAdd()}
        >
          <View style={styles.addView}>
            <Text style={styles.addText}>Take a Poo</Text>
            <Image
              source={allNamedPoos.sunglasses.image}
              style={styles.addImage}
            />
          </View>
        </TouchableOpacity>

          <Button
            title='Map'
            icon={{ name: 'map', type: 'font-awesome' }}
            onPress={() => this.navToMap()}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Log'
            icon={{ name: 'list', type: 'font-awesome' }}
            onPress={() => this.navToLog()}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Stats'
            icon={{ name: 'area-chart', type: 'font-awesome' }}
            onPress={() => this.props.navigation.navigate('log')}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Settings'
            icon={{ name: 'gear', type: 'font-awesome' }}
            onPress={() => this.props.navigation.navigate('log')}
            buttonStyle={styles.mapButton}
            raised
          />

      </Image>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    backgroundColor: '#eee',
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: null,
    height: null,
  },
  headerStyle: {
    marginTop: 60,
    marginBottom: 10,
    fontSize: 60,
    fontWeight: '900',
    fontFamily: 'Bradley Hand',
    color: 'orange',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  addView: {
    borderWidth: 2,
    borderColor: 'black',
    height: 150,
    width: 150,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,150,136,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addText: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  addImage: {
    height: 125,
    width: 125
  },
  mapButton: {
    backgroundColor: 'rgba(0,150,136,0.5)',
    width: 250,
    height: 30,
    margin: 10,

  }
};

export default connect(null, { setInputType, setLogType })(HomeScreen);
