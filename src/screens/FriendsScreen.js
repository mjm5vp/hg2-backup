import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Button, Card, Icon, List, ListItem, Divider, FormLabel, FormInput } from 'react-native-elements';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import _ from 'lodash';

import {
  checkAddedMe,
  acceptFriend,
  setFriendsFromDb,
  setFriends
} from '../actions';
import { registerForPushNotificationsAsync } from '../services/push_notifications';
import modalStyles from '../styles/modalStyles';

class FriendsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Friends',
      headerRight: (
        <Icon
          raised
          style={{ marginRight: 10 }}
          name='add-user'
          type='entypo'
          onPress={() => navigation.navigate('add_friends')}
        />
      )
    };
  }

  state = {
    addedMe: [],
    myFriends: [],
    currentUser: null,
    showModal: false,
    editName: '',
    editNumber: '',
    id: ''
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();
    const { myFriends } = this.props;

    const sortedFriends = _.orderBy(myFriends, [friend => friend.name.toLowerCase()]);

    this.setState({ currentUser, myFriends: sortedFriends });
    this.checkAddedMe();
    registerForPushNotificationsAsync();
  }

  checkAddedMe = async () => {
    const { currentUser } = firebase.auth();
    let addedMe = [];

    if (currentUser) {
      await firebase.database().ref(`users/${currentUser.uid}/addedMe`)
        .once('value', snapshot => {
          if (snapshot.val()) {
            addedMe = snapshot.val();
          }
        });
    }
    console.log('addedMe after database check');
    console.log(addedMe);
    addedMe = typeof addedMe === 'object' ? _.values(addedMe) : addedMe;
    // addedMe = addedMe.map(add => {
    //   return { ...add, number: String(add.number) };
    // });
    this.setState({ addedMe });
  }

  renderAddedMe = () => {
    const { addedMe } = this.state;

    if (addedMe.length === 0) {
      return (
        <Card title='Nobody added me' />
      );
    }

    const addedMeList = addedMe.map((add, i) => {
      const { name, number } = add;
      return (
        <View style={styles.addView} key={i}>
          <Text>{name}</Text>
          <View style={styles.iconView}>
            <Icon
              raised
              name='check'
              type='font-awesome'
              color='green'
              onPress={() => this.acceptFriend({ name, number })}
            />
            <Icon
              raised
              name='remove'
              type='font-awesome'
              color='red'
              onPress={() => this.declineFriend({ number })}
            />
          </View>
        </View>
      );
    });

    return (
      <Card title='Added Me'>
        {addedMeList}
      </Card>
    );
  }

  acceptFriend = ({ name, number }) => {
    const { myInfo } = this.props;

    this.props.acceptFriend({ name, number, myName: myInfo.name, myNumber: myInfo.number });
    this.removeFromAddedMe({ number });
  }

  declineFriend = ({ number }) => {
    this.removeFromAddedMe({ number });
  }

  removeFromAddedMe = async ({ number }) => {
    const { currentUser } = this.state;
    const addedMe = this.state.addedMe.filter(add => {
      return add.number !== number;
    });
    await firebase.database().ref(`/users/${currentUser.uid}/addedMe/`)
      .set(addedMe);
    this.setState({ addedMe });
  }

  editContactInfo = (name, number, i) => {
    this.setState({ showModal: true, editName: name, editNumber: number, id: i });
  }

  renderFriendsList = () => {
    const { myFriends } = this.state;

    const myFriendsList = myFriends.map((friend, i) => {
      return (
        <TouchableOpacity
          key={i}
          onPress={() => this.editContactInfo(friend.name, friend.number, i)}
        >
          <View style={styles.friendView}>
            <Text>{friend.name}</Text>
            <Text>{friend.number}</Text>
          </View>
          <Divider />
        </TouchableOpacity>
      );
    });

    return (
      <Card
        title='My Friends'
      >
        {myFriendsList}
      </Card>
    );
  }

  onEditAccept = () => {
    const { editName, editNumber, id, myFriends } = this.state;

    const newMyFriends = myFriends;
    newMyFriends[id] = { name: editName, number: editNumber };

    this.props.setFriends(newMyFriends);
    this.setState({ showModal: false, myFriends: newMyFriends });
  }

  onDelete = () => {
    const { id, myFriends } = this.state;
    const newMyFriends = myFriends;
    newMyFriends.splice(id, 1);

    this.props.setFriends(newMyFriends);
    this.setState({ showModal: false, myFriends: newMyFriends });
  }

  onCancel = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { currentUser } = firebase.auth();

    if (!currentUser) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>You must be signed in to use this feature.</Text>
        </View>
      );
    }
    return (
      <ScrollView>

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
          <View style={modalStyles.modalContent}>
            <View style={modalStyles.inputView}>

              <Text>Edit contact info</Text>

              <FormLabel>Name</FormLabel>
              <FormInput
                value={this.state.editName}
                onChangeText={editName => this.setState({ editName })}
              />

              <FormLabel>Number</FormLabel>
              <FormInput
                value={this.state.editNumber}
                onChangeText={editNumber => this.setState({ editNumber })}
              />

            </View>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={this.onEditAccept}>
                <View style={modalStyles.button}>
                  <Text>Edit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onCancel}>
                <View style={modalStyles.cancelButton}>
                  <Text>Cancel</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={modalStyles.buttonView}>
              <TouchableOpacity onPress={this.onDelete}>
                <View style={modalStyles.dangerButton}>
                  <Text style={modalStyles.dangerButtonText}>Delete</Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>

        </Modal>

        {this.renderAddedMe()}
        {/* <View style={styles.menuView}> */}

          {/* <Button
            title='Add Friends'
            onPress={() => this.props.navigation.navigate('add_friends')}
          /> */}
        {/* </View> */}
        {this.renderFriendsList()}

      </ScrollView>
    );
  }
}

const styles = {
  menuView: {
    flexDirection: 'row'
  },
  addView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconView: {
    flexDirection: 'row'
  },
  friendView: {
    marginTop: 10,
    marginBottom: 10
  }
};

const mapStateToProps = state => {
  const { myFriends, addedMe } = state.friends;
  const { myInfo } = state.auth;

  return { myFriends, addedMe, myInfo };
};

export default connect(mapStateToProps, {
  checkAddedMe,
  acceptFriend,
  setFriendsFromDb,
  setFriends
})(FriendsScreen);
