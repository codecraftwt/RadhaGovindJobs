import { FlatList, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { h, w } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import CommonButton from '../../../Components/CommonButton';
import SearchbarAdd from '../../../Components/SearchbarAdd';
import JobCategoryCard from '../../../Components/JobCategoryCard';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJobCategories, fetchJobCategories, postJobCategories, updateJobCategories } from '../../../Redux/Slices/JobCategoryslice';
import AddCategoryModal from '../../../Components/AddCategoryModal';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../../../Components/AppBar';
import usePermissionCheck from '../../../Utils/HasPermission';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const JobsCategoryMnt = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const Categories = useSelector(state => state.jobCategory.JobCategory)
  const loading = useSelector(state => state.jobCategory.loading)
  const [isModalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets(); 

  const handleAddData = ({field1}) => {
    dispatch(postJobCategories(field1))
  };

  const navigation = useNavigation()
  const dispatch = useDispatch()

  //filteration via query
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(Categories);
    } else {
      const filteredData = Categories?.filter(Categories =>
        Categories.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filteredData);
    }
  }, [searchQuery, Categories]);


  useEffect(()=>{
    dispatch(fetchJobCategories())
  },[])

  const handleupdateData = (field1,id) => {
    dispatch(updateJobCategories({id,field1}))
  };

  const deleteItem =(id)=>{
    dispatch(deleteJobCategories(id))
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
        flex:1,
        paddingBottom:Math.max(insets.bottom, h(2)),
      }}>
      <AppBar navtitle={t('Job Category')} />
      <SearchbarAdd showadd={hasPermission('Job Category Create Mobile')} handleSearch={handleSearch} addbtnPress={addPress}  placeholder={t('searchPlaceholdercategory')} />
      <ScrollView showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true) ,dispatch(fetchJobCategories()) ,setRefresh(false)}} />
      }>
      <AddCategoryModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddData}
        modal_title={'Add Category'}
        btntitle={"Add"} 
        placeholder={"Enter Category"}
      />
      {/* <View
        style={{
          flexDirection: 'row',
          marginTop: h(2.5),
          marginHorizontal: '10%',
          gap: w(3),
          justifyContent: 'space-between',
        }}>
        <CommonButton onpress={()=>navigation.navigate('Skill')} btnstyles={{paddingVertical:w(1)}} title={t('Skill')} />
        <CommonButton onpress={()=>navigation.navigate('Jobtype')} btnstyles={{paddingVertical:w(1)}} title={t('Job Type')} />
        <CommonButton onpress={()=>navigation.navigate('Education')} btnstyles={{paddingVertical:w(1)}} title={t('Education')} />
      </View> */}
      {loading ? (
         <SkeltonLoader/>
        ) : 
        <FlatList
        data={filteredCategories}
        contentContainerStyle={{ paddingBottom: h(2) }}
        renderItem={({item}) => (
          <JobCategoryCard modal_title={'Update Job Category'} showedit={hasPermission('Job Category Update Mobile')} showdelete={hasPermission('Job Category Delete Mobile')}  handleAddData={handleupdateData} deleteItem={deleteItem} id={item.id} title={item.category_name} subtitle={item.status} />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<NoData text={'No Matching Categories'}/>}
      />}
      </ScrollView>
    </View>
  );
};

export default JobsCategoryMnt;

const styles = StyleSheet.create({});
