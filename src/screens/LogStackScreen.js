import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import allNamedPoos from '../../assets/namedPooExport';

class LogStackScreen extends Component {

  renderPooLog() {
    console.log(this.props.myPoos.length);

    const filteredPoos = this.props.myPoos.filter(poo => {
      console.log(`poo.location.latitude: ${poo.location.latitude}`);
      console.log(`this.props.selectedStackLocation.latitude: ${this.props.selectedStackLocation.latitude}`);
      return poo.location.latitude === this.props.selectedStackLocation.latitude;
    });

    const sortedPoos = _.sortBy(filteredPoos, (o) => {
      return new moment(o.datetime);
    }).reverse();

    return sortedPoos.map((poo, key) => {
      const datetime = moment(poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[poo.currentPooName].image;
      return (
        <View key={key}>
          <Image
            source={pooImage}
          />
          <Text>{poo.description}</Text>
          <Text>{datetime}</Text>
          <Text>longitude: {poo.location.longitude}</Text>
          <Text>latitude: {poo.location.latitude}</Text>
        </View>
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

export default connect(mapStateToProps)(LogStackScreen);
