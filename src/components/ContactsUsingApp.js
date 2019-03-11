import { Card, Divider } from 'react-native-elements'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { Component } from 'react'

import _ from 'lodash'
import { connect } from 'react-redux'

class ContactsUsingApp extends Component {
  state = {
    usingAppNamesAndNumbers: []
  }

  componentWillMount() {
    const { contactsNumbers, usersNumbers } = this.state

    const usingApp = _.intersectionWith(
      contactsNumbers,
      usersNumbers,
      _.isEqual
    )
    const usingAppNamesAndNumbers = []

    usingApp.forEach(usingContact => {
      usingAppNamesAndNumbers.push(
        _.find(contactsNamesAndNumbers, contact => {
          return usingContact === contact.number
        })
      )
    })

    this.setState({ usingAppNamesAndNumbers })
  }

  renderUsingAppList = () => {
    const { usingAppNamesAndNumbers } = this.state
    if ((usingAppNamesAndNumbers.length = 0)) {
      return
    }
    const finalList = usingAppNamesAndNumbers.map((contact, i) => {
      const { name, number } = contact
      return (
        <Card key={i}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View>
              <Text>{name}</Text>
              <Text>{number}</Text>
            </View>
            <TouchableOpacity onPress={() => this.onPressUser(name, number)}>
              <View style={addStyles.addButtonView}>
                <Text>Add</Text>
                <Icon
                  name="ios-add-circle-outline"
                  type="ionicon"
                  color="#517fa4"
                  size={20}
                  style={{ margin: 5 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </Card>
      )
    })

    return <Card title="Contacts using Hoos Going 2">{finalList}</Card>
  }

  render() {
    return <View>{this.renderUsingAppList()}</View>
  }
}

const styles = {}

const mapStateToProps = state => {
  const { myInfo, notificationToken } = state.auth
  const { myFriends, allContacts, usersNumbers } = state.friends

  return { myFriends, allContacts, usersNumbers, myInfo, notificationToken }
}

export default connect(
  mapStateToProps,
  {}
)(ContactsUsingApp)
