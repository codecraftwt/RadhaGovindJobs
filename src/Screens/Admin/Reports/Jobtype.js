import { FlatList, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { h } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import SearchbarAdd from '../../../Components/SearchbarAdd';
import JobCategoryCard from '../../../Components/JobCategoryCard';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import { useDispatch, useSelector } from 'react-redux';
import AddCategoryModal from '../../../Components/AddCategoryModal';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import { deleteJobType, fetchJobType, postJobType, updateJobType } from '../../../Redux/Slices/JobTypeslice';
import AppBar from '../../../Components/AppBar';
import usePermissionCheck from '../../../Utils/HasPermission';

const Jobtype = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobType, setFilteredJobType] = useState([]);
  const JobType = useSelector(state => state.JobType.JobType)
  const loading = useSelector(state => state.JobType.loading)
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddData = ({field1}) => {
    dispatch(postJobType(field1))
  };

  const hasPermission = usePermissionCheck()


  const dispatch = useDispatch()

  //filteration via query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobType(JobType);
    } else {
      const filteredData = JobType?.filter(JobType =>
        JobType.job_type_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobType(filteredData);
    }
  }, [searchQuery, JobType]);


  useEffect(()=>{
    dispatch(fetchJobType())
  },[])

  const handleupdateData = (field1,id) => {
    dispatch(updateJobType({id,field1}))
  };

  const deleteItem =(id)=>{
    dispatch(deleteJobType(id))
  }

  const addPress =()=>{
    setModalVisible(true)
  }
  const [refresh , setRefresh] = useState(false)
  // job categories screen
  return (
    <View
      style={{
        backgroundColor: globalColors.backgroundshade,
        flex:1
      }}>
      <AppBar navtitle={t('Job Type')} />
      <SearchbarAdd showadd={hasPermission('Job Type Create Mobile')} handleSearch={handleSearch} addbtnPress={addPress}  placeholder={t('Search Job Type')}/>
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true) ,dispatch(fetchJobType()) ,setRefresh(false)}} />
      }>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddData}
        modal_title={'Add Job Type'}
        btntitle={"Add"} 
        placeholder={"Enter Job Type"}
      />
      {loading ? (
         <SkeltonLoader/>
        ) : 
        <FlatList
        data={filteredJobType}
        contentContainerStyle={{ paddingBottom: h(2) }}
        renderItem={({item}) => (
          <JobCategoryCard modal_title={"Update Job Type"} showedit={hasPermission('Job Type Update Mobile')} showdelete={hasPermission('Job Type Delete Mobile')} handleAddData={handleupdateData} deleteItem={deleteItem} id={item.id} title={item.job_type_name} subtitle={item.status} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<NoData text={'No Matching Jobs'}/>}
      />}
      </ScrollView>
    </View>
  );
};

export default Jobtype;

const styles = StyleSheet.create({});
