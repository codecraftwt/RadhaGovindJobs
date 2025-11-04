import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback,useState } from 'react';
import { jobsdemo, locationpng, Rgjobs, suitcase, wallet } from '../Theme/globalImages';
import {
  f,
  h,
  w,
} from 'walstar-rn-responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { saveJob, unsaveJob } from '../Redux/Slices/Jobslice';
import usePermissionCheck from '../Utils/HasPermission';
import { baseurl } from '../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Jobcardmini({item }) {

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
  const isBookmarked = bookmarkedJobs?.some(job => job.id === item.id);
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

  const hasPermission= usePermissionCheck()
  const navigation = useNavigation()

  return (
    <View style={styles.MainContainer}>
      <View>
        <Image resizeMode="contain" style={styles.Logo}   source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs} />
      </View>
      <TouchableOpacity style={styles.Information} onPress={()=>navigation.navigate(`JobDetails`,{item})}>
        <View >
          <Text style={styles.Text1}>{item.user?.name}</Text>
          <Text style={styles.Text2}>{item.title}</Text>
        </View>
        <View style={styles.SecondRow}>
          <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
          <Text style={styles.Text3}>
            {item.min_experience}-{item.max_experience} Years
          </Text>
          <Image resizeMode="contain" style={styles.Logo1} source={wallet} />
          <Text style={styles.Text4}>{item.max_salary > 1000
                    ? `${item.max_salary.slice(0, -3)}k/Month`
                    : `${item.max_salary}/Month`}</Text>
        </View>
        <View style={styles.ThirdRow}>
          <Image
            resizeMode="contain"
            style={{
              marginRight: w(1.5),
              width: w(2.6),
              height: w(2.6),
            }}
            source={locationpng}
          />
          <Text style={styles.Text3}>{item.location}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.End}>
        <View>
          {hasPermission('Save Job Mobile') && (

          <TouchableOpacity onPress={handleBookmarkToggle}>
          {isBookmarked ? (
            <MaterialCommunityIcons
              name="bookmark"
              color={globalColors.navypurple}
              size={f(3.1)}
            />
          ) : (
            <MaterialCommunityIcons
              name="bookmark-outline"
              color={globalColors.navypurple}
              size={f(3.2)}
            />
          )}
          </TouchableOpacity>)}
          {/* <Text style={styles.Text5}>24h</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flexDirection: 'row',
    paddingVertical: w(2),
    paddingHorizontal: w(1),
    backgroundColor: globalColors.white,
    marginTop: w(1),
    marginHorizontal: '5%',
    marginBottom: '1%',
    borderRadius: w(2),
    justifyContent: 'space-between',
    elevation: 4,
  },

  Information: {
    flex: 1,
  },
  SecondRow: {
    flexDirection: 'row',
    marginTop: w(1),
    alignItems: 'center',
    marginTop: w(-1),
  },
  ThirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  End: {
    marginHorizontal: w(2.5),
    marginVertical: w(2.5),
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(1),
    borderColor: globalColors.lightgrey,
    height: w(9),
    width: w(9),
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
    fontSize: f(2.05),
    fontFamily: 'BaiJamjuree-SemiBold',
    marginTop: w(-1.5),
  },
  Text3: {
    marginEnd: w(5),
    color: globalColors.suvagrey,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.45),
  },
  Text4: {
    color: globalColors.suvagrey,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.45),
  },
  Text5: {
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.7),
    fontWeight: '400',
    marginLeft: w(0.5),
  },
  Logo1: {
    marginRight: w(1.5),
    width: w(3.2),
    height:w(3.2)
  },
});
