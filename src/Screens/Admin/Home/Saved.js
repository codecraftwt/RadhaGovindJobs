import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import JobCard from '../../../Components/JobCard';
import NoData from '../../Common/Nodata';
import AppBar from '../../../Components/AppBar';
import { savedJobsData } from '../../../Redux/Slices/Jobslice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Saved = ({ route }) => {
  const showappbar = route.params ? route.params.showappbar : false
  const { t } = useTranslation();
  const InitialSavedJobs = useSelector(state => state?.jobs?.SavedJobs);
  const Jobs = useSelector(state => state?.jobs?.jobData);
  const navigation = useNavigation();

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
  
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      dispatch(savedJobsData(user.id));
    }
  }, [user, dispatch])


  // const SavedJobs = Jobs.filter(job => InitialSavedJobs.includes(job.id))

    const SavedJobs = Jobs.filter(job => 
      InitialSavedJobs?.some(saved => saved.id === job.id)
    ).map(job => {
      const saved = InitialSavedJobs?.find(saved => saved.id === job.id);
      return {
        ...job, // keep all job details
        applied_status: saved?.is_applied // add applied status
      };
    });


  const [refresh, setRefresh ] = useState(false)

  const onRefresh = ()=>{
    setRefresh(true)
    dispatch(savedJobsData(user.id))
    setRefresh(false)
  }

  //no saved jobs screen
  if (SavedJobs.length === 0) {
    return (
      <>
        {showappbar ? <AppBar navtitle={'Saved Jobs'} /> : null}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: globalColors.backgroundshade,
          }}>
          <NoData text={'No saved Jobs'} />
        </View>
      </>
    );
  }

  //saved screen
  return (
    <View style={styles.container}>
      {showappbar ? <AppBar navtitle={'Saved Jobs'} /> : null}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: showappbar ? w(3) : 0 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        {/* {(showappbar ? SavedJobs : SavedJobs.slice(0, 2)).map((job) => (
          <JobCard
            goback={showappbar ? 'SavedJobs' : null}
            params={{ showappbar: true }}
            key={job.id}
            item={job}
          />
        ))} */}
        {(showappbar ? SavedJobs : SavedJobs.slice(0, 2)).map((job) => (
          <JobCard
            goback={showappbar ? 'SavedJobs' : null}
            params={{ showappbar: true }}
            key={job.id}
            item={job}
            onApplied={() => dispatch(savedJobsData(user.id))}  
          />
        ))}
      </ScrollView>
      {showappbar ? null :
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.viewall} onPress={() => navigation.navigate('Jobs')}>
            <Text style={styles.viewalltxt}>{t('View All')}</Text>
          </TouchableOpacity>
        </View>}
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    flex: 1
  },
  viewall: {
    marginVertical: h(3.5),
    paddingHorizontal: w(10),
    paddingVertical: h(0.5),
    borderWidth: w(0.3),
    borderColor: globalColors.commonpink,
    borderRadius: w(1.5),
  },

  viewalltxt: {
    fontSize: f(1.9),
    color: globalColors.commonpink,
    fontFamily: 'BaiJamjuree-SemiBold',
  },
});
