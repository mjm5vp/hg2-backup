const styles = {
  containerStyle: {
    flex: 1,
  },
  mapViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  markerContainer: {
    height: 50,
    width: 50,
    position: 'absolute'
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  topButtonContainer: {
    width: '100%',
    flex: 1,
    position: 'absolute',
    top: 20,
    alignItems: 'center'
  },
  topButtonStyle: {
    margin: 20
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    width: '80%'
  },
  buttonStyle: {
    flex: 1
  },
  //Settings
  settingsButton: {
    borderRadius: 50,
    height: 50,
    width: 50,
    backgroundColor: 'white',
    position: 'absolute',
    top: 10,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  settingsModalView: {
    backgroundColor: 'white',
    width: '100%',
    height: 200,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  typeImagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10
  },
  typeSelect: {
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeImage: {
    height: 61.8034,
    width: 100,
    borderColor: 'blue',
    borderWidth: 1,
    marginBottom: 10
  }
};

export default styles;
