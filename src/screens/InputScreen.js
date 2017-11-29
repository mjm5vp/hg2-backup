import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Confirm from '../components/Confirm';
import allNamedPoos from '../../assets/namedPooExport';
import toiletImage from '../../assets/otherImages/toilet.jpg';
import styles from '../styles/inputStyles';
import {
  increaseUID,
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  editPoos,
  resetInput } from '../actions';


class InputScreen extends Component {
  state = {
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: '',
    showModal: false
  }

  componentDidMount() {

  }

  showDatePicker = () => this.setState({ isDatePickerVisible: true });

  hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  handleDatePicked = (date) => {
    const time = this.state.time.format('HH:mm');
    const newDate = moment(date).format('YYYY-MM-DD');
    const datetime = `${newDate}T${time}`;

    this.props.updateDateTime(datetime);
    this.setState({ date: moment(date) });
    this.hideDatePicker();
  };

  showTimePicker = () => this.setState({ isTimePickerVisible: true });

  hideTimePicker = () => this.setState({ isTimePickerVisible: false });

  handleTimePicked = (time) => {
    const date = this.state.date.format('YYYY-MM-DD');
    const newTime = moment(time).format('HH:mm');
    const datetime = `${date}T${newTime}`;

    this.props.updateDateTime(datetime);
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
      console.log(region);

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
            buttonStyle={styles.mapButton}
          />
        </Card>
      );
    }

    return (
      <Card>
        <View style={styles.emptyMapView}>
          <Text style={{}}>Location Not Set</Text>
        </View>

        <Button
          title='Add to Map'
          onPress={() => this.props.navigation.navigate('map_select')}
          buttonStyle={styles.mapButton}
        />
      </Card>
    );
  }

  renderFlushButton = () => {
    if (this.props.inputType === 'new') {
      return (
        <View>
          <Card title='Flush' containerStyle={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => this.handleFlush()}>
              <View style={styles.toiletImageView}>
                <Image
                  source={toiletImage}
                  style={styles.toiletImage}
                />
              </View>
          </TouchableOpacity>
          </Card>
        </View>
      );
    }

    return (
      <View>
        <Card title='Update'>
          <TouchableOpacity onPress={() => this.handleUpdate()}>
            <View style={styles.toiletImageView}>
              <Image
                source={toiletImage}
                style={styles.toiletImage}
              />
            </View>
          </TouchableOpacity>
        </Card>

        <Card containerStyle={{ marginBottom: 20 }}>
          <Button
            title='Delete'
            onPress={() => this.setState({ showModal: !this.state.showModal })}
            raised
            backgroundColor='red'
          />
        </Card>
      </View>

    );
  }

  updateByUID = () => {
    const { inputUID, currentPooName, datetime, description, location, myPoos } = this.props;

    return myPoos.map(poo => {
      console.log(`poo.inputUID: ${poo.inputUID}`);
      console.log(`inputUID: ${inputUID}`);
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

  deleteByUID = () => {
    const { inputUID, myPoos } = this.props;

    return myPoos.filter(poo => {
      return poo.inputUID !== inputUID;
    });
  }

  handleDelete = () => {
    const newPoos = this.deleteByUID();

    this.props.editPoos(newPoos);
    this.props.resetInput();
    this.props.navigation.goBack();
  }

  handleFlush = () => {
    const { uid, currentPooName, datetime, description, location } = this.props;

    this.props.addPoo({ inputUID: uid, currentPooName, datetime, description, location });
    this.props.increaseUID();
    this.props.resetInput();
    this.props.navigation.goBack();
  }

  onAccept = () => {
    this.handleDelete();
  }

  onDecline = () => {
    this.setState({ showModal: false });
  }

  render() {
    const pooImage = allNamedPoos[this.props.currentPooName].image;

    console.log("this.props.datetime");
    console.log(this.props.datetime);

    console.log('typeof this.props.datetime');
    console.log(typeof this.props.datetime);

    return (
      <ScrollView contentContainerStyle={styles.containerStyle}>

        <Card>
          <View style={styles.selectCard}>
            <Image
              source={pooImage}
              style={styles.pooSelectImage}
            />

            <View style={styles.selectButtonView}>
              <Button
                title='Select Poomoji'
                onPress={() => this.props.navigation.navigate('select')}
                buttonStyle={styles.selectButton}
                fontSize={20}
              />
            </View>
          </View>

        </Card>

        <Card>
          <View style={styles.datetimeCard}>

            <Text style={styles.datetimeText}>
              {moment(this.props.datetime).format('MMMM Do YYYY, h:mm a')}
            </Text>

            <View style={styles.changeButtonsView}>
              <Button
                title='Change Date'
                onPress={this.showDatePicker}
                fontSize={20}
                buttonStyle={styles.selectButton}
              />
              <Button
                title='Change Time'
                onPress={this.showTimePicker}
                fontSize={20}
                buttonStyle={styles.selectButton}
              />
            </View>

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
          </View>
        </Card>

        <Card title='Description'>
          <TextInput
            multiline
            label='Description'
            placeholder='How did everything go?'
            value={this.props.description}
            onChangeText={text => this.props.updateDescription({ text })}
            style={{ height: 100 }}
          />
        </Card>


        {this.renderMapPreview()}

        {this.renderFlushButton()}

        <Confirm
          visible={this.state.showModal}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
        >
          Are you sure you want to delete this?
        </Confirm>

      </ScrollView>
    );
  }
}

const mapStateToProps = state => {
  const { inputType, inputUID, currentPooName, description, datetime, location } = state.input;
  const { uid, myPoos } = state.pooReducer;
  return {
    inputType,
    uid,
    inputUID,
    currentPooName,
    description,
    datetime,
    location,
    myPoos
   };
};

export default connect(mapStateToProps, {
  increaseUID,
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  editPoos,
  resetInput
})(InputScreen);
