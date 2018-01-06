import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import { fetchSentToMe } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';

class SentToMeScreen extends Component {
  state = {
    sentToMe: []
  }

  componentDidMount() {
    this.props.fetchSentToMe();
  }

  componentWillReceiveProps(nextProps) {
    const { sentToMe } = nextProps;

    this.setState({ sentToMe });
  }

  renderList = () => {
    return this.state.sentToMe.map(item => {
      // console.log(this.props.myFriends);
      // console.log(item.from.number);
      const matchedFriend = _.find(this.props.myFriends, ['number', item.from.number]);
      // console.log('matchedFriend');
      // console.log(matchedFriend);
      const datetime = moment(item.poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[item.poo.currentPooName].image;
      const description = item.poo.description === '' ? 'No description' : item.poo.description;

      return (
        <Card>
          <Text>From: {matchedFriend.name}</Text>
          <View style={styles.containerView}>
            <Image
              source={pooImage}
              style={styles.imageStyle}
            />
            <View style={styles.rightView}>
              <Text>{datetime}</Text>
              <Divider />
              <Text>{description}</Text>
            </View>
          </View>
        </Card>
      );
    });
  }

  render() {
    return (
      <View>
        {this.renderList()}
      </View>
    );
  }
}

const styles = {
  containerView: {
    flexDirection: 'row',
    height: 100
  },
  imageStyle: {
    width: '30%'
  },
  rightView: {
    width: '70%'
  }
};

const mapStateToProps = state => {
  const { sentToMe, myFriends } = state.friends;

  return { sentToMe, myFriends };
};

export default connect(mapStateToProps, { fetchSentToMe })(SentToMeScreen);
