import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView, StyleSheet,
  Text,
  View
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { cross, sortarrow } from '../../../Theme/globalImages';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../../../Redux/Slices/Jobslice';
import Jobcardmini from '../../../Components/Jobcardmini';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import JobFilterModal from '../../../Components/JobFilterModal';
import AppBar from '../../../Components/AppBar';
import UserSearchBar from '../../../Components/UserSearchBar';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Jobs({route}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const [applyFilter , setApplyFilter] = useState(false)
  const jobData = useSelector(state => applyFilter? state.jobs.FilteredJobs : state.jobs.jobData );
  const loading = useSelector(state => state.jobs.loading);
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const jobFilterModalRef = useRef(null);

 // autofocus from home
  useEffect(() => {
    if (route.params && route.params.autoFocusSearch) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [route.params]);

  // job filteration based on searchquery
  const handleSearch = text => {
    setSearchQuery(text);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobs(jobData);
    } else {
      const filteredData = jobData?.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  job?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()),

      );
      setFilteredJobs(filteredData);
    }
  }, [searchQuery, jobData]);

  useEffect(() => {
    dispatch(fetchJobData());
  }, [dispatch]);

  // Screen if api fail to load
  const error = useSelector(state => state.jobs.error);

  if (error) {
    return <NoData refresh={() => dispatch(fetchJobData())} />;
  }

  const clearFilters = () => {
    setApplyFilter(false);
    if (jobFilterModalRef.current) {
      jobFilterModalRef.current.clearFilters();
    }
  };

  const onRefresh = ()=>{
    dispatch(fetchJobData());
  }

  // jobs screen
  return (
    <View style={styles.container}>
      <AppBar navtitle={t('Job List')} />
      <JobFilterModal
        ref={jobFilterModalRef}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        setApplyFilter={setApplyFilter}
      />
      {/* <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}> */}
        <UserSearchBar
          handleSearch={handleSearch}
          searchInputRef={searchInputRef}
          placeholder={t('searchPlaceholderjobs')}
          visible={() => setModalVisible(true)}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: '5%',
            marginTop: w(-4),
          }}>
          <Text
            style={{
              fontSize: f(2),
              color: globalColors.black,
              fontFamily: 'BaiJamjuree-Medium',
              textAlign: 'center',
              justifyContent: 'center',
            }}>
            {filteredJobs?.length.toString()} {t('jobs')} {t('found')}
          </Text>
          {applyFilter ?
          <View style={{flexDirection:'row',alignItems:'center',gap:w(1)}}>
          <TouchableOpacity onPress={()=>clearFilters()}>
            <Text style={{
               fontSize: f(1.6), 
               fontFamily: 'BaiJamjuree-Regular',
               color:globalColors.darkblack
            }}>Remove filter</Text>
          </TouchableOpacity>
          <Image
            resizeMode="contain"
            style={{width: w(2.3)}}
            source={cross}
          />
          </View> : null}
        </View>
        {loading ? (
          <SkeltonLoader />
        ) : (
          <FlatList
            data={filteredJobs}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: h(2)}}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <Jobcardmini navigateto={'JobDetails'} item={item} />
            )}
            ListEmptyComponent={<NoData text={'No Matching Jobs'} />}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} />
            }
          />
        )}
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
});
