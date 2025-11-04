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
import { deleteEducation, fetchEducation, postEducation, updateEducation } from '../../../Redux/Slices/Educationslice';
import AppBar from '../../../Components/AppBar';
import usePermissionCheck from '../../../Utils/HasPermission';

const Education = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEducation, setFilteredEducation] = useState([]);
  const Education = useSelector(state => state.Education.Education)
  const loading = useSelector(state => state.Education.loading)
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddData = ({field1}) => {
    dispatch(postEducation(field1))
  };

  const dispatch = useDispatch()

  //filteration via query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEducation(Education);
    } else {
      const filteredData = Education?.filter(Education =>
        Education.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEducation(filteredData);
    }
  }, [searchQuery, Education]);


  useEffect(()=>{
    dispatch(fetchEducation())
  },[])

  const handleupdateData = (field1,id) => {
    dispatch(updateEducation({id,field1}))
  };

  const deleteItem =(id)=>{
    dispatch(deleteEducation(id))
  }

  const addPress =()=>{
    setModalVisible(true)
  }

  const hasPermission = usePermissionCheck()
  const [refresh , setRefresh] = useState(false)

  // job categories screen
  return (
    <View
      style={{
        backgroundColor: globalColors.backgroundshade,
        flex:1
      }}>
      <AppBar navtitle={t('Job Education')} />
      <SearchbarAdd showadd={hasPermission('Job Education Create Mobile')} handleSearch={handleSearch} addbtnPress={addPress}  placeholder={t('Search Education')}/>
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true) ,dispatch(fetchEducation()),setRefresh(false)}} />
      }>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddData}
        modal_title={'Add Education'}
        btntitle={"Add"} 
        placeholder={"Enter Education"}
      />
      {loading ? (
         <SkeltonLoader/>
        ) : 
        <FlatList
        data={filteredEducation}
        contentContainerStyle={{ paddingBottom: h(2) }}
        renderItem={({item}) => (
          <JobCategoryCard modal_title={"Update Education"} showedit={hasPermission('Job Education Update Mobile')} showdelete={hasPermission('Job Education Delete Mobile')} handleAddData={handleupdateData} deleteItem={deleteItem} id={item.id} title={item.name} subtitle={item.status} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<NoData text={'No Matching Education'}/>}
      />}
      </ScrollView>
    </View>
  );
};

export default Education;

const styles = StyleSheet.create({});
