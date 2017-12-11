import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'moment';

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
    console.log('sent to me renderList');
    console.log(this.state.sentToMe);

    return this.state.sentToMe.map(item => {
      const datetime = moment(item.poo.datetime).format('MMMM Do YYYY, h:mm a');
      const pooImage = allNamedPoos[item.poo.currentPooName].image;
      const description = item.poo.description === '' ? 'No description' : item.poo.description;

      return (
        <Card>
          <Text>From: {item.from.name}</Text>
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
  const { sentToMe } = state.friends;

  return { sentToMe };
};

export default connect(mapStateToProps, { fetchSentToMe })(SentToMeScreen);
