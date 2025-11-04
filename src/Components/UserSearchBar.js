import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, PermissionsAndroid, Platform } from 'react-native';
import { TextInput } from 'react-native';
import { f, h, w } from 'walstar-rn-responsive';
import { useTranslation } from 'react-i18next';
import { globalColors } from '../Theme/globalColors';
import { lens, mic, micgif, searchfilter } from '../Theme/globalImages';
import Voice from '@react-native-voice/voice';
import LottieView from 'lottie-react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const VoiceSearchModal = ({ setvisible, visible, recognizedText, errorMessage }) => (
  <Modal transparent={true} visible={visible}>
    <TouchableOpacity onPress={() => setvisible(false)} style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <LottieView style={styles.lottieView} source={micgif} autoPlay loop />
        <Text style={styles.recognizedText}>{errorMessage || recognizedText || "Listening..."}</Text>
      </View>
    </TouchableOpacity>
  </Modal>
);

const UserSearchBar = ({ visible, placeholder, handleSearch, searchInputRef }) => {
  const { t } = useTranslation();
  const [recognizedText, setRecognizedText] = useState('');
  const [value, setValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangeText = async (text) => {
    await handleSearch(text);
    await setValue(text);
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "This app needs access to your microphone to perform voice recognition.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await request(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  const checkMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      return result;
    } else {
      const result = await check(PERMISSIONS.IOS.MICROPHONE);
      return result === RESULTS.GRANTED;
    }
  };

  const startListening = async () => {
    try {
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        const granted = await requestMicrophonePermission();
        if (!granted) {
          setErrorMessage('Microphone permission denied');
          return;
        }
      }
      const available = await Voice.isAvailable();
      if (available) {
        setErrorMessage('');
        await Voice.start('en-US');
      } else {
        setErrorMessage('Speech recognition service is not available on this device.');
      }
    } catch (error) {
      setErrorMessage('Error starting voice recognition');
      console.log('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      closeModal();
    } catch (error) {
      setErrorMessage('Error stopping voice recognition');
      console.log('Error stopping voice recognition:', error);
    }
  };

  const onSpeechStart = () => {
    setModalVisible(true);
  };

  const onSpeechRecognized = () => {
  };

  const onSpeechError = async (e) => {
    if (e.error.code === '7') {
      setErrorMessage('No speech match found. Try again.');
    } else {
      setErrorMessage(`Error: ${e.error.message}`);
    }
  };

  const onSpeechResults = (e) => {
    const recognizedSpeech = e.value[0];
    handleChangeText(recognizedSpeech);
  };

  const onSpeechPartialResults = e => {
    const partialResults = e.value[0];
    setRecognizedText(partialResults);
  };

  const closeModal = () => {
    setModalVisible(false);
    setRecognizedText('');
    setErrorMessage('');
  };

  const initiateListener = async () => {
    Voice.destroy().then(Voice.removeAllListeners);
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = stopListening;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    startListening();
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.searchbarcontainer}>
        <TextInput
          style={styles.textInput}
          ref={searchInputRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={globalColors.Wisteria}
          onChangeText={text => handleChangeText(text)}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Image resizeMode="contain" style={styles.iconImage} source={lens} />
        </TouchableOpacity>
      </View>
      {visible ? (
        <TouchableOpacity style={styles.filtercontainer} onPress={visible}>
          <Image resizeMode="contain" style={styles.iconImage} source={searchfilter} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.filtercontainer} onPress={initiateListener}>
          {/* <TouchableOpacity style={styles.filtercontainer} onPress={()=>{}}> */}
          <Image resizeMode="contain" style={styles.iconImageMic} source={mic} />
        </TouchableOpacity>
      )}
      <VoiceSearchModal setvisible={setModalVisible} visible={modalVisible} recognizedText={recognizedText} errorMessage={errorMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '77%',
    height: w(11),
    backgroundColor: globalColors.white,
    paddingStart: w(2),
    marginStart: '5%',
    marginEnd: '2%',
    marginVertical: h(3),
    borderColor: globalColors.lightgrey,
    borderWidth: 1,
    borderRadius: h(2),
  },
  textInput: {
    width: '85%',
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.black,
    paddingVertical: h(1),
  },
  searchIcon: {
    width: '12%',
    paddingStart: '3%',
  },
  filtercontainer: {
    borderRadius: h(2),
    width: '10.5%',
    height: w(11),
    backgroundColor: globalColors.purplegradient1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: w(5),
    borderTopLeftRadius: w(5),
    borderTopRightRadius: w(5),
    alignItems: 'center',
  },
  recognizedText: {
    fontSize: f(2.7),
    marginBottom: h(2),
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  iconImage: {
    width: w(5),
    height: w(5),
  },
  iconImageMic: {
    width: w(6.5),
    height: w(6.5),
  },
  lottieView: {
    height: w(30),
    width: w(30),
  },
});

export default UserSearchBar;
