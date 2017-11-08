import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { fillInput } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';

class LogStackScreen extends Component {

  onLogItemPress = (poo) => {
    this.props.fillInput(poo);
    this.props.navigation.navigate('inputEdit');
  }

  renderPooLog() {
    const filteredPoos = this.props.myPoos.filter(poo => {
      return poo.location.latitude === this.props.selectedStackLocation.latitude;
    });

    const sortedPoos = _.sortBy(filteredPoos, (o) => {
      return new moment(o.datetime);
    }).reverse();

    return sortedPoos.map((poo, key) => {
      const datetime = moment(poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[poo.currentPooName].image;
      return (
        <TouchableOpacity key={key} onPress={() => this.onLogItemPress(poo)}>
          <View>
            <Image
              source={pooImage}
            />
            <Text>{poo.description}</Text>
            <Text>{datetime}</Text>
            <Text>longitude: {poo.location.longitude}</Text>
            <Text>latitude: {poo.location.latitude}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View>
        <Text>oh hai LogStackScreen</Text>
        <Text>oh hai LogStackScreen</Text>
        <Text>oh hai LogStackScreen</Text>
        <Text>oh hai LogStackScreen</Text>
        <Text>oh hai LogStackScreen</Text>
        {this.renderPooLog()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { myPoos, selectedStackLocation } = state.pooReducer

  return { myPoos, selectedStackLocation };
};

export default connect(mapStateToProps, { fillInput })(LogStackScreen);
