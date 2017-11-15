import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { fillInput, setInputType } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';

class LogScreen extends Component {

  filterPoos = () => {
    const { myPoos, selectedStackLocation } = this.props

    return myPoos.filter(poo => {
      return poo.location.latitude === selectedStackLocation.latitude;
    });
  }

  sortPoos = () => {
    const filteredPoos = this.props.logType === 'stack'
      ? this.filterPoos()
      : this.props.myPoos;

    return _.sortBy(filteredPoos, (o) => {
      return new moment(o.datetime);
    }).reverse();
  }

  onLogItemPress = (poo) => {
    this.props.setInputType('edit');
    this.props.fillInput(poo);
    this.props.navigation.navigate('input');
  }

  renderPooLog() {
    const sortedPoos = this.sortPoos()

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
            <Text>UID: {poo.inputUID}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View>
        <Text>oh hai LogScreen</Text>
        <Text>oh hai LogScreen</Text>
        <Text>oh hai LogScreen</Text>
        <Text>oh hai LogScreen</Text>
        <Text>oh hai LogScreen</Text>
        {this.renderPooLog()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { myPoos, logType, selectedStackLocation } = state.pooReducer;

  return { myPoos, logType, selectedStackLocation };
};

export default connect(mapStateToProps, { fillInput, setInputType })(LogScreen);
