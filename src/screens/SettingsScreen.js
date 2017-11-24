import React, { Component } from 'react';
import { View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
// import { LoginButton } from 'react-native-fbsdk';
import * as actions from '../actions';

class SettingsScreen extends Component {

  componentDidMount() {
    const { currentUser } = firebase.auth();

    console.log('currentUser');
    console.log(currentUser);
  }

  onFacebookLoginPress = () => {
    this.props.facebookLogin();
  }

  onFacebookLogoutPress = () => {
    this.props.facebookLogout();
  }

  renderFacebookButton = () => {
    const { currentUser } = firebase.auth();

    if (currentUser) {
      return (
        <Button
          title='Log out of Facebook'
          onPress={() => this.onFacebookLogoutPress()}
        />
      );
    }

    return (
      <Button
        title='Log in with Facebook'
        onPress={() => this.onFacebookLoginPress()}
      />
    );
  }

  render() {
    return (
      <Card>
        <View>
          {this.renderFacebookButton()}
        </View>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  const { token } = state.auth;

  return { token };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
