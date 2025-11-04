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
  import { useTranslation } from 'react-i18next';
  import NoData from '../../Common/Nodata';
  import SkeltonLoader from '../../../Components/SkeltonLoader';
  import AppBar from '../../../Components/AppBar';
  import UserSearchBar from '../../../Components/UserSearchBar';
import { fetchGrampanchayat } from '../../../Redux/Slices/Grampanchayatslice';
import GrampanchayatCard from '../../../Components/GrampanchayatCard';
  
  export default function Grampanchayat() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const Grampanchayat = useSelector(state => state.Grampanchayat.Grampanchayat);
    const loading = useSelector(state => state.Grampanchayat.loading);
    const error = useSelector(state => state.Grampanchayat.error);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGrampanchayat, setFilteredGrampanchayat] = useState([]);
  
    //search via query
    const handleSearch = query => {
      setSearchQuery(query);
    };
  
    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredGrampanchayat(Grampanchayat);
      } else {
        const filteredData = Grampanchayat?.filter(Grampanchayat =>
          Grampanchayat.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredGrampanchayat(filteredData);
      }
    }, [searchQuery, Grampanchayat]);
  
    useEffect(() => {
      dispatch(fetchGrampanchayat());
    }, [dispatch]);
  
   
    //api error handle
    if (error) {
      return <NoData refresh={() => dispatch(fetchGrampanchayat())} />;
    }
  
    //consultant screen
    return (
      <View style={styles.container}>
        <AppBar navtitle={t('Grampanchayat List')} />
        {/* <ScrollView
          contentContainerStyle={{flexGrow:1}}
          showsVerticalScrollIndicator={false}> */}
          <UserSearchBar
            handleSearch={handleSearch}
            placeholder={t('Search for Grampanchayat')}
          />
          {loading ? (
             <SkeltonLoader/>
          ) : (
            <FlatList
              data={filteredGrampanchayat}
              renderItem={({item}) => <GrampanchayatCard item={item} />}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{paddingBottom: h(2)}}
              ListEmptyComponent={<NoData text={'No Matching Grampanchyats'} />}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl onRefresh={()=>dispatch(fetchGrampanchayat()) } />
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
  