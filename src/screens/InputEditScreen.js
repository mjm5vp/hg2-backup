import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import allNamedPoos from '../../assets/namedPooExport';
import {
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  editPoos,
  resetInput
} from '../actions';


class InputEditScreen extends Component {
  state = {
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: '',
  }

  componentDidMount() {
    console.log(`this.props.inputUID: ${this.props.inputUID}`)
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

  renderMapPreview = () => {
    if (this.props.location.latitude) {
      const { latitude, longitude } = this.props.location;
      const pooImage = allNamedPoos[this.props.currentPooName].image;

      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      };

      return (
        <Card>
          <View style={{ height: 200 }}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              cacheEnabled={Platform.OS === 'android'}
              scrollEnabled={false}
              region={region}
            >
              <MapView.Marker
                coordinate={this.props.location}
                image={pooImage}
                anchor={{ x: 0.5, y: 0.5 }}
              />
            </MapView>
          </View>

          <Button
            title='Change Location'
            onPress={() => this.props.navigation.navigate('map_select')}
          />
        </Card>
      );
    }

    return (
      <Card>
        <View style={styles.emptyMapView}>
          <Text>Location Not Set</Text>
        </View>

        <Button
          title='Add to Map'
          onPress={() => this.props.navigation.navigate('map_select')}
        />
      </Card>
    );
  }

  updateByUID = () => {
    const { inputUID, currentPooName, datetime, description, location, myPoos } = this.props;

    return myPoos.map(poo => {
      console.log(`poo.inputUID: ${poo.inputUID}`)
      console.log(`inputUID: ${inputUID}`)
      if (poo.inputUID === inputUID) {
        return { inputUID, currentPooName, datetime, description, location };
      }
      return poo;
    });
  }

  handleUpdate = () => {
    const newPoos = this.updateByUID();

    this.props.editPoos(newPoos);
    this.props.resetInput();
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

        {this.renderMapPreview()}

        <Button
          title='Update'
          onPress={() => this.handleUpdate()}
        />

      </View>
    );
  }
}

const styles = {
  emptyMapView: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  }
};

const mapStateToProps = state => {
  const { inputUID, currentPooName, description, datetime, location } = state.input;
  const { myPoos } = state.pooReducer;
  return {
    inputUID,
    currentPooName,
    description,
    datetime,
    location,
    myPoos
   };
};

export default connect(mapStateToProps, {
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  editPoos,
  resetInput
})(InputEditScreen);
