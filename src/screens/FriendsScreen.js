import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, ListView } from 'react-native';
import { Card, List, ListItem } from 'react-native-elements';
import Expo from 'expo';
import firebase from 'firebase';
import _ from 'lodash';
import AlphabetListView from 'react-native-alphabetlistview';

class Friends extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      usersNumbers: [],
      contactsNumbers: [],
      contactsNamesAndNumbers: [],
      loading: true
    };
  }


  componentDidMount() {
    this.showFirstContactAsync();
  }

  createDataSource(contactsNamesAndNumbers) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(contactsNamesAndNumbers);
    this.setState({ loading: false });
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
      ],
      pageSize: 1000,
      pageOffset: 0,
    });
    this.formatContacts(contacts);
    console.log(contacts.data[1].phoneNumbers[0].number);
    this.setState({ contacts: contacts.data });
    console.log('firebase users');
    let usersNumbers = null;
    await firebase.database().ref('/users')
      .once('value', snapshot => {
        usersNumbers = Object.keys(snapshot.val());
      });
    this.setState({ usersNumbers });
  }

formatContacts = (contacts) => {
  const contactsNumbers = [];
  let contactsNamesAndNumbers = [];

  contacts.data.filter(contact => contact.phoneNumbers[0])
    .forEach(contact => contact.phoneNumbers.forEach(phoneNumber => {
      const number = String(phoneNumber.number).replace(/[^\d]/g, '');
      if (number.length > 9) {
        contactsNumbers.push(number);
        contactsNamesAndNumbers.push({ name: contact.name, number });
      }
    }));

  contactsNamesAndNumbers = _.sortBy(contactsNamesAndNumbers, contact => contact.name);
  this.createDataSource(contactsNamesAndNumbers);
  this.setState({ contactsNumbers, contactsNamesAndNumbers });
}

// renderContactList = () => {
//   if (this.state.contactsNamesAndNumbers === []) {
//     return (
//       <ActivityIndicator />
//     );
//   }
//   return this.state.contactsNamesAndNumbers.map((contact) => {
//       return (
//         <Card>
//           <View>
//             <Text>{contact.name}</Text>
//             <Text>{contact.number}</Text>
//           </View>
//         </Card>
//
//       );
//   });
// }

renderRow(contact) {
  return (
    <ListItem
      title={contact.name}
      subtitle={contact.number}
    />
  );
}

renderUsingAppList = () => {
  const { contactsNumbers, usersNumbers, contactsNamesAndNumbers } = this.state;

  const usingApp = _.intersectionWith(contactsNumbers, usersNumbers, _.isEqual);
  const usingAppNamesAndNumbers = [];

  usingApp.forEach(usingContact => {
    usingAppNamesAndNumbers.push(_.find(contactsNamesAndNumbers, contact => {
      return usingContact === contact.number;
    }));
  });

  return usingAppNamesAndNumbers.map(contact => {
    return (
      <View>
        <Text>{contact.name}</Text>
        <Text>{contact.number}</Text>
      </View>
    );
  });
}

  render() {
    if (this.state.loading) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View>
        <Text>Using App</Text>
        {this.renderUsingAppList()}
        <Text>Contacts</Text>
        <ListView
          dataSource={this.dataSource}
          renderRow={this.renderRow}
        />
      </View>

    );
  }
}

export default Friends;
