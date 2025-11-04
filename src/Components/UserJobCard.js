import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { saveJob, unsaveJob } from '../Redux/Slices/Jobslice';
import usePermissionCheck from '../Utils/HasPermission';
import { baseurl } from '../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rgjobs } from '../Theme/globalImages';

const UserJobCard = ({ item }) => {
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
  // const isBookmarked = bookmarkedJobs.find(job => job === item.id);
  const isBookmarked = bookmarkedJobs?.some(job => job?.id === item?.id);
  const dispatch = useDispatch()

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      try {
        await dispatch(unsaveJob({ jobId: item.id, userId: user.id }));
      } catch (error) {
        console.log('Failed to unsave job:', error);
      }
    } else {
      try {
        await dispatch(saveJob({ jobId: item.id, userId: user.id }));
      } catch (error) {
        console.log('Failed to save job:', error);
      }
    }
  };

  const hasPermission = usePermissionCheck()
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ width: w(60) }}
          onPress={() => navigation.navigate('JobDetails', { item })}>
          <Text style={styles.jobtitle}>{item.title}</Text>
          <View style={styles.thirdcontainer}>
            <View style={styles.thirdsubcontainer}>
              <Text style={styles.post}><Text style={styles.post}>
                {item.job_category?.category_name.length > 20
                  ? `${item.job_category?.category_name.slice(0, 20)}...`
                  : item.job_category?.category_name}
              </Text></Text>
              <Text style={styles.post}>{item.job_type?.job_type_name}</Text>
            </View>
          </View>
          <View>
            <View style={styles.firstrowcontainer}>
              <Image
                style={styles.cardimage}
                resizeMode="contain"
                source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs}
              />
              <View
                style={styles.titlecontainer}
                onPress={() =>
                  navigation.navigate('JobDetails', {
                    item,
                  })
                }>
                <Text style={styles.companytitle}>{item.user?.name}</Text>
                <View style={styles.locationcontainer}>
                  <Text style={styles.address}>{item.location}</Text>
                </View>
              </View>
              <View style={styles.salarycontainer}>
                <Text
                  style={{
                    fontFamily: 'BaiJamjuree-Bold',
                    color: globalColors.darkblack,
                    fontSize: f(1.6),
                  }}>
                  {item.salary}
                </Text>
                <Text
                  style={{
                    fontFamily: 'BaiJamjuree-Medium',
                    fontSize: f(1.5),
                    color: globalColors.mediumgrey,
                    marginTop: 2,
                  }}>
                  {item.max_salary > 1000
                    ? `${item.max_salary.slice(0, -3)}k/Month`
                    : `${item.max_salary}/Month`}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={{ zIndex: 1, position: 'absolute', right: w(-1), top: w(1) }}>
          {hasPermission('Save Job Mobile') && (
            <TouchableOpacity
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
        </View>
      </View>
    </View>
  );
};

export default UserJobCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    elevation: 7,
    paddingHorizontal: w(4),
    paddingTop: w(3),
    paddingBottom: w(2),
    width: w(68),
    borderRadius: w(4),
    marginHorizontal: w(2.5),
    marginTop: h(2),
    marginBottom: 0,
  },
  firstrowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: w(5),
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
    borderRadius: w(1.6),
  },
  jobtitle: {
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.darkblack,
  },
  companytitle: {
    fontSize: f(1.55),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.darkblack,
  },
  address: {
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
  },
  salarycontainer: {
    flexDirection: 'row',
    marginTop: h(0.7),
    marginStart: w(2),
  },
  post: {
    backgroundColor: globalColors.greishwhite,
    paddingHorizontal: w(2.3),
    paddingVertical: h(0.3),
    borderRadius: w(2),
    color: globalColors.navypurple,
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
  },
});
