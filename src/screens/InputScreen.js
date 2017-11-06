import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { selectPoo, updateDescription, updateDateTime, addPoo } from '../actions';
import allNamedPoos from '../../assets/namedPooExport';


class InputScreen extends Component {
  state = {
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: ''
  }

  showDatePicker = () => this.setState({ isDatePickerVisible: true });

  hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  handleDatePicked = (date) => {
    const time = this.state.time.format('HH:mm');
    const newDate = moment(date).format('YYYY-MM-DD');
    const datetime = `${newDate}T${time}`;

    this.props.updateDateTime(moment(datetime));
    this.setState({ date: moment(date) });
    this.hideDatePicker();
  };

  showTimePicker = () => this.setState({ isTimePickerVisible: true });

  hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  handleTimePicked = (time) => {
    const date = this.state.date.format('YYYY-MM-DD');
    const newTime = moment(time).format('HH:mm');
    const datetime = `${date}T${newTime}`;

    this.props.updateDateTime(moment(datetime));
    this.setState({ time: moment(time) });
    this.hideTimePicker();
  };

  handleFlush = () => {
    const { currentPooName, datetime, description, location } = this.props;

    this.props.addPoo({ currentPooName, datetime, description, location });
    this.props.navigation.goBack();
  }

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

        <TouchableOpacity onPress={this.showDatePicker}>
          <Text>Change Date</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.showTimePicker}>
          <Text>Change Time</Text>
        </TouchableOpacity>

        <DateTimePicker
          mode='date'
          isVisible={this.state.isDatePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDatePicker}
        />

        <DateTimePicker
          mode='time'
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this.handleTimePicked}
          onCancel={this.hideTimePicker}
        />

        <Text>{this.props.datetime.format('MMMM Do YYYY, h:mm a')} </Text>

        <TextInput
          label='Description'
          placeholder='How did everything go?'
          value={this.props.description}
          onChangeText={text => this.props.updateDescription({ text })}
        />

        <Button
          title='Add to Map'
          onPress={() => this.props.navigation.navigate('map_select')}
        />

        <Button
          title='Flush'
          onPress={() => this.handleFlush()}
        />

      </View>
    );
  }
}

const mapStateToProps = state => {
  const { currentPooName, description, datetime, location } = state.input;
  return {
    currentPooName,
    description,
    datetime,
    location
   };
};

export default connect(mapStateToProps, {
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo
})(InputScreen);
