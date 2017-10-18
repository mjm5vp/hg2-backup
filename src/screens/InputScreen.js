import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { selectPoo, updateDescription } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';


class InputScreen extends Component {
  state = {
    datetime: moment(),
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: ''
  }

  _showDatePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (date) => {
    const time = this.state.time.format('HH:mm')
    date = moment(date).format('YYYY-MM-DD')
    const datetime = date + 'T' + time

    this.setState({ date: moment(date), datetime: moment(datetime) });
    this._hideDatePicker();
  };

  _showTimePicker = () => this.setState({ isTimePickerVisible: true });

  _hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  _handleTimePicked = (time) => {
    const date = this.state.date.format('YYYY-MM-DD')
    time = moment(time).format('HH:mm')
    const datetime = date + 'T' + time

    this.setState({ time: moment(time), datetime: moment(datetime) });
    this._hideTimePicker();
  };

  render() {
    const pooImage = allNamedPoos[this.props.currentPooName].image;

    return (
      <View>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>
        <Text>Oh hai Input</Text>

        <Image
          source={pooImage}
        />

        <Button
          title='Select'
          onPress={() => this.props.navigation.navigate('select')}
        />

        <TouchableOpacity onPress={this._showDatePicker}>
          <Text>Change Date</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this._showTimePicker}>
          <Text>Change Time</Text>
        </TouchableOpacity>

        <DateTimePicker
          mode='date'
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDatePicker}
        />

        <DateTimePicker
          mode='time'
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this._handleTimePicked}
          onCancel={this._hideTimePicker}
        />

        <Text>{this.state.datetime.format('MMMM Do YYYY, h:mm a')} </Text>

        <TextInput
          label='Description'
          placeholder='How did everything go?'
          value={this.props.description}
          onChangeText={text => this.props.updateDescription({ text })}
        />

      </View>
    );
  }
}

const mapStateToProps = state => {
  const { currentPooName, description } = state.input;
  return {
    currentPooName,
    description
   };
};

export default connect(mapStateToProps, { selectPoo, updateDescription })(InputScreen);
