import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';

import feetBackground from '../../assets/backgrounds/feet_background.jpg';
import allNamedPoos from '../../assets/namedPooExport';
import OKModal from '../modals/OKModal';
import Confirm from '../components/Confirm';
import styles from '../styles/homeStyles';
import {
  setInputType,
  setLogType,
  resetInput,
  authLogout,
  authLogin,
  syncPropsWithDb
} from '../actions';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  state = {
    currentUser: null,
    okModalVisible: false,
    okModalText: ''
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      console.log(nextProps.token);
      this.setState({ currentUser: true });
    } else {
      this.setState({ currentUser: false });
    }
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const phone = user.uid;
        const { myPoos, myFriends, myInfo } = this.props;

        this.props.syncPropsWithDb({ phone, myPoos, myFriends, myInfo });
        this.setState({ currentUser: true });
      }
    });
  }

  authLoginWithToken = async (token) => {
    try {
      // await firebase.auth().signOut();
      await firebase.auth().signInWithCustomToken(token);
      this.setState({ currentUser: true });
      console.log('authLoginWithToken success');
    } catch (err) {
      console.log('authLoginWithToken failed');
      console.log(err);
    }
  }

  navToAdd() {
    this.props.resetInput();
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

  navToFriends = () => {
    if (this.state.currentUser) {
      this.props.navigation.navigate('friends');
    } else {
      this.setState({
        okModalVisible: true,
        okModalText: 'You must create an acount or sign in to use this feature.'
      });
    }
  }

  navToSentToMe = () => {
    if (this.state.currentUser) {
      this.props.navigation.navigate('sent_to_me');
    } else {
      this.setState({
        okModalVisible: true,
        okModalText: 'You must create an acount or sign in to use this feature.'
      });
    }
  }

  authLogout = async () => {
    await this.props.authLogout();
    this.setState({ currentUser: false });
  }

  renderAuthButton = () => {
    const { currentUser } = firebase.auth();
    console.log('renderAuthButton currentUser');
    console.log(currentUser);
      if (this.state.currentUser || currentUser) {
      return (
        <Card>
          <Text>You're signed In</Text>
          <Button
            title='Sign Out'
            onPress={() => this.authLogout()}
          />
        </Card>
      );
    }
    return (
      <Card>
        <Button
          title='Sign In'
          icon={{ name: 'gear', type: 'font-awesome' }}
          onPress={() => this.props.navigation.navigate('auth')}
          buttonStyle={styles.mapButton}
          raised
        />
      </Card>
    );
  }

  okModalAccept = () => {
    this.setState({ okModalVisible: false, okModalText: '' });
  }

  render() {
    console.log('home render currentUser');
    console.log(firebase.auth().currentUser);
    return (

      <Image source={feetBackground} style={styles.backgroundContainer}>

        <Text style={styles.headerStyle}>Hoos Going 2</Text>

        <ScrollView style={styles.scrollViewContainer}>

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
            onPress={() => this.props.navigation.navigate('stats')}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Friends'
            // icon={{ name: 'ios-people', type: 'font-awesome' }}
            onPress={() => this.navToFriends()}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Sent To Me'
            // icon={{ name: 'ios-people', type: 'font-awesome' }}
            onPress={() => this.navToSentToMe()}
            buttonStyle={styles.mapButton}
            raised
          />

          <Button
            title='Settings'
            // icon={{ name: 'ios-people', type: 'font-awesome' }}
            onPress={() => this.props.navigation.navigate('settings')}
            buttonStyle={styles.mapButton}
            raised
          />

          {this.renderAuthButton()}

        </ScrollView>

        <OKModal
          infoText={this.state.okModalText}
          buttonText='OK'
          onAccept={this.okModalAccept}
          visible={this.state.okModalVisible}
        />

      </Image>
    );
  }
}

const mapStateToProps = state => {
  const { token } = state.auth;
  const { myFriends, myInfo } = state.friends;
  const { myPoos } = state.pooReducer;

  return { token, myFriends, myInfo, myPoos };
};

export default connect(mapStateToProps, {
  setInputType,
  setLogType,
  resetInput,
  authLogout,
  authLogin,
  syncPropsWithDb
})(HomeScreen);
