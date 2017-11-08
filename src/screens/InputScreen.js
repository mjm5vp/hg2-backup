import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import allNamedPoos from '../../assets/namedPooExport';
import {
  increaseUID,
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  resetInput } from '../actions';


class InputScreen extends Component {
  state = {
    date: moment(),
    time: moment(),
    isDatePickerVisible: false,
    isTimePickerVisible: false,
    description: '',
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
      console.log("region: ")
      console.log(region)

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
          <Text style={{ width: 200 }}>Location Not Set</Text>
        </View>

        <Button
          title='Add to Map'
          onPress={() => this.props.navigation.navigate('map_select')}
        />
      </Card>
    );
  }

  handleFlush = () => {
    const { uid, currentPooName, datetime, description, location } = this.props;

    this.props.addPoo({ inputUID: uid, currentPooName, datetime, description, location });
    this.props.increaseUID();
    this.props.resetInput();
    this.props.navigation.goBack();
  }

  render() {
    const pooImage = allNamedPoos[this.props.currentPooName].image;

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
              {this.props.datetime.format('MMMM Do YYYY, h:mm a')}
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
            label='Description'
            placeholder='How did everything go?'
            value={this.props.description}
            onChangeText={text => this.props.updateDescription({ text })}
          />
        </Card>


        {this.renderMapPreview()}

        <Button
          title='Flush'
          onPress={() => this.handleFlush()}
        />

      </ScrollView>
    );
  }
}

const styles = {
  containerStyle: {
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  emptyMapView: {
    // flex: 1,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  selectCard: {
    alignItems: 'center'
  },
  pooSelectImage: {

  },
  selectButton: {
    height: 20,
    borderRadius: 5,
    backgroundColor: 'rgba(0,150,136,0.5)',
  },
  datetimeCard: {
    alignItems: 'center'
  },
  datetimeText: {
    fontSize: 20
  },
  changeButtonsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10
  }
};

const mapStateToProps = state => {
  const { currentPooName, description, datetime, location } = state.input;
  const { uid } = state.pooReducer;
  return {
    uid,
    currentPooName,
    description,
    datetime,
    location
   };
};

export default connect(mapStateToProps, {
  increaseUID,
  selectPoo,
  updateDescription,
  updateDateTime,
  addPoo,
  resetInput
})(InputScreen);
