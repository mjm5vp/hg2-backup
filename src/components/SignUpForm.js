import React, { Component } from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import axios from 'axios';
import firebase from 'firebase';
import { connect } from 'react-redux';
import _ from 'lodash';

const ROOT_URL = 'https://us-central1-one-time-password-698fc.cloudfunctions.net';

class SignUpForm extends Component {

  state = {
    phone: '',
    code: '',
    phoneEntered: false
   };

  handleSubmit = async () => {
    const { phone } = this.state;

    this.checkIfUserIdExists(phone);
    this.setState({ phoneEntered: true });
  }

  checkIfUserIdExists = async (userId) => {
    await firebase.database().ref(`/users/${userId}`)
    .once('value', snapshot => {
      if (snapshot.val()) {
        console.log('user exists');
        this.userExists(userId);
      } else {
        console.log('user does not exist');
        this.newUser();
      }
    });
  }

  userExists = async (phone) => {
    await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone });
  }

  signIn = async () => {
    const { myPoos } = this.props;
    const { phone, code } = this.state;
    var dbMyPoos = [];
    //async await
    try {
      const { data } = await axios.post(`${ROOT_URL}/verifyOneTimePassword`, { phone, code });
      await firebase.auth().signInWithCustomToken(data.token);

      await firebase.database().ref(`/users/${phone}/myPoos`)
      .once('value', snapshot => {
        dbMyPoos = snapshot.val() ? snapshot.val() : [];
      });
      console.log(dbMyPoos);
      const combinedAndReducedPoos = this.combineAndDeleteDuplicates({ dbMyPoos, myPoos });
      const finalPoos = this.convertDatetimeToString(combinedAndReducedPoos);

      firebase.database().ref(`/users/${phone}`)
        .update({ myPoos: finalPoos });

      console.log('success');
      this.props.navigation.goBack();
    } catch (err) {
      console.log('handlesubmit error');
      console.log(err);
    }
  }

  convertDatetimeToString = (myPoos) => {
    return myPoos.map(poo => {
      const newPoo = poo;
      const newDatetime = newPoo.datetime.toString();
      newPoo.datetime = newDatetime;
      return newPoo;
    });
  }

  combineAndDeleteDuplicates = ({ dbMyPoos, myPoos }) => {
    const combinedPoos = dbMyPoos.concat(myPoos);

    return _.uniqWith(combinedPoos, _.isEqual);
  }

  newUser = async () => {
    const { phone } = this.state;

    try {
      await axios.post(`${ROOT_URL}/createUser`, { phone });
      await axios.post(`${ROOT_URL}/requestOneTimePassword`, { phone });
    } catch (err) {
      console.log(err);
    }
  }

  renderPhoneOrCode = () => {
    if (this.state.phoneEntered) {
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
      )
    }

    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <FormLabel>Enter a phone number:</FormLabel>
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
    )
  }

  render() {
    return (
      <View>
        {this.renderPhoneOrCode()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer;

  return { myPoos };
};

export default connect(mapStateToProps, {})(SignUpForm);
