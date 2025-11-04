import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet, View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { h } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidates } from '../../../Redux/Slices/Candidateslice';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AppBar from '../../../Components/AppBar';
import { useNavigation } from '@react-navigation/native';
import Candidatecard from '../../../Components/Candidatecard';
import UserSearchBar from '../../../Components/UserSearchBar';

export default function InstituteCandidate() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const candidates = useSelector(state => state.candidates.candidates);
  const loading = useSelector(state => state.candidates.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  
  const navigation = useNavigation()

  //filteration via query
  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCandidates(candidates);
    } else {
      const filteredData = filteredCandidates?.filter(candidate => {
        const firstName = candidate?.fname?.toLowerCase() || '';
        const lastName = candidate?.lname?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`;
        return fullName.includes(searchQuery.toLowerCase());
      });
      setFilteredCandidates(filteredData);
    }
  }, [searchQuery, candidates]);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  //failed to load api screen
  const error = useSelector(state => state.candidates.error);

  if (error) {
    return <NoData refresh={() => dispatch(fetchCandidates())} />;
  }

  //candidate screen
  return (
    <View style={styles.container}>
      <AppBar navtitle={t('Candidate List')} />
      {/* <ScrollView
        contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}> */}
        <UserSearchBar
          handleSearch={handleSearch}
          placeholder={t('searchPlaceholdercandidate')}
        />
        {loading ? (
           <SkeltonLoader/>
        ) : (
          <FlatList
            data={filteredCandidates}
            renderItem={({item}) => <Candidatecard searchQuery={searchQuery} item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingBottom: h(2)}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoData text={'No Matching Candidates'}  />}
            refreshControl={
              <RefreshControl onRefresh={()=>dispatch(fetchCandidates())} />
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
