import { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { f, h, w } from 'walstar-rn-responsive';
import { locationpng, Rgjobs, suitcase, wallet } from '../Theme/globalImages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { saveJob, unsaveJob } from '../Redux/Slices/Jobslice';
import usePermissionCheck from '../Utils/HasPermission';
import { baseurl } from '../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const UserJobDetailsCard = ({item}) => {
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
  const isBookmarked = bookmarkedJobs?.find(job => job.id === item?.id);
  // const isBookmarked = bookmarkedJobs?.some(job => job.id === item.id);
  const dispatch = useDispatch()

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      try {
        await dispatch(unsaveJob({ jobId: item?.id, userId:user.id }));
      } catch (error) {
        console.log('Failed to unsave job:', error);
      }
    } else {
      try {
        await dispatch(saveJob({ jobId: item?.id, userId:user.id }));
      } catch (error) {
        console.log('Failed to save job:', error);
      }
    }
  };

  const hasPermission = usePermissionCheck()

  function timeAgo(timestamp) {
    const dateCreated = new Date(timestamp);
    const currentDate = new Date();
    const timeDifference = currentDate - dateCreated;
    
    // Convert time difference from milliseconds to seconds, minutes, hours, or days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return  `${days} d ago`;
    } else if (hours > 0) {
        return `${hours} h ago`;
    } else if (minutes > 0) {
        return `${minutes} m ago`;
    } else {
        return `${seconds} s ago`;
    }
}

  return (
      <View style={styles.jobDetailContainer}>
        <View style={styles.jobDetailsCard}>
        <View style={{flexDirection:'row', alignItems:'center', marginBottom:w(2)}}>
        <Image resizeMode="contain" style={styles.Logo} source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs} />
        <View style={{marginTop:w(1)}}>
          <Text style={styles.Text1}>{item?.user?.name}</Text>
          <Text style={styles.Text2}>{item?.title}</Text>
        </View>
      </View>
      <View style={styles.detailItem}>
            <Image
              resizeMode="contain"
              source={suitcase}
              style={styles.icon}
            />
            <Text style={styles.detailText}>
            {item?.min_experience}-{item?.max_experience} Years Experience as {item?.title}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={locationpng}
            />
            <Text style={styles.detailText}>{item?.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={wallet}
            />
            <Text style={styles.detailText}>{item?.min_salary} - {item?.max_salary} per month</Text>
          </View>
          <View style={styles.horizontalRule} />

          <View style={styles.userDetails}>
            <View style={styles.totalApplicant}>
              <Image resizeMode="contain" source={user} style={styles.icon} />
              <Text style={styles.detailText}>{item?.applied_jobs} applicants</Text>
            </View>
            <View style={styles.postedDetails}>
              <Text style={styles.detailText}>Posted : {timeAgo(item?.created_at)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bookmarkContainer}>
       {hasPermission('Save Job Mobile') &&( 
          <TouchableOpacity onPress={handleBookmarkToggle}>
          {isBookmarked ? (
            <MaterialCommunityIcons
              name="bookmark"
              color={globalColors.navypurple}
              size={f(2.9)}
            />
          ) : (
            <MaterialCommunityIcons
              name="bookmark-outline"
              color={globalColors.navypurple}
              size={f(3)}
            />
          )}
          </TouchableOpacity>)}
          {/* <Text style={{color:globalColors.darkblack,fontSize:f(1.65),fontFamily:'BaiJamjuree-Regular'}}>24h</Text> */}
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  jobDetailContainer: {
    flexDirection: 'row',
    margin: h(2),
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor:globalColors.white,
    elevation:2
  },
  jobDetailsCard: {
    paddingHorizontal: h(1),
    paddingVertical: h(1.5),
    flex: 1,
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(1),
    borderColor: globalColors.lighGray,
    height: w(10),
    width: w(10),
    marginStart: w(3),
    marginEnd: w(4),
    marginTop: w(1.5),
  },
  Text1: {
    color: globalColors.navypurple,
    fontSize: f(1.45),
    fontFamily: 'BaiJamjuree-Regular',
  },
  Text2: {
    color: globalColors.darkblack,
    fontSize: f(2.10),
    fontFamily: 'BaiJamjuree-Bold',
    marginTop: w(-1.5),
  },
 
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1),
    marginHorizontal: h(1),
    fontFamily: 'BaiJamjuree-Medium',
  },
  icon: {
    width: h(1.7),
    height: h(1.7),
    tintColor:globalColors.black
  },
  detailText: {
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.suvagrey,
    fontSize: f(1.53),
    paddingHorizontal: h(1),
  },
  horizontalRule: {
    borderBottomColor: globalColors.suvagrey,
    borderBottomWidth: h(0.1),
    marginVertical: h(0.5),
    marginEnd:w(-6.5)
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h(0.5),
  },
  totalApplicant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: h(14),
    marginLeft: h(1),
  },

  bookmarkContainer: {
    paddingVertical: h(2.4),
    paddingHorizontal: h(2),
  },
});

export default UserJobDetailsCard;
