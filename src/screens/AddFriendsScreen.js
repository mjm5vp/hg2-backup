import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, ListView } from 'react-native';
import { Card, List, ListItem, TextInput, FormLabel, FormInput } from 'react-native-elements';
import { text } from 'react-native-communications';
import Modal from 'react-native-modal';
import Expo from 'expo';
import firebase from 'firebase';
import _ from 'lodash';
import { connect } from 'react-redux';
// import AlphabetListView from 'react-native-alphabetlistview';

import { addFriend } from '../actions';

class AddFriends extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
      usersNumbers: [],
      contactsNumbers: [],
      contactsNamesAndNumbers: [],
      loading: true,
      showModal: false,
      newContactName: '',
      newContactNumber: ''
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
    // console.log(contacts.data[1].phoneNumbers[0].number);
    this.setState({ contacts: contacts.data });
    // console.log('firebase users');
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

  console.log(typeof this.props.myFriends[0].number);

  contacts.data.filter(contact => contact.phoneNumbers[0])
    .forEach(contact => contact.phoneNumbers.forEach(phoneNumber => {
      const number = this.formatPhone(phoneNumber.number);
      if (number.length === 10 && !_.some(this.props.myFriends, ['number', number])) {
        contactsNumbers.push(number);
        contactsNamesAndNumbers.push({ name: contact.name, number });
      }
    }));

  contactsNamesAndNumbers = _.uniqWith(contactsNamesAndNumbers, _.isEqual);
  contactsNamesAndNumbers = _.sortBy(contactsNamesAndNumbers, contact => contact.name);
  this.createDataSource(contactsNamesAndNumbers);
  this.setState({ contactsNumbers, contactsNamesAndNumbers });
}

formatPhone = (phone) => {
  const number = String(phone).replace(/[^\d]/g, '');
  return number.charAt(0) === '1' ? number.substring(1) : number;
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
onPressNonUser = (number) => {
  text(number, 'Join Hoos going 2 so we can track each others poos!');
}

onPressUser = (newContactName, newContactNumber) => {
  this.setState({ newContactName, newContactNumber, showModal: true });
}

renderRow = (contact) => {
  return (
    <ListItem
      title={contact.name}
      subtitle={contact.number}
      onPress={() => this.onPressNonUser(contact.number)}
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
    const { name, number } = contact;
    return (
      <TouchableOpacity onPress={() => this.onPressUser(name, number)}>
        <View>
          <Text>{name}</Text>
          <Text>{number}</Text>
        </View>
      </TouchableOpacity>
    );
  });
}

onAccept = () => {
  this.props.addFriend({
    name: this.state.newContactName,
    number: this.state.newContactNumber
  });
  this.setState({ showModal: false });
}

onDecline = () => {
  this.setState({ showModal: false });
}

  render() {
    if (this.state.loading) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    const input = (
      <View>
        <TextInput
          label='Name'
          value={this.state.newContactName}
          onTextChange={newContactName => this.setState({ newContactName })}
        />
        <TextInput
          label='Number'
          value={this.state.newContactNumber}
          onTextChange={newContactNumber => this.setState({ newContactNumber })}
        />
      </View>
    );

    return (
      <View>
        <Text>Using App</Text>
        {this.renderUsingAppList()}
        <Text>Contacts</Text>
        <ListView
          dataSource={this.dataSource}
          renderRow={this.renderRow}
        />

        <Modal
          isVisible={this.state.showModal}
          backdropColor={'black'}
          backdropOpacity={0.5}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
          animationInTiming={250}
          animationOutTiming={250}
          backdropTransitionInTiming={250}
          backdropTransitionOutTiming={250}
        >
          <View style={styles.modalContent}>
            <View style={styles.inputView}>

              <Text>Confirm contact info</Text>

              <FormLabel>Name</FormLabel>
              <FormInput
                value={this.state.newContactName}
                onChangeText={newContactName => this.setState({ newContactName })}
              />

              <FormLabel>Number</FormLabel>
              <FormInput
                value={this.state.newContactNumber}
                onChangeText={newContactNumber => this.setState({ newContactNumber })}
              />

            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={this.onAccept}>
                <View style={styles.button}>
                  <Text>Add Friend</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onDecline}>
                <View style={styles.cancelButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

        </Modal>

      </View>

    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  cancelButton: {
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  inputView: {
    height: 200,
    width: '100%'
  },
  buttonView: {
    flexDirection: 'row'
  }
};

const mapStateToProps = state => {
  const { myFriends } = state.friends;

  return { myFriends };
};

export default connect(mapStateToProps, { addFriend })(AddFriends);
