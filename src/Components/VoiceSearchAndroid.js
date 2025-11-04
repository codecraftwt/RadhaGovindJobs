/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  StatusBar, 
  StyleSheet, 
  useColorScheme, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Voice from '@react-native-voice/voice';

function VoiceSearchAndroid() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [recognitionTimeout, setRecognitionTimeout] = useState(null);
  const isHandlingError = useRef(false);

  useEffect(() => {
    // Check permissions on app start
    checkPermissions();
    
    // Initialize Voice
    initializeVoiceRecognition();
    
    // Set up voice recognition listeners
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      // Clear any pending timeout
      if (recognitionTimeout) {
        clearTimeout(recognitionTimeout);
      }
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const initializeVoiceRecognition = async () => {
    try {
      
      if (!Voice || typeof Voice.isAvailable !== 'function') {
        console.log('Voice module not properly loaded');
        setIsInitialized(false);
        return;
      }
      
      const isAvailable = await Voice.isAvailable();
      
      if (!isAvailable) {
        console.log('Voice recognition not available on this device');
        setIsInitialized(false);
        return;
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.log('Error initializing Voice:', error);
      setIsInitialized(false);
    }
  };

  const onSpeechStart = (e) => {
    setIsRecording(true);
    setIsLoading(true);
    setLastError('');
    isHandlingError.current = false;
    
    const timeout = setTimeout(async () => {
      try {
        if (isRecording && !isHandlingError.current) {
          await Voice.stop();
          setIsRecording(false);
          setIsLoading(false);
          setLastError('Recognition timeout. Please try again.');
        }
      } catch (error) {
        console.log('Error stopping voice recognition on timeout:', error);
        if (isRecording && !isHandlingError.current) {
          setLastError('Recognition timeout. Please try again.');
        }
      }
    }, 10000);
    
    setRecognitionTimeout(timeout);
  };

  const onSpeechRecognized = (e) => {
  };

  const onSpeechEnd = (e) => {
    setIsRecording(false);
    setIsLoading(false);
    
    if (recognitionTimeout) {
      clearTimeout(recognitionTimeout);
      setRecognitionTimeout(null);
    }
  };

  const onSpeechError = (e) => {
    if (isHandlingError.current) {
      return;
    }
    
    isHandlingError.current = true;
    
    // console.error('Voice Recognition Error:', e);
    // console.error('Error details:', JSON.stringify(e, null, 2));
    // console.error('Error message:', e.error?.message);
    // console.error('Error code:', e.error?.code);
    // console.error('Error type:', e.error?.type);
    setIsRecording(false);
    setIsLoading(false);
    
    if (recognitionTimeout) {
      clearTimeout(recognitionTimeout);
      setRecognitionTimeout(null);
    }
    
    let errorMessage = 'Unknown error';
    const errorCode = e.error?.code;
    
    switch (errorCode) {
      case '7/No match':
        errorMessage = 'No speech detected. Please speak clearly and try again.';
        setTimeout(() => {
          handleNoMatchError();
          isHandlingError.current = false;
        }, 100);
        break;
      case '5/Client side error':
        errorMessage = 'Voice recognition was interrupted. Please try again.';
        isHandlingError.current = false;
        break;
      case '6/No speech':
        errorMessage = 'No speech detected. Please speak louder or closer to the microphone.';
        setTimeout(() => {
          handleNoMatchError();
          isHandlingError.current = false;
        }, 100);
        break;
      case '1/Network error':
        errorMessage = 'Network error. Please check your internet connection.';
        isHandlingError.current = false;
        break;
      case '2/Server error':
        errorMessage = 'Server error. Please try again later.';
        isHandlingError.current = false;
        break;
      case '3/Audio error':
        errorMessage = 'Audio error. Please check your microphone.';
        isHandlingError.current = false;
        break;
      case '4/Speech timeout':
        errorMessage = 'Speech timeout. Please try speaking again.';
        isHandlingError.current = false;
        break;
      default:
        errorMessage = e.error?.message || e.error?.code || 'Unknown error';
        isHandlingError.current = false;
    }
    
    setLastError(errorMessage);
    setRetryCount(prev => prev + 1);
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0];
      setTranscribedText(prevText => prevText + (prevText ? ' ' : '') + recognizedText);
      setRetryCount(0);
      setLastError('');
    } else {
      setLastError('No speech detected. Please try speaking louder or closer to the microphone.');
      setRetryCount(prev => prev + 1);
    }
  };

  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        setHasPermission(hasPermission);
      } else {
        setHasPermission(true);
      }
    } catch (error) {
      console.log('Error checking permissions:', error);
      setHasPermission(false);
    }
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (hasPermission) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission Required',
            message: 'This app needs access to your microphone to record voice and convert it to text. Please allow microphone access to continue.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  const startListening = async () => {
    try {
      isHandlingError.current = false;
      
      let hasPermission = false;
      
      if (Platform.OS === 'android') {
        hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      } else {
        hasPermission = true;
      }
      
      if (!hasPermission) {
        const permissionGranted = await requestMicrophonePermission();
        
        if (!permissionGranted) {
          Alert.alert(
            'Permission Denied', 
            'Microphone permission is required for voice recognition. Please enable it in your device settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => {
              }}
            ]
          );
          setHasPermission(false);
          return;
        } else {
          setHasPermission(true);
        }
      }

      if (!Voice || typeof Voice.start !== 'function') {
        Alert.alert('Error', 'Voice recognition module is not properly loaded. Please restart the app.');
        return;
      }

      const isAvailable = await Voice.isAvailable();
      
      if (!isAvailable) {
        Alert.alert('Error', 'Voice recognition is not available on this device');
        return;
      }

      console.warn('Starting Voice recognition...');
      console.warn('Platform:', Platform.OS);
      console.warn('Voice module loaded first :', Voice._loaded);
      
      await Voice.start('hi-IN');
      console.warn('Voice module loaded last :', Voice._loaded);
    } catch (error) {
      console.log('Error starting voice recognition:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', `Failed to start voice recognition: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const requestPermission = async () => {
    const permissionGranted = await requestMicrophonePermission();
    setHasPermission(permissionGranted);
    
    if (!permissionGranted) {
      Alert.alert(
        'Permission Required', 
        'Microphone permission is required for voice recognition. Please grant permission to continue.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: requestPermission }
        ]
      );
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      setIsLoading(false);
    } catch (error) {
      console.log('Error stopping voice recognition:', error);
    }
  };

  const clearText = () => {
    setTranscribedText('');
    setRetryCount(0);
    setLastError('');
  };

  const retryVoiceRecognition = () => {
    setRetryCount(0);
    setLastError('');
    startListening();
  };

  const handleNoMatchError = () => {
    Alert.alert(
      'No Speech Detected',
      'Please try:\n• Speaking louder and clearer\n• Moving closer to the microphone\n• Speaking in a quiet environment\n• Waiting for the microphone icon to appear before speaking',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Try Again', onPress: retryVoiceRecognition }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Voice to Text</Text>
      </View>
      
      <View style={styles.content}>
        <TextInput
          style={styles.textInput}
          placeholder="Tap the microphone to start voice recognition..."
          value={transcribedText}
          onChangeText={setTranscribedText}
          multiline
          textAlignVertical="top"
        />
        
        <View style={styles.buttonContainer}>
          {!hasPermission ? (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <Text style={styles.permissionButtonText}>Grant Microphone Permission</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  isRecording && styles.voiceButtonRecording
                ]}
                onPress={isRecording ? stopListening : startListening}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.voiceButtonText}>
                    {isRecording ? '🛑' : '🎤'}
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearText}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              
              {(retryCount > 0 || lastError) && (
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={retryVoiceRecognition}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        
        <Text style={styles.statusText}>
          {!hasPermission 
            ? 'Microphone permission is required to use voice recognition' 
            : !isInitialized
              ? 'Initializing voice recognition...'
              : isRecording 
                ? 'Listening... Speak clearly into your microphone' 
                : isLoading 
                  ? 'Processing your speech...' 
                  : lastError
                    ? `Error: ${lastError}${retryCount > 0 ? ` (Attempt ${retryCount})` : ''}`
                    : retryCount > 0
                      ? `No speech detected. Try speaking louder or closer to the microphone. (Attempt ${retryCount})`
                      : 'Tap microphone to start voice recognition'
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  voiceButtonRecording: {
    backgroundColor: '#FF3B30',
  },
  voiceButtonText: {
    fontSize: 30,
  },
  clearButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default VoiceSearchAndroid;
