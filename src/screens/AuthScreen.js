import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import axios from 'axios';
import firebase from 'firebase';
import { connect } from 'react-redux';

import { authLogin } from '../actions';

const ROOT_URL = 'https://us-central1-one-time-password-698fc.cloudfunctions.net';

class SignUpForm extends Component {

  state = {
    phone: '',
    code: '',
    message: '',
    codeMessage: '',
    showSpinner: false,
    phoneEntered: false
   };

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      this.setState({ showSpinner: false });
      this.props.navigation.goBack();
    }
  }

  handleSubmit = async () => {
    const { phone } = this.state;

    this.checkIfUserIdExists(phone);
    this.setState({ phoneEntered: true });
  }

  checkIfUserIdExists = async (phone) => {
    await firebase.database().ref(`/users/${phone}`)
      .once('value', snapshot => {
        if (snapshot.val()) {
          console.log('user exists');
          this.setState({ message: 'Welcome back' });
          this.setState({
            codeMessage: 'You will recieve a text message shortly with a 4-digit code.'
          });
          this.userExists(phone);
        } else {
          console.log('user does not exist');
          this.newUser(phone);
        }
      });
  }

  newUser = async (phone) => {
    try {
      await axios.post(`${ROOT_URL}/createUser`, { phone });
      console.log('user created');
      await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone });
    } catch (err) {
      console.log(err);
    }
  };

  userExists = async (phone) => {
    await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone });
  }

  signIn = async () => {
    const { phone, code } = this.state;
    const { myPoos } = this.props;
    this.setState({ showSpinner: true });
    await this.props.authLogin({ myPoos, phone, code });
  }

  renderPhoneOrCode = () => {
    if (!this.state.phoneEntered) {
      return (
        <View>
          <View style={{ marginBottom: 10 }}>
            <FormLabel>Enter your phone number:</FormLabel>
            <FormInput
              value={this.state.phone}
              onChangeText={phone => this.setState({ phone })}
              keyboardType='number-pad'
            />
          </View>
          <Button
            title="Submit"
            onPress={this.handleSubmit}
          />
        </View>
      );
    }

    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <FormLabel>Enter code:</FormLabel>
          <FormInput
            value={this.state.code}
            onChangeText={code => this.setState({ code })}
            keyboardType='number-pad'
          />
        </View>

        <Button
          title="Submit"
          onPress={this.signIn}
        />
      </View>
    );
  }

  renderSpinner = () => {
    if (this.state.showSpinner) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View />
    );
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        {this.renderSpinner()}
        <Text>{this.state.message}</Text>
        {this.renderPhoneOrCode()}
        <Text>{this.state.codeMessage}</Text>
      </View>
    );
  }
}

const styles = {
  viewContainer: {
    flex: 1,
    marginTop: 100
  }
};

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer;
  const { token } = state.auth;

  return { myPoos, token };
};

export default connect(mapStateToProps, { authLogin })(SignUpForm);
