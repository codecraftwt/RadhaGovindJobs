import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {LoginImage, Rgjobs} from '../../Theme/globalImages';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {h, w, f} from 'walstar-rn-responsive';
import {globalColors} from '../../Theme/globalColors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {login} from '../../Redux/Slices/authslice';
import {useDispatch, useSelector} from 'react-redux';
import {getPermission} from '../../Redux/Slices/Permissionslice';
import LanguageModal from '../../Components/LanguageModal';

export default function Login() {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useSelector(state => state.auth.isLoading);
  const isLoadingpermission = useSelector(state => state.Permissions.isLoading);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const dispatch = useDispatch();

  // toast function
  const showToast = () => {
    Toast.show({
      text1: 'Logged in Successfully',
      position: 'bottom',
    });
  };

  const validateForm = () => {
    if (!email.trim() && !password.trim()) {
      setEmailError(t('email_required'));
      setPasswordError(t('password_required'));
      return false;
    } else if (!email.trim()) {
      setEmailError(t('email_required'));
      return false;
    } else if (!password.trim()) {
      setPasswordError(t('password_required'));
      return false;
    } else if (password.length < 4) {
      setPasswordError(t('password_length'));
      return false;
    }
    return true;
  };

  // role-based navigation
  const roleNavigation = payload => {
    if (payload.data) {
      dispatch(getPermission(payload.data.id))
        .then(() => {
          navigation.replace('DynamicDrawer');
          showToast();
        })
        .catch(() => {
          Toast.show({
            text1: `Check Your Connection and Try again`,
            type: 'error',
            position: 'bottom',
          });
        });
    }
  };

  // login authentication
  const handleLogin = () => {
    if (!validateForm()) return;
    dispatch(login({email, password}))
      .then(action => {
        const {payload} = action;
        if (payload) {
          roleNavigation(payload);
        } else {
          Toast.show({
            text1: 'Invalid Username or Password',
            type: 'error',
            position: 'bottom',
          });
        }
      })
      .catch(() => {
        Toast.show({
          text1: `Check Your Connection and Try again`,
          type: 'error',
          position: 'bottom',
        });
      });
  };

  useEffect(() => {
    if (email.trim()) {
      setEmailError(null);
    }
    if (password.trim().length > 3) {
      setPasswordError(null);
    }
  }, [email, password]);

  //login screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={globalColors.backgroundshade}
        barStyle={'dark-content'}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LanguageModal
          setvisible={setShowLanguageModal}
          isVisible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
        <TouchableOpacity
          style={{
            zIndex: 10,
            position: 'absolute',
            right: '3%',
            top: '8%',
            borderWidth: w(0.4),
            borderColor: globalColors.mauve,
            borderRadius: w(2),
          }}
          onPress={() => setShowLanguageModal(true)}>
          <Text
            style={{
              color: globalColors.mauve,
              paddingHorizontal: h(0.5),
              fontSize: f(1.5),
              fontFamily: 'BaiJamjuree-SemiBold',
            }}>
            {t('Language')}
          </Text>
        </TouchableOpacity>
        <View style={styles.loginimg}>
          <Image
            resizeMode="contain"
            style={styles.bannerimg}
            source={Rgjobs}
          />
        </View>
        <View style={{gap: w(-4)}}>
          <Text style={[styles.loginmaintxt]}>{t('find_perfect_job')}</Text>
          <Text style={[styles.loginmaintxt]}>{t('find_perfect_job2')}</Text>
        </View>
        <View style={{position: 'relative'}}>
          <TextInput
            style={styles.simpletextcontainer}
            placeholder={emailError ? null : t('email_username')}
            placeholderTextColor={globalColors.mauve}
            value={email}
            onChangeText={text => {
              setEmail(text);
            }}
          />
          {emailError && (
            <LinearGradient
              colors={[globalColors.backgroundshade, globalColors.lavender]}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.errorrgradient}>
              <Text style={styles.errorText}>{emailError}</Text>
            </LinearGradient>
          )}
        </View>
        <View style={{position: 'relative'}}>
          <TextInput
            style={[styles.simpletextcontainer, {marginTop: h(1.7)}]}
            placeholder={passwordError ? null : t('password')}
            placeholderTextColor={globalColors.mauve}
            value={password}
            secureTextEntry={!showPassword}
            onChangeText={text => {
              setPassword(text);
            }}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye' : 'eye-off'}
              size={w(5.5)}
              color={globalColors.mauve}
            />
          </TouchableOpacity>
          {passwordError && (
            <LinearGradient
              colors={[globalColors.backgroundshade, globalColors.lavender]}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={[styles.errorrgradient, {marginTop: h(0.2)}]}>
              <Text style={styles.errorText}>{passwordError}</Text>
            </LinearGradient>
          )}
        </View>
        <View style={styles.btnmaincontainer}>
          <TouchableOpacity
            style={styles.loginbtncontainer}
            onPress={handleLogin}>
            <LinearGradient
              colors={[
                globalColors.purplegradient1,
                globalColors.purplegradient2,
                globalColors.purplegradient3,
                globalColors.purplegradient4,
              ]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradient}>
              {isLoading || isLoadingpermission ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.loginText}>{t('login')}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.forgotcontainer}>
            <Text style={styles.ForgotText}>{t('forgot_password')}</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
  loginimg: {
    marginTop: h(2),
    alignItems: 'center',
  },

  loginmaintxt: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(3.8),
    color: globalColors.black,
    textAlign: 'center',
    // height:h(7)
  },
  eyeIcon: {
    position: 'absolute',
    top: '40%',
    right: '13%',
  },

  simpletextcontainer: {
    marginHorizontal: '10%',
    backgroundColor: globalColors.lavender,
    fontSize: f(1.9),
    marginTop: h(1),
    borderColor: globalColors.lightpink,
    fontFamily: 'BaiJamjuree-SemiBold',
    borderWidth: 2,
    paddingLeft: w(5),
    height: h(7),
    color: globalColors.black,
  },
  errorText: {
    color: globalColors.red,
    fontSize: f(1.5),
    fontFamily: 'BaiJamjuree-Regular',
  },
  errorrgradient: {
    marginLeft: '14%',
    marginTop: '-1.15%',
    position: 'absolute',
    paddingHorizontal: '2%',
  },

  btnmaincontainer: {
    alignItems: 'center',
    marginHorizontal: '10%',
    marginTop: h(2.5),
  },
  loginbtncontainer: {
    width: '100%',
    borderRadius: h(0.8),
  },
  gradient: {
    flex: 1,
    borderRadius: h(0.8),
    paddingVertical: h(1),
    paddingHorizontal: w(1.9),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: globalColors.white,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  bannerimg: {
    width: h(36),
    height: h(36),
  },

  ForgotText: {
    fontSize: f(2.1),
    color: globalColors.mulberry,
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  forgotcontainer: {
    marginVertical: h(2),
  },
});
