import {
  FlatList, ScrollView, StyleSheet, View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { h } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import UserSearchBar from '../../../Components/UserSearchBar';
import AppBar from '../../../Components/AppBar';
import { fetchEmployers } from '../../../Redux/Slices/Employerslice';
import CompanyCard from '../../../Components/CompanyCard';
import SkeltonLoader from '../../../Components/SkeltonLoader';

export default function UserCompany() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const employers = useSelector(state => state.employers.employers);
  const loading = useSelector(state => state.employers.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployers, setFilteredEmployers] = useState([]);

  //search via query
  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployers(employers);
    } else {
      const filteredData = employers?.filter(employers =>
        employers.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredEmployers(filteredData);
    }
  }, [searchQuery, employers]);

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  //api fail handle
  const error = useSelector(state => state.employers.error);

  if (error) {
    return <NoData refresh={() => dispatch(fetchEmployers())} />;
  }

  // company screen
  return (
    <View style={styles.container}>
      <AppBar navtitle={'Company List'} />
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <UserSearchBar
          handleSearch={handleSearch}
          placeholder={'Search for company'}
        />
        {loading ? (
          <SkeltonLoader />
        ) : (
          <FlatList
            data={filteredEmployers}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: h(2)}}
            renderItem={({item}) => <CompanyCard item={item} />}
            ListEmptyComponent={<NoData text={'No Matching Companies'} />}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
});
