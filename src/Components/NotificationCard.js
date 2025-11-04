import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { jobsdemo } from '../Theme/globalImages';
import { f, w, h } from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import instance from '../Utils/AxiosInstance';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '../Redux/Slices/authslice';

const NotificationCard = ({data}) => {

  const dispatch = useDispatch()

  const notificationRead = async() =>{
    try {
      const response = await instance.get(`api/seen/notification/${data.id}`)
      dispatch(fetchNotifications())
      return response.data
    } catch (error) {
      throw error
    }
  }



  return (
    <Pressable onPress={notificationRead} style={styles.container}>
      <View style={styles.firstrowcontainer}>
        {/* <Image
          style={styles.cardimage}
          resizeMode="contain"
          source={jobsdemo}
        /> */}
        <View style={styles.titlecontainer}>
          {/* <Text style={styles.jobtitle}>{data.companyName}</Text> */}
          <View style={styles.locationcontainer}>
            <Text
              style={[
                styles.companytitle,
                {fontSize: f(1.6), fontFamily: 'BaiJamjuree-SemiBold'},
              ]}>
              {data.data}
            </Text>
          </View>
          {/* <Text style={[styles.companytitle, {width: '95%',textAlign:'justify'}]}>
            {data.notificationDescription.slice(0, 90)}...
          </Text> */}
        </View>
      </View>
      {!data.read_at ? <View style={{position:"absolute",right:10,top:-15}} >
        <Text
          style={{
            color: globalColors.darkblack,
            fontSize: f(4),
            fontFamily: 'BaiJamjuree-Medium',
          }}>
          .
        </Text>
      </View> : null}
    </Pressable>
  );
};

export default NotificationCard;

const styles = StyleSheet.create({
  firstrowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationcontainer: {
    flexDirection: 'row',
    gap: w(1.5),
    marginTop: h(-0.6),
  },
  cardimage: {
    height: w(9.5),
    width: w(9.5),
    borderWidth: 1,
    borderRadius: w(1),
    borderColor: globalColors.lightgrey,
    marginTop: w(0.5),
  },
  jobtitle: {
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.darkblack,
  },
  companytitle: {
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
  },
  titlecontainer: {
    flex: 1,
    width: w(65),
    paddingLeft: w(3),
    marginTop: h(-0.3),
  },
  container: {
    backgroundColor: globalColors.white,
    marginHorizontal: '5%',
    marginVertical: h(1),
    elevation: 4,
    paddingHorizontal: w(3),
    paddingVertical: w(3),
    borderRadius: w(3),
  },
});
