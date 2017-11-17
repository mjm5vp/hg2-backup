import React, { Component } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import _ from 'lodash';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

import allNamedPoos from '../../assets/namedPooExport';

class StatsScreen extends Component {

  componentDidMount() {
    console.log(this.setMostUsed())
  }

  setMostUsed = () => {
    const { myPoos } = this.props;
    // const nameArray = _.map(myPoos, 'currentPooName');

    return _.chain(myPoos)
      .countBy('currentPooName')
      .toPairs()
      .sortBy(1)
      .reverse()
      .value();
      // .map(0)
      // .value();
    //   console.log('result')
    // console.log(result)
    // return result
    // return _.chain(nameArray).countBy()
    // .toPairs()
    // .maxBy(_.first)
      // .head()
      // .value();
  }

  sortByUsed = () => {
    const { myPoos } = this.props;

    // return _.sortBy(myPoos, (poo) => {
    //   return poo.;
    // }).reverse();
  }

  renderMostUsed = () => {
    const mostUsed = this.setMostUsed() || [];
    if (mostUsed.length === 0) {
      return (
        <View>
          <Text>
            No Poomojis Yet
          </Text>
        </View>
      )
    }
    return mostUsed.slice(0, 3).map((poo, key) => {
      const name = poo[0];
      const number = poo[1];
      return (
        <View key={key} style={styles.iterateView}>
          <Image
            source={allNamedPoos[name].image}
          />
          <Text>{number}</Text>
        </View>
      );
    });
  }

  render() {
    return (
      <ScrollView>
        <Card title='Most Used Poomojis'>
          <View style={styles.mostUsedView}>
            {this.renderMostUsed()}
          </View>
        </Card>
      </ScrollView>
    );
  }
}

const styles = {
  mostUsedView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  iterateView: {
    alignItems: 'center'
  }
};

const mapStateToProps = state => {
  const { myPoos } = state.pooReducer;

  return { myPoos };
};

export default connect(mapStateToProps, {})(StatsScreen);
