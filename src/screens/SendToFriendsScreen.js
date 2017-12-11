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
    checked: true,
    myFriends: [],
    checkedFriends: []
  }

  componentWillMount() {
    const { myFriends } = this.props;

    const sortedFriends = _.sortBy(myFriends, friend => friend.name).reverse();
    this.setState({ myFriends: sortedFriends });
  }

  checkBox = i => {
    const newMyFriends = this.state.myFriends;
    newMyFriends[i].checked = !newMyFriends[i].checked;

    const checkedFriends = newMyFriends.filter(friend => friend.checked);

    this.setState({
      myFriends: newMyFriends,
      checkedFriends
     });
  }

  onSubmit = () => {
    this.props.setSendToFriends(this.state.checkedFriends);
    this.props.navigation.goBack();
  }

  renderFriendsList = () => {
    return this.state.myFriends.map((friend, i) => {
      const checked = friend.checked;
      return (
        <Card key={i}>
          <View style={styles.cardView}>
            <View>
              <Text>{friend.name}</Text>
              <Text>{friend.number}</Text>
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

    if (checkedFriends.length === 0) {
      return (
        <View>
          <Text>No friends selected</Text>
        </View>
      );
    }

    const checkedFriendsList = checkedFriends.map((friend, i) => {
      return (
        <Text key={i}>{friend.name}</Text>
      );
    });

    return (
      <View style={styles.submitButtonContainer}>
        <ScrollView horizontal style={{ flexDirection: 'row' }}>
          {checkedFriendsList}
        </ScrollView>
        <Button
          title='Done'
          onPress={() => this.onSubmit()}
        />
      </View>
    );
  }

  render() {
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

  return { myFriends };
};

export default connect(mapStateToProps, { setSendToFriends })(SendToFriends);
