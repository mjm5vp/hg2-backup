import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null

  }

  handleButtonPress() {
    this.props.navigation.navigate('map');
  }

  render() {
    return (
      <View>
        <Text>HomeScreen</Text>
        <Text>HomeScreen</Text>


        <Button
          title='Map'
          onPress={() => this.handleButtonPress()}
        />

        <Text>HomeScreen</Text>
        <Text>HomeScreen</Text>
        <Text>HomeScreen</Text>

        <Button
          title='Add a Poo'
          onPress={() => this.props.navigation.navigate('input')}
        />

      </View>
    );
  }
}

export default HomeScreen;
