import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import allNamedPoos from '../../assets/namedPooExport';

class LogScreen extends Component {

  renderPooLog() {
    console.log(this.props.myPoos.length);
    const sortedPoos = _.sortBy(this.props.myPoos, (o) => {
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
  return { myPoos: state.pooReducer.myPoos };
};

export default connect(mapStateToProps)(LogScreen);
