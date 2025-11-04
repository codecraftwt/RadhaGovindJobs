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
import { fetchConsultants } from '../../../Redux/Slices/Consultantslice';
import Consultantcard from '../../../Components/Consultantcard';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AppBar from '../../../Components/AppBar';
import UserSearchBar from '../../../Components/UserSearchBar';

export default function Consultant() {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const consultants = useSelector(state => state.consultants.consultants);
  const loading = useSelector(state => state.consultants.loading);
  const error = useSelector(state => state.consultants.error);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConsultants, setFilteredConsultants] = useState([]);

  //search via query
  const handleSearch = query => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConsultants(consultants);
    } else {
      const filteredData = consultants?.filter(consultants =>
        consultants.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredConsultants(filteredData);
    }
  }, [searchQuery, consultants]);

  useEffect(() => {
    dispatch(fetchConsultants());
  }, [dispatch]);

 
  //api error handle
  if (error) {
    return <NoData refresh={() => dispatch(fetchConsultants())} />;
  }

  //consultant screen
  return (
    <View style={styles.container}>
      <AppBar navtitle={t('Consultant List')} />
      {/* <ScrollView
        contentContainerStyle={{flexGrow:1}}
        showsVerticalScrollIndicator={false}> */}
        <UserSearchBar
          handleSearch={handleSearch}
          placeholder={t('searchPlaceholderconsultant')}
        />
        {loading ? (
           <SkeltonLoader/>
        ) : (
          <FlatList
            data={filteredConsultants}
            renderItem={({item}) => <Consultantcard item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{paddingBottom: h(2)}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NoData text={'No Matching Consultants'} />}
            refreshControl={
              <RefreshControl onRefresh={()=>dispatch(fetchConsultants())} />
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
