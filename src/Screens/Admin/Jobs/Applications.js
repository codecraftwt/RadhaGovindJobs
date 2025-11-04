import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AppBar from '../../../Components/AppBar';
import ApplicantCard from '../../../Components/ApplicantCard';
import SearchBarNoFilter from '../../../Components/SearchBarNoFilter';
import { fetchApplications } from '../../../Redux/Slices/Applicationslice';

export default function Applications({route}) {
  const JobId =  route.params ? route.params.JobId : null
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const candidates = useSelector(state => state.Applications.Applications);
  const loading = useSelector(state => state.Applications.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [lastfilteredCandidates, setLastFilteredCandidates] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState('Review');


  //filteration via query
  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(()=>{
    if(JobId != null){
      dispatch(fetchApplications(JobId))
    }
  },[JobId])

  const handleOptionPress = option => {
    setSelectedOptions(option)
  };

  useEffect(()=>{
    const filteredData = candidates?.filter(candidate => candidate.interview_status.toLowerCase() == selectedOptions.toLowerCase())
    setFilteredCandidates(filteredData)
  },[selectedOptions , candidates ])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setLastFilteredCandidates(filteredCandidates);
    } else {
      const filteredSearchData = filteredCandidates?.filter(candidate => {
        const firstName = candidate?.candidate?.[0]?.fname?.toLowerCase() || '';
        const lastName = candidate?.candidate?.[0]?.lname?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`;
        return fullName.includes(searchQuery.toLowerCase());
      });
      setLastFilteredCandidates(filteredSearchData);
    }
  }, [searchQuery, filteredCandidates]);

  
  //failed to load api screen
  const error = useSelector(state => state.Applications.error);

  if (error) {
    return (
    <>
       <AppBar backto={'JobListMnt'} showBack={true} navtitle={t('Applicants List')} />
       <NoData refresh={() => dispatch(fetchApplications(JobId))} />
    </>
  );
  }

  //candidate screen
  return (
    <View style={styles.container}>
      <AppBar backto={'JobListMnt'} showBack={true} navtitle={t('Applicants List')} />
      {/* <ScrollView
        contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}> */}
        <SearchBarNoFilter
          handleSearch={handleSearch}
          placeholder={t('Search For applicants')}
        />
        <View style={styles.filter}>
            {['Review', 'Shortlisted', 'Selected', 'Rejected'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  selectedOptions === option && styles.highlightedOption,
                ]}
                onPress={() => handleOptionPress(option)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions === option && styles.highlightedOptionText,
                  ]}>
                  {t(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        {loading ? (
           <SkeltonLoader/>
        ) : (
          <FlatList
            data={lastfilteredCandidates}
            renderItem={({item}) => <ApplicantCard item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingBottom: h(2)}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoData text={'No Matching Candidates'} />}refreshControl={
              <RefreshControl onRefresh={()=>dispatch(fetchApplications(JobId)) } />
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
  filter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: h(1),
    marginHorizontal:w(5),
    marginBottom:w(3)
  },
  option: {
    paddingVertical: h(0.7),
    width: '23%',
    borderRadius:w(5),
    backgroundColor: globalColors.white,
    borderWidth:w(0.1),
    borderColor:globalColors.grey,
  },
  highlightedOption: {
    backgroundColor: globalColors.activepink,
    color: globalColors.white,
    borderRadius:w(5)
  },
  optionText: {
    fontSize: f(1.5),
    color: globalColors.grey,
    fontFamily: 'BaiJamjuree-SemiBold',
    textAlign:'center'
  },
  highlightedOptionText: {
    color: globalColors.white,
    textAlign:'center'
  },
});
