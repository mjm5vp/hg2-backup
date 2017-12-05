import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from 'firebase';
import _ from 'lodash';

import { checkAddedMe } from '../actions';

class FriendsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Friends',
      // headerRight: (
      //   <Button
      //     title='Add Friend'
      //     onPress={() => navigation.navigate('add_friends')}
      //   />
      // )
    };
  }

  state = {
    addedMe: []
  }

  componentWillMount() {
    this.checkAddedMe();
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
    addedMe = typeof addedMe === 'object' ? _.values(addedMe) : addedMe;
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
          <Text>Nobody added me</Text>
          <Text>Nobody added me</Text>
          <Text>Nobody added me</Text>
          <Text>Nobody added me</Text>
          <Text>Nobody added me</Text>

        </View>
      );
    }

    return addedMe.map(add => {
      return (
          <Text>{add.name}</Text>
      );
    });


  }

  renderFriendsList = () => {
    const { myFriends } = this.props;

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
    return (
      <View>
        {this.renderAddedMe()}
        <View style={styles.menuView}>

          <Button
            title='Add Friends'
            onPress={() => this.props.navigation.navigate('add_friends')}
          />
        </View>
        <Text>Friends</Text>
        {this.renderFriendsList()}
      </View>
    );
  }
}

const styles = {
  menuView: {
    flexDirection: 'row'
  }
};

const mapStateToProps = state => {
  const { myFriends, addedMe } = state.friends;

  return { myFriends, addedMe };
};

export default connect(mapStateToProps, { checkAddedMe })(FriendsScreen);
