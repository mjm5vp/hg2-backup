import { Notifications } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

// import registerForNotifications from './services/push_notifications';
import store from './src/store';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import PooSelect from './src/screens/PooSelect';
import InputScreen from './src/screens/InputScreen';
import InputEditScreen from './src/screens/InputEditScreen';
import LogScreen from './src/screens/LogScreen';
import MapSelectScreen from './src/screens/MapSelectScreen';
import LogStackScreen from './src/screens/LogStackScreen';


export default class App extends React.Component {
  componentDidMount() {

  }

  render() {
    const MainNavigator = StackNavigator({
      home: { screen: HomeScreen },
      input: { screen: InputScreen },
      inputEdit: { screen: InputEditScreen },
      map_select: { screen: MapSelectScreen },
      log: { screen: LogScreen },
      logStack: { screen: LogStackScreen },
      map: { screen: MapScreen },
      select: { screen: PooSelect }
    });

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'

  },
});
