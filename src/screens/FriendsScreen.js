import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Button, Card, Icon, List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';

import { checkAddedMe, acceptFriend, setFriendsFromDb } from '../actions';

class FriendsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Friends',
      headerRight: (
        <Button
          title='Add Friend'
          onPress={() => navigation.navigate('add_friends')}
        />
      )
    };
  }

  state = {
    addedMe: [],
    currentUser: null
  }

  componentWillMount() {
    const { currentUser } = firebase.auth();

    if (currentUser) {
      this.setState({ currentUser });
      this.props.setFriendsFromDb();
      this.checkAddedMe();
    }
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
    console.log('addedMe');
    console.log(addedMe);
    if (addedMe.length === 0) {
      return (
        <View>
          <Text>Nobody added me</Text>
        </View>
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
    this.props.acceptFriend({ name, number });
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

  renderFriendsList = () => {
    const { myFriends } = this.props;
    console.log('myFriends');
    console.log(myFriends);

    return myFriends.map(friend => {
      return (
        <View>
          <Text>{friend.name}</Text>
          <Text>{friend.number}</Text>
        </View>
      );
    });
  }

  render() {
    const { currentUser } = firebase.auth();
    console.log('currentUser');
    console.log(currentUser);
    if (!currentUser) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>You must be signed in to use this feature.</Text>
        </View>
      );
    }
    return (
      <ScrollView>
        {this.renderAddedMe()}
        {/* <View style={styles.menuView}> */}

          {/* <Button
            title='Add Friends'
            onPress={() => this.props.navigation.navigate('add_friends')}
          /> */}
        {/* </View> */}
        <Text>Friends</Text>
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
  }
};

const mapStateToProps = state => {
  const { myFriends, addedMe } = state.friends;

  return { myFriends, addedMe };
};

export default connect(mapStateToProps, {
  checkAddedMe,
  acceptFriend,
  setFriendsFromDb
})(FriendsScreen);
