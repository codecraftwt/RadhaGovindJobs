import {
    FlatList,
    Image,
    RefreshControl,
    ScrollView, StyleSheet,
    Text,
    View
  } from 'react-native';
  import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
  import { f, h, w } from 'walstar-rn-responsive';
  import { globalColors } from '../../../Theme/globalColors';
  import { sortarrow } from '../../../Theme/globalImages';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchJobData, ownJobs } from '../../../Redux/Slices/Jobslice';
  import { useTranslation } from 'react-i18next';
  import NoData from '../../Common/Nodata';
  import JobFilterModal from '../../../Components/JobFilterModal';
  import AppBar from '../../../Components/AppBar';
  import SkeltonLoader from '../../../Components/SkeltonLoader';
  import SearchbarAdd from '../../../Components/SearchbarAdd';
  import { useFocusEffect, useNavigation } from '@react-navigation/native';
  import EmployerJobCard from '../../../Components/EmployerJobCard';
import usePermissionCheck from '../../../Utils/HasPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
    
    export default function JobsMnt({route}) {
      const {jobSaved , jobUpdated} = route.params || {}
      const {t} = useTranslation();
      const dispatch = useDispatch();
      const jobData = useSelector(state => state.jobs.ownJobs);
      const loading = useSelector(state => state.jobs.loading);
      const [searchQuery, setSearchQuery] = useState('');
      const [filteredJobs, setFilteredJobs] = useState([]);
      const [modalVisible, setModalVisible] = useState(false);
      const navigation = useNavigation();
      const[user ,setUser]=useState(null)
    
      // job filteration based on searchquery
    
      const handleSearch = text => {
        setSearchQuery(text);
      };
    
      // useEffect(() => {
      //   if (searchQuery.trim() === '') {
      //     setFilteredJobs(jobData);
      //   } else {
      //     const filteredData = jobData?.filter(job =>
      //       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||  job?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      //     );
      //     setFilteredJobs(filteredData);
      //   }
      // }, [searchQuery, jobData]);

        useEffect(() => {
          if (!jobData || jobData.length === 0) {
            setFilteredJobs([]);
            return;
          }

          // Filter out null or undefined jobs first
          const validJobs = jobData.filter(job => job != null);

        if (searchQuery.trim() === '') {
          setFilteredJobs(validJobs);
        } else {
          const filteredData = validJobs.filter(job =>
            job?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||  job?.user?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
          );
          setFilteredJobs(filteredData);
        }
      }, [searchQuery, jobData]);

      const fetchUser = useCallback(async () => {
        const userJson = await AsyncStorage.getItem('user');
        const userData = userJson != null ? JSON.parse(userJson) : null;
        setUser(userData);
        dispatch(ownJobs({
          "user_id": userData.id.toString()
        }));
      }, []);
    
      useLayoutEffect(()=>{
        fetchUser()
        return () => {
        };
      },[fetchUser])

      useFocusEffect(
        useCallback(() => {
          if (jobSaved) {
            Toast.show({
              text1: "Job saved successfully",
              position: 'bottom'
            });
          }
          return () => {
          };
        }, [jobSaved])
      );

      useFocusEffect(
        useCallback(() => {
        if (jobUpdated) {
          Toast.show({
            text1: "Job Updated successfully",
            position: 'bottom'
          });
        }
      }, [jobUpdated])
    );
    

      const hasPermission = usePermissionCheck()
    
      // Screen if api fail to load
      const error = useSelector(state => state.jobs.error);
    
      if (error) {
        return <NoData refresh={() => dispatch(ownJobs({
          "user_id": user.id.toString()
        }))} />;
      }
    
      // jobs screen
      return (
        <View style={styles.container}>
          <AppBar backto={'Home'} navtitle={t('Job List')} />
          <JobFilterModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />
          {/* <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}> */}
            <SearchbarAdd
              handleSearch={handleSearch}
              placeholder={t('searchPlaceholderjobs')}
              addbtnPress={()=>{navigation.navigate('AddJob',{item:null,updatejob:false})}}
              showadd={hasPermission('Jobs Create')}
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
              {/* <Image
                resizeMode="contain"
                style={{width: w(5)}}
                source={sortarrow}
              /> */}
            </View>
            {loading ? (
              <SkeltonLoader />
            ) : (
              <FlatList
                data={filteredJobs}
                keyExtractor={item => item?.id}
                contentContainerStyle={{paddingBottom: h(2)}}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <EmployerJobCard navigateto={'EmployerJobDetails'} item={item} />
                )}
                ListEmptyComponent={<NoData text={'No Matching Jobs'} />}
                refreshControl={
                  <RefreshControl onRefresh={()=>dispatch(ownJobs({
                    "user_id": user.id.toString()
                  }))} />
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
    