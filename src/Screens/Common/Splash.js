import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect} from 'react';
import {vector1, vector2, AppLogo, Rgjobs} from '../../Theme/globalImages';
import {globalColors} from '../../Theme/globalColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getPermission} from '../../Redux/Slices/Permissionslice';
import Toast from 'react-native-toast-message';

export default function Splash() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const roleNavigation = userData => {
    if (userData) {
      dispatch(getPermission(userData.id)).then(action => {
        if (action.payload) {
          navigation.replace('DynamicDrawer');
        } else {
          Toast.show({
            text1: `Your Session Is Expired Login Again`,
            type: 'error',
            position: 'bottom',
          });
          navigation.replace('Login');
        }
      });
    }
  };

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        const userData = JSON.parse(user);
        roleNavigation(userData);
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.log('Error retrieving data from AsyncStorage:', error);
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  //splash screen
  return (
    <TouchableWithoutFeedback onPress={checkLoginStatus}>
      <SafeAreaView style={styles.maincontainer}>
        <StatusBar backgroundColor={globalColors.darkpurple} />
        <Image style={styles.vector} resizeMode="stretch" source={vector1} />
        <Image style={{width: '80%'}} resizeMode="contain" source={Rgjobs} />
        <Image style={styles.vector} resizeMode="stretch" source={vector2} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  vector: {
    tintColor: globalColors.darkpurple,
    height: '18%',
    width: '100%',
  },
  maincontainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: globalColors.pancypurple,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
