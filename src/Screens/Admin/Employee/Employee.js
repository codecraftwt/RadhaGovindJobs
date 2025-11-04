import { FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Employercard from '../../../Components/Employercard';
import {
  h
} from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployers } from '../../../Redux/Slices/Employerslice';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AppBar from '../../../Components/AppBar';
import UserSearchBar from '../../../Components/UserSearchBar';
import CompanyCard from '../../../Components/CompanyCard';

export default function Employee() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const employers = useSelector(state => state.employers.employers);
  const loading = useSelector((state) => state.employers.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployers, setFilteredEmployers] = useState([]);


  //search via query 
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEmployers(employers);
    } else {
      const filteredData = employers?.filter(employers =>
        employers?.users_info[0]?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    return (
        <NoData refresh={()=>dispatch(fetchEmployers())}/>
    );
  }

  //employee screen
  return (
    <View style={styles.container}>
      <AppBar navtitle={t('Employer List')} />
      {/* <ScrollView   contentContainerStyle={{flexGrow:1}} showsVerticalScrollIndicator={false}> */}
      <UserSearchBar
          handleSearch={handleSearch}
          placeholder={t('searchPlaceholderemployee')}
        />
        {loading ? (
              <SkeltonLoader/>
            ) : 
        <FlatList
          data={filteredEmployers}
          renderItem= {({item}) => (
            <CompanyCard
              item={item}
            />)}
          contentContainerStyle={{paddingBottom: h(2)}}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<NoData text={'No Matching Employers'}/>}
          refreshControl={
            <RefreshControl onRefresh={()=>dispatch(fetchEmployers())} />
          }
        />}
        {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:globalColors.backgroundshade
  }
});

