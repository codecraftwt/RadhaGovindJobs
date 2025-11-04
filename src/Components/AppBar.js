import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, { useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  AppLogo, drawericon,
  Rgjobs
} from '../Theme/globalImages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { h, f, w, sw } from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { DrawerActions,useFocusEffect,useNavigation } from '@react-navigation/native';
import usePermissionCheck from '../Utils/HasPermission';
import { useBackHandler } from '@react-native-community/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../Redux/Slices/authslice';


export default function AppBar({params , backto, navtitle, showBack}) {
  const navigation = useNavigation();
  const hasPermission = usePermissionCheck()
  const notifications = useSelector(state => state.auth.notifications)
  const user = useSelector(state => state.auth.user)

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const dispatch = useDispatch()

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
    }, []) 
  );

  // useBackHandler(() => {
  //   if (backto) {
  //     navigation.navigate(`${backto}`,params ? params : null)
  //     return true
  //   }else{
  //     navigation.goBack()
  //     return true
  //   }
  // })

        useBackHandler(() => {
        if (backto) {
          if (backto === "Home") {
            // Home is inside bottomnavigation (tab)
            navigation.navigate("bottomnavigation", { screen: "Home", params });
          } else {
            // Other cases can be direct
            navigation.navigate(backto, params ? params : undefined);
          }
          return true
        }else{
          if (navigation.canGoBack()) {
            navigation.goBack();
            return true
          }
        }
        return false;
      });


  return (
    <View>
      <LinearGradient
        colors={[
          globalColors.purplemedium1,
          globalColors.purplemedium2,
          globalColors.purplemedium1,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{height: h(4)}}>
        <StatusBar backgroundColor="transparent" translucent />
      </LinearGradient>
      <LinearGradient
        colors={[
          globalColors.purplemedium1,
          globalColors.purplemedium2,
          globalColors.purplemedium1,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.topnavgradient}>
        {showBack ? (
          <TouchableOpacity onPress={() => backto? navigation.navigate(`${backto}`,params ? params : null): navigation.goBack()}>
            <View style={[styles.profileimgcontainer, {paddingStart: w(3)}]}>
              <MaterialCommunityIcons
                name="arrow-left"
                color={globalColors.white}
                size={f(3.2)}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openDrawer}>
            <View style={styles.profileimgcontainer}>
              <Image
                style={styles.profileimg}
                resizeMode="contain"
                source={drawericon}
              />
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.middlecontainer}>
          {navtitle ? (
            <Text
              style={{
                fontSize: f(2.2),
                color: globalColors.white,
                fontFamily: 'BaiJamjuree-SemiBold',
              }}>
              {navtitle}
            </Text>
          ) : (
            <View style={{width: '81%'}}>
              <Image
                resizeMode="contain"
                style={{width: sw(35), alignSelf: 'center'}}
                source={Rgjobs}
              />
            </View>
          )}
        </View>
        {hasPermission('notifications') && (
           <TouchableOpacity
           onPress={() => navigation.navigate('NotificationScreenAdmin')}>
           <View style={styles.topnavnotificationcontainer}>
             <MaterialCommunityIcons
               name="bell-outline"
               color={globalColors.white}
               size={f(2.5)}
             />
             <Text style={styles.notificationcount}>{notifications?.filter(item => item.read_at == null).length}</Text>
           </View>
         </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  profileicondrawer: {
    position: 'absolute',
    top: '60%',
    left: '110%',
    backgroundColor: globalColors.white,
    borderRadius: 50,
  },

  notificationcount: {
    color: globalColors.white,
    backgroundColor: globalColors.black,
    position: 'absolute',
    top: '-20%',
    left: '80%',
    borderRadius: 50,
    fontSize: f(1.2),
    paddingHorizontal: w(1.1),
  },
  topnavgradient: {
    height: h(10),
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomLeftRadius: w(8),
    borderBottomRightRadius: w(8),
    paddingHorizontal: w(2),
    paddingBottom: h(1.2),
  },
 
  middlecontainer: {
    alignItems: 'center',
    marginStart: w(8),
    flex: 1,
    flexDirection: 'row',
  },
  profileimgcontainer: {
    padding: w(4),
    borderRadius: 100,
    position: 'relative',
  },
  profileimg: {
    width: w(4.5),
    height: w(4.5),
  },
  topnavnotificationcontainer: {
    paddingEnd: w(5),
  },
});
