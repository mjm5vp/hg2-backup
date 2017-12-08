import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, Button, CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';


class SendToFriends extends Component {
  state = {
    checked: true
  }

  componentWillMount() {
    const { myFriends } = this.props;
    this.setState({ myFriends });
  }

  checkBox = i => {
    const newMyFriends = this.state.myFriends;
    newMyFriends[i].checked = !newMyFriends[i].checked;

    this.setState({ myFriends: newMyFriends });
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
              onIconPress={() => this.checkBox(i)}
              checked={checked}
            />
          </View>

        </Card>
      );
    });
  }

  render() {
    return (
      <View>
        {this.renderFriendsList()}
      </View>
    );
  }
}

const styles = {
  cardView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
};

const mapStateToProps = state => {
  const { myFriends } = state.friends;

  return { myFriends };
};

export default connect(mapStateToProps, {})(SendToFriends);
