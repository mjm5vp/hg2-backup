import { Notifications } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
// import { Provider } from 'react-redux';

// import registerForNotifications from './services/push_notifications';
// import store from './store';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import PooSelect from './src/screens/PooSelect';


export default class App extends React.Component {
  componentDidMount() {

  }

  render() {
    const MainNavigator = StackNavigator({
      home: { screen: HomeScreen },
      map: { screen: MapScreen },
      select: { screen: PooSelect, mode: 'modal' },
    });

    return (
        <View style={styles.container}>
          <MainNavigator />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'

  },
});
