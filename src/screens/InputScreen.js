import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { selectPoo } from '../actions';
import basketball from '../../assets/pooImages/basketball.png';
import corn from '../../assets/pooImages/corn.png';

import allNamedPoos from '../../assets/namedPooExport';


class InputScreen extends Component {
  state = {
    currentPoo: { name: 'taco', image: basketball }
  }
  render() {
    console.log("render: " + this.props.currentPooName)
    // const staticName = `../../assets/pooImages/${this.props.currentPooName}.png`
    const pooImage = allNamedPoos[this.props.currentPooName].image;
    // const pooImage =  require(staticName);


    return (
      <View>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Image
          source={pooImage}
        />
        <Button
          title='Select'
          onPress={() => this.props.navigation.navigate('select')}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps currentPooName: ' + state.currentPooName.currentPooName)
  return { currentPooName: state.currentPooName.currentPooName };
};

export default connect(mapStateToProps, { selectPoo })(InputScreen);
