import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet, View
  } from 'react-native';
  import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
  import { h } from 'walstar-rn-responsive';
  import { globalColors } from '../../../Theme/globalColors';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchCandidates, fetchMyCandidates, updateCandidates } from '../../../Redux/Slices/Candidateslice';
  import { useTranslation } from 'react-i18next';
  import NoData from '../../Common/Nodata';
  import SkeltonLoader from '../../../Components/SkeltonLoader';
import AppBar from '../../../Components/AppBar';
import SearchbarAdd from '../../../Components/SearchbarAdd';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import InstituteCandidatecard from '../../../Components/InstituteCandidateCard';
import usePermissionCheck from '../../../Utils/HasPermission';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export default function CandidatesMnt({route}) {
    const {candidateSaved , candidateUpdated} = route.params || {}
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const candidates = useSelector(state => state.candidates.myCandidates);
    const loading = useSelector(state => state.candidates.loading);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const hasPermission = usePermissionCheck()
    const[user ,setUser]=useState(null)


    const fetchUser = useCallback(async () => {
      const userJson = await AsyncStorage.getItem('user');
      const userData = userJson != null ? JSON.parse(userJson) : null;
      setUser(userData);
      dispatch(fetchMyCandidates(userData.id));
    }, []);
  
    useLayoutEffect(()=>{
      fetchUser()
      return () => {
      };
    },[fetchUser])

    const navigation = useNavigation()
  
    //filteration via query
    const handleSearch = query => {
      setSearchQuery(query);
    };

    useFocusEffect(useCallback(() => {
      if (candidateSaved) {
        Toast.show({
          text1: "Candidate saved successfully",
          position: 'bottom'
        });
      }
      return () => {
      };
    }, [candidateSaved]));

    useFocusEffect(useCallback(() => {
      if (candidateUpdated) {
        Toast.show({
          text1: "candidate Updated successfully",
          position: 'bottom'
        });
      }
      return () => {
      };
    }, [candidateUpdated]));
  
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
      return <>
        <AppBar navtitle={t('Candidate List')} />
        <NoData refresh={() => dispatch(fetchMyCandidates(user.id))} />;
      </>
    }
  
    
    //candidate screen
    return (
      <View style={styles.container}>
        <AppBar navtitle={t('Candidate List')} />
        {/* <ScrollView
          contentContainerStyle={{flexGrow:1}}
          showsVerticalScrollIndicator={false}> */}
          <SearchbarAdd
            handleSearch={handleSearch}
            placeholder={t('searchPlaceholdercandidate')}
            addbtnPress={()=>{navigation.navigate('AddCandidates',{item:null,updateCandidates:false})}}
            showadd={hasPermission('Candidates Create')}
          />
          {loading ? (
             <SkeltonLoader/>
          ) : (
            <FlatList
              data={filteredCandidates}
              renderItem={({item}) => <InstituteCandidatecard item={item} />}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{paddingBottom: h(2)}}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<NoData text={'No Matching Candidates'} />}
              refreshControl={
                <RefreshControl  onRefresh={()=>{dispatch(fetchMyCandidates(user.id))}} />
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
  