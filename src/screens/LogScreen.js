import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import allNamedPoos from '../../assets/namedPooExport';

class LogScreen extends Component {

  renderPooLog() {
    console.log(this.props.myPoos.length);
    return this.props.myPoos.map(poo => {
      const datetime = moment(poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[poo.currentPooName].image;
      return (
        <View>
          <Image
            source={pooImage}
          />
          <Text>{poo.description}</Text>
          <Text>{datetime}</Text>
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
