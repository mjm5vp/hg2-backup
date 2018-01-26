import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { Icon, Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { setMapType } from '../actions';
import styles from '../styles/mapStyles';

class MapSettingsModal extends Component {

  renderEnableLocationButton = () => {
    if (this.props.locationOn) {
      return null;
    }

    return (
      <View>
        <Button
          title='Turn location services on'
          onPress={() => Linking.openURL('app-settings:')}
          buttonStyle={styles.enableLocationButton}
        />
      </View>
    );
  }

  render() {
    return (
      <Modal
        isVisible={this.props.showSettings}
        backdropColor={'black'}
        backdropOpacity={0.5}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        animationInTiming={250}
        animationOutTiming={250}
        backdropTransitionInTiming={250}
        backdropTransitionOutTiming={250}
        onBackdropPress={this.props.closeSettings}
        style={styles.settingsModal}
        swipeDirection='down'
      >
        <View style={styles.settingsModalView}>
          <View style={styles.modalHeader}>
            <Text>Map type</Text>
            <Icon
              name='close'
              type='material-community'
              onPress={this.props.closeSettings}
            />
          </View>
          <View style={styles.typeImagesRow}>
            <View style={styles.typeSelect}>
              <TouchableOpacity onPress={() => this.props.setMapType('standard')}>
                <View style={styles.typeImage}>

                </View>
              </TouchableOpacity>
              <Text>Default</Text>
            </View>
            <View style={styles.typeSelect}>
              <TouchableOpacity onPress={() => this.props.setMapType('hybrid')}>
                <View style={styles.typeImage}>

                </View>
              </TouchableOpacity>
              <Text>Satellite</Text>
            </View>
            <View style={styles.typeSelect}>
              <TouchableOpacity onPress={() => this.props.setMapType('terrain')}>
                <View style={styles.typeImage}>

                </View>
              </TouchableOpacity>
              <Text>Terrain</Text>
            </View>
          </View>

          {this.renderEnableLocationButton()}

        </View>
      </Modal>
    );
  }
}

export default connect(null, { setMapType })(MapSettingsModal);
