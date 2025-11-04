import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { w } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { appliedJobs, ownJobs } from '../../../Redux/Slices/Jobslice';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import AppBar from '../../../Components/AppBar';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobStatusCard from '../../../Components/JobStatusCard';
import { useFocusEffect } from '@react-navigation/native';

export default function JobsMnt() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobs.AppliedJobs);
  const loading = useSelector(state => state.jobs.loading);
  const[user ,setUser]=useState(null)


  const fetchuser = async () => {
    const userJson = await AsyncStorage.getItem('user');
    const userData = userJson != null ? JSON.parse(userJson) : null;
    setUser(userData);
    dispatch(appliedJobs(userData.id))
  };

  useFocusEffect(
    useCallback(() => {
      fetchuser();
      return () => {
      };
    }, [])
  );


  // Screen if api fail to load
  const error = useSelector(state => state.jobs.error);

  if (error) {
    return(<>
          <AppBar backto={'Home'}  navtitle={t('Applied Jobs')} />
          <NoData refresh={() => dispatch(appliedJobs(user.id))} />
      </>);
  }

  // jobs screen
  return (
    <View style={styles.container}>
      <AppBar backto={'Home'} navtitle={t('Applied Jobs')} />
        {loading ? (
          <SkeltonLoader />
        ) : (
          <FlatList
            data={jobData}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: 0,paddingTop:w(1)}}
            renderItem={({item}) => (
              <JobStatusCard  item={item} />
            )}
            ListEmptyComponent={<NoData text={'No Matching Jobs'} />}
            refreshControl={
              <RefreshControl onRefresh={()=>dispatch(appliedJobs(user.id))} />
            }
          />
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
});
    