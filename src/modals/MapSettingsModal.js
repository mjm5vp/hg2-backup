import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
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
    const { settingsModalView, settingsModalViewBig } = styles;
    const modalSize = this.props.locationOn ? settingsModalView : settingsModalViewBig;

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
        <View style={modalSize}>
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
                <Image
                  style={styles.typeImage}
                  source={{ uri: 'https://i.imgur.com/UntHqiN.png' }}
                />
              </TouchableOpacity>
              <Text>Default</Text>
            </View>
            <View style={styles.typeSelect}>
              <TouchableOpacity onPress={() => this.props.setMapType('hybrid')}>
                <Image
                  style={styles.typeImage}
                  source={{ uri: 'https://i.imgur.com/dXW7vDt.jpg' }}
                />
              </TouchableOpacity>
              <Text>Satellite</Text>
            </View>
            <View style={styles.typeSelect}>
              <TouchableOpacity onPress={() => this.props.setMapType('terrain')}>
                <Image
                  style={styles.typeImage}
                  source={{ uri: 'https://i.imgur.com/BFRgcPm.png' }}
                />
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
