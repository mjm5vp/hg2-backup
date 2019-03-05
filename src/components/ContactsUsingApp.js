import { Card, Divider } from 'react-native-elements'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

import allNamedPoos from '../../assets/namedPooExport'
import moment from 'moment'

class ContactsUsingApp extends Component {
  render() {
    const { poo, onLogItemPress } = this.props
    const datetime = moment(poo.datetime).format('MMMM Do YYYY, h:mm a')
    const pooImage = allNamedPoos[poo.currentPooName].image
    const description =
      poo.description === '' ? 'No description' : poo.description

    return (
      <Card>
        <TouchableOpacity onPress={() => onLogItemPress(poo)}>
          <View style={styles.containerView}>
            <Image source={pooImage} style={styles.imageStyle} />
            <View style={styles.rightView}>
              <Text>{datetime}</Text>
              <Divider />
              <Text>{description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    )
  }
}

const styles = {}

export default LogItem
