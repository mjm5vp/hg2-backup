import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ListView,
  TouchableWithoutFeedback,
  Keyboard,
  Linking
} from 'react-native';
import { Card, ListItem, Icon, Button, FormInput, FormLabel } from 'react-native-elements';
import { text } from 'react-native-communications';
import Expo from 'expo';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import _ from 'lodash';
import { connect } from 'react-redux';
// import AlphabetListView from 'react-native-alphabetlistview';

// import AddFriendModal from '../modals/AddFriendModal';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import { addFriend } from '../actions';
import styles from '../styles/modalStyles';
import addStyles from '../styles/addStyles';

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
      confirmCancelModalVisible: false,
      sendNumber: null,
      newContactName: '',
      newContactNumber: '',
      contactPermissionDenied: null
    };
  }


  componentDidMount() {
    this.showFirstContactAsync();
  }

  addByNumber = () => {
    this.setState({
      showModal: true,
    });
  }

  renderAddFriendModal = () => {
    return (
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
        avoidKeyboard
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
              keyboardType='number-pad'
              value={this.state.newContactNumber}
              onChangeText={newContactNumber => this.setState({ newContactNumber })}
            />

          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => this.onAccept(this.state.newContactName, this.state.newContactNumber)}
            >
              <View style={styles.button}>
                <Text>Add Friend</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ showModal: false })}>
              <View style={styles.cancelButton}>
                <Text>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>

      </Modal>
    );
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
      this.setState({ loading: false, contactPermissionDenied: true });
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

  // console.log(typeof this.props.myFriends[0].number);

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
  this.setState({ confirmCancelModalVisible: true, sendNumber: number });
}

sendText = () => {
  text(this.state.sendNumber, 'Download Hoos going 2 so we can track each others poos!');
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

// changeValue = (type, value) => {
//   console.log('changeValue');
//
//   this.setState({ name: value });
// }

changeName = (name) => {
  this.setState({ name });
}

changeNumber = (number) => {
  this.setState({ number });
}

renderAddFriendByNumber = () => {
  // console.log('renderAddFriendByNumber, name number')
  // console.log(this.state.newContactName);
  // console.log(this.state.newContactNumber);
  return (
    <View>

      <Card>
        <TouchableOpacity onPress={() => this.addByNumber()}>
          <View
            style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}
          >
            <Text>Add Friend by Number</Text>
            <Icon
              name='ios-add-circle-outline'
              type='ionicon'
              color='#517fa4'
              size={20}
              style={{ margin: 5 }}
            />
          </View>
        </TouchableOpacity>
      </Card>

      {this.renderAddFriendModal()}

  </View>
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

  const finalList = usingAppNamesAndNumbers.map((contact, i) => {
    const { name, number } = contact;
    return (
        <Card
          key={i}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text>{name}</Text>
              <Text>{number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.onPressUser(name, number)}>
              <View style={addStyles.addButtonView}>
                <Text>Add</Text>
                <Icon
                  name='ios-add-circle-outline'
                  type='ionicon'
                  color='#517fa4'
                  size={20}
                  style={{ margin: 5 }}
                />
              </View>
            </TouchableOpacity>
          </View>

        </Card>
    );
  });

  return (
    <Card
      title='Contacts using Hoos Going 2'
    >
      {finalList}
    </Card>
  );
}

onAccept = () => {
  const { name, number } = this.props.myInfo;
  const friend = { name: this.state.newContactName, number: this.state.newContactNumber };
  const myInfo = { name, number, pushToken: this.props.notificationToken };

  this.props.addFriend(friend, myInfo);
  this.setState({ showModal: false });
}

  render() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: '50%', alignItems: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
    }


    if (this.state.contactPermissionDenied) {
      return (
        <View>
          {this.renderAddFriendByNumber()}
          <Card>
            <View>
              <Text>
                Enable CONTACTS in SETTINGS to see which of your contacts are already
                using Hoos Going 2.
              </Text>
              <Button
                title='Go to Settings'
                onPress={() => Linking.openURL('app-settings:')}
                style={{ marginTop: 10 }}
              />
            </View>
          </Card>
        </View>
      );
    }

    // const input = (
    //   <View>
    //     <TextInput
    //       label='Name'
    //       value={this.state.newContactName}
    //       onTextChange={newContactName => this.setState({ newContactName })}
    //     />
    //     <TextInput
    //       label='Number'
    //       value={this.state.newContactNumber}
    //       onTextChange={newContactNumber => this.setState({ newContactNumber })}
    //     />
    //   </View>
    // );

    return (
      <ScrollView>
        <View>
          {this.renderAddFriendByNumber()}
          {this.renderUsingAppList()}
          <Card title='Invite Friends'>
            <ListView
              dataSource={this.dataSource}
              renderRow={this.renderRow}
            />
          </Card>

          {this.renderAddFriendModal()}

          <ConfirmCancelModal
            infoText='Text contact with invite link?'
            visible={this.state.confirmCancelModalVisible}
            onAccept={this.sendText}
            onDecline={() => this.setState({ confirmCancelModalVisible: false })}
          />

        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { myInfo, notificationToken } = state.auth;
  const { myFriends } = state.friends;

  return { myFriends, myInfo, notificationToken };
};

export default connect(mapStateToProps, { addFriend })(AddFriends);
