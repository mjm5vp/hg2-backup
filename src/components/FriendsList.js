import { Card, Divider } from 'react-native-elements'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import {
  getUsersNumbers,
  setFriends,
  setFriendsFromDb,
  showContactsAsync
} from '../actions'

import OKModal from '../modals/OKModal'
import { connect } from 'react-redux'

class FriendsList extends Component {
  state = {
    myFriends: [],
    showModal: false,
    editName: '',
    editNumber: '',
    id: null
  }
  componentWillMount() {
    this.props.setFriendsFromDb()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      myFriends: nextProps.myFriends
    })
  }

  editContactInfo = (name, number, i) => {
    this.setState({
      showModal: true,
      editName: name,
      editNumber: number,
      id: i
    })
  }

  render() {
    const { myFriends } = this.state

    const myFriendsList = myFriends.map((friend, i) => {
      const { name, number } = friend
      return (
        <View>
          <OKModal
            infoText="hello"
            buttonText="OK"
            onAccept={() => this.setState({ showModal: false })}
            visible={this.state.showModal}
          />
          <TouchableOpacity
            key={i}
            onPress={() => this.editContactInfo(name, number, i)}
          >
            <View style={styles.friendView}>
              <Text>{name}</Text>
              <Text>{number}</Text>
            </View>
            <Divider />
          </TouchableOpacity>
        </View>
      )
    })

    return <Card title="My Friends">{myFriendsList}</Card>
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
  },
  friendView: {
    marginTop: 10,
    marginBottom: 10
  }
}

const mapStateToProps = state => {
  const { myFriends } = state.friends
  const { myInfo, notificationToken } = state.auth

  return { myFriends, myInfo, notificationToken }
}

export default connect(
  mapStateToProps,
  {
    setFriendsFromDb,
    setFriends,
    showContactsAsync,
    getUsersNumbers
  }
)(FriendsList)
