import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { cardimg, Rgjobs } from '../Theme/globalImages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { applyJob, saveJob, unsaveJob } from '../Redux/Slices/Jobslice';
import usePermissionCheck from '../Utils/HasPermission';
import { baseurl } from '../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const JobCard = ({ item , goback ,params, onApplied }) => {
  const [user, setUser] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchuser();
      return () => {
      };
    }, [])
  );
  const fetchuser = async () => {
    const userJson = await AsyncStorage.getItem('user');
    const userData = userJson != null ? JSON.parse(userJson) : null;
    setUser(userData);
  };

  // const dispatch = useDispatch();
  const bookmarkedJobs = useSelector(state => state.jobs.SavedJobs);
// const isBookmarked = bookmarkedJobs.find(job => job=== item.id);
  const isBookmarked = bookmarkedJobs?.some(job => job?.id === item?.id);
  const dispatch = useDispatch()

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      try {
        await dispatch(unsaveJob({ jobId: item.id, userId:user.id }));
      } catch (error) {
        console.log('Failed to unsave job:', error);
      }
    } else {
      try {
        await dispatch(saveJob({ jobId: item.id, userId:user.id }));
      } catch (error) {
        console.log('Failed to save job:', error);
      }
    }
  };

  // const applyJobHandler = async () => {
  //   dispatch(applyJob({ JobId: item.id, userId: user.id }))
  //     .then((action) => {
  //       if (action?.payload?.data?.error ||action.payload?.message || action?.error?.message  ) {
  //         Toast.show({
  //             text1:action?.payload?.data?.error
  //                   || action?.payload?.message 
  //                   || action?.error?.message 
  //                   || "Something went wrong",
  //             position: 'bottom'
  //           });
  //       }
  //     });
  // };

  const applyJobHandler = async () => {
    dispatch(applyJob({ JobId: item.id, userId: user.id }))
      .then((action) => {
        if (action?.payload?.data?.error || action.payload?.message || action?.error?.message) {
          Toast.show({
            text1: action?.payload?.data?.error
              || action?.payload?.message
              || action?.error?.message
              || "Something went wrong",
            position: 'bottom',
            type: 'success'
          });
        } else {
          // ✅ Success → trigger parent refresh
          if (onApplied) {
            onApplied();
          }
        }
      });
  };

  const hasPermission = usePermissionCheck()
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ width: '80%' }}
          onPress={() => navigation.navigate('JobDetails', { item , goback , params})}>
          <View style={styles.firstrowcontainer}>
            <Image
              style={styles.cardimage}
              resizeMode="contain"
              source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs}
            />
            <View style={styles.titlecontainer}>
              <Text style={styles.jobtitle}>{item.title}</Text>
              <View style={styles.locationcontainer}>
                <Text style={styles.companytitle}>{item.user?.name}</Text>
                <Text style={styles.address}>{item.location}</Text>
              </View>
            </View>
            {/*  */}
          </View>
          <View style={styles.salarycontainer}>
            <Text
              style={{
                fontFamily: 'BaiJamjuree-Bold',
                color: globalColors.darkblack,
                fontSize: f(1.6),
              }}>
              {item.max_salary > 1000
                ? `${item.max_salary.slice(0, -3)}k`
                : `${item.max_salary}`}{' '}
            </Text>
            <Text
              style={{
                fontFamily: 'BaiJamjuree-Medium',
                fontSize: f(1.5),
                color: globalColors.mediumgrey,
                marginTop: 2,
              }}>
              /MO
            </Text>
          </View>
          <View style={styles.thirdcontainer}>
            <View style={styles.thirdsubcontainer}>
              <Text style={styles.post}>{item.job_category?.category_name}</Text>
              <Text style={styles.post}>{item.job_type?.job_type_name}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{ justifyContent: 'space-between' }}>
          {hasPermission('Save Job Mobile') && (<TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={handleBookmarkToggle}>
            {isBookmarked ? (
              <MaterialCommunityIcons
                name="bookmark"
                color={globalColors.navypurple}
                size={f(3)}
              />
            ) : (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={globalColors.navypurple}
                size={f(3)}
              />
            )}
          </TouchableOpacity>)}
          {hasPermission('Apply Job Mobile') && (
            <TouchableOpacity onPress={applyJobHandler}>
              <Text style={styles.apply}>{item.applied_status ? 'Applied' : 'Apply'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    elevation: 7,
    paddingHorizontal: w(4),
    paddingVertical: h(2),
    width: '90%',
    borderRadius: w(4),
    marginHorizontal: '5%',
    marginTop: h(1.5),
    marginBottom: 0,
  },
  firstrowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thirdcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h(0.8),
  },
  thirdsubcontainer: {
    flexDirection: 'row',
    gap: 10,
  },

  titlecontainer: {
    flex: 1,
    width: w(65),
    paddingLeft: w(3),
    marginTop: h(-0.3),
  },
  locationcontainer: {
    flexDirection: 'row',
    gap: w(1.5),
    marginTop: h(-0.6),
  },
  cardimage: {
    height: w(9.5),
    width: w(9.5),
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
  address: {
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
  },
  salarycontainer: {
    flexDirection: 'row',
    marginTop: h(0.7),
    marginStart: '2%',
  },
  post: {
    backgroundColor: globalColors.greishwhite,
    paddingHorizontal: w(2.3),
    paddingVertical: h(0.3),
    borderRadius: w(2),
    color: globalColors.navypurple,
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Medium',
  },
  apply: {
    backgroundColor: globalColors.candy,
    paddingHorizontal: w(3.5),
    paddingVertical: h(0.3),
    color: globalColors.navypurple,
    borderRadius: w(2),
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Medium',
  },
});
