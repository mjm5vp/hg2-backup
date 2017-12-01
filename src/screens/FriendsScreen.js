import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import Expo from 'expo';
import firebase from 'firebase';

class Friends extends Component {
  state = {
    usersNumbers: [],
    contactsNumbers: [],
    contactsNamesAndNumbers: []
  }

  componentDidMount() {
    this.showFirstContactAsync();
  }

  showFirstContactAsync = async () => {
  // Ask for permission to query contacts.
  const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS);
  if (permission.status !== 'granted') {
    // Permission was denied...
    return;
  }
  const contacts = await Expo.Contacts.getContactsAsync({
    fields: [
      Expo.Contacts.PHONE_NUMBERS,
      Expo.Contacts.EMAILS,
    ],
    pageSize: 1000,
    pageOffset: 0,
  });
  this.formatContacts(contacts);
  console.log(contacts.data[1].phoneNumbers[0].number);
  this.setState({ contacts: contacts.data });
  console.log('firebase users');
  let users = null;
  await firebase.database().ref('/users')
    .once('value', snapshot => {
      users = Object.keys(snapshot.val());
    });
  this.setState({ users });
}

formatContacts = (contacts) => {
  const contactsNumbers = [];
  const contactsNamesAndNumbers = [];

  contacts.data.filter(contact => contact.phoneNumbers[0])
    .forEach(contact => contact.phoneNumbers.forEach(phoneNumber => {
      const number = String(phoneNumber.number).replace(/[^\d]/g, '');
      contactsNumbers.push(number);
      contactsNamesAndNumbers.push({ name: contact.name, number });
    }));

  this.setState({ contactsNumbers, contactsNamesAndNumbers });
}

renderContactList = () => {
  if (this.state.contacts === []) {
    return (
      <ActivityIndicator />
    );
  }
  return this.state.contacts.map((contact) => {
    if (contact.phoneNumbers[0]) {
      return (
        <View>
          <Text>{contact.name}</Text>
          <Text>{contact.phoneNumbers[0].number}</Text>
        </View>
      );
    }
    return (
      <View>
        <Text>{`HAS NO PHONE NUMBERS`}</Text>
      </View>
    );
  });
}

renderUsingAppList = () => {

}

  render() {
    return (
      <ScrollView>
        {/* {this.renderContactList()} */}
      </ScrollView>
    );
  }
}

export default Friends;
