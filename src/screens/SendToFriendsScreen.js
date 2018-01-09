import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Card, Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setSendToFriends } from '../actions';


class SendToFriends extends Component {
  static navigationOptions = {
    title: 'Send to Friends',
    headerBackTitle: 'Cancel'
  }

  state = {
    myFriendsList: [],
    checkedFriends: []
  }

  componentWillMount() {
    const { myFriends, sendToFriends } = this.props;
    const newMyFriends = myFriends;

    const sortedFriends = _.sortBy(newMyFriends, friend => friend.name);

    // const checkedFriends = myFriends.filter(friend => friend.checked);
    // const sortedCheckedFriends = _.sortBy(checkedFriends, friend => friend.name);

    this.setState({ myFriendsList: sortedFriends, checkedFriends: sendToFriends });
  }

  checkBox = i => {
    const newMyFriends = this.state.myFriendsList;
    const newNew = newMyFriends

    this.props.myFriends.forEach(friend => {
      console.log('after defining')
      console.log(friend.name);
      console.log(friend.checked);
    });

    // newMyFriends[i].checked = !newMyFriends[i].checked;
    newNew[i].name = 'billbob';

    this.props.myFriends.forEach(friend => {
      console.log('after !')
      console.log(friend.name);
      console.log(friend.checked);
    });

    const checkedFriends = newNew.filter(friend => friend.checked);

    this.setState({
      myFriendsList: newNew, 
      checkedFriends
     });
  }

  onSubmit = () => {



    this.props.setSendToFriends(this.state.checkedFriends);
    this.props.navigation.goBack();
  }

  renderFriendsList = () => {
    return this.state.myFriendsList.map((friend, i) => {
      const checked = friend.checked;
      return (
        <Card key={i}>
          <View style={styles.cardView}>
            <View>
              <Text>{friend.name}</Text>
            </View>
            <CheckBox
              onPress={() => this.checkBox(i)}
              checked={checked}
            />
          </View>

        </Card>
      );
    });
  }

  renderSubmitButton = () => {
    const { checkedFriends } = this.state;
    let checkedFriendsList = null;

    if (checkedFriends.length === 0) {
      checkedFriendsList = (
        <Text>No friends selected</Text>
      );
    } else {
      checkedFriendsList = checkedFriends.map((friend, i) => {
        if (i === 0) {
          return (
            <Text key={i}>{friend.name}</Text>
          );
        }
        return (
          <Text key={i}>, {friend.name}</Text>
        );
      });
    }

    return (
      <View style={styles.submitButtonContainer}>
        <ScrollView horizontal style={{ flexDirection: 'row' }}>
          {checkedFriendsList}
        </ScrollView>
        <Button
          title='Confirm'
          onPress={() => this.onSubmit()}
        />
      </View>
    );
  }

  render() {
    this.props.myFriends.forEach(friend => {
      console.log(friend.name);
      console.log(friend.checked);
    });
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {this.renderFriendsList()}
        </ScrollView>

        {this.renderSubmitButton()}

      </View>

    );
  }
}

const styles = {
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButtonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    width: '80%'
  },
};

const mapStateToProps = state => {
  const { myFriends } = state.friends;
  const { sendToFriends } = state.input;

  return { myFriends, sendToFriends };
};

export default connect(mapStateToProps, { setSendToFriends })(SendToFriends);
