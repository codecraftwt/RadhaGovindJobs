import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalColors } from '../../../Theme/globalColors'
import AddCategoryModal from '../../../Components/AddCategoryModal'
import SearchbarAdd from '../../../Components/SearchbarAdd'
import SkeltonLoader from '../../../Components/SkeltonLoader'
import JobCategoryCard from '../../../Components/JobCategoryCard'
import NoData from '../../Common/Nodata'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { h, w } from 'walstar-rn-responsive'
import { deleteskills, fetchskills, postskills, updateskills } from '../../../Redux/Slices/Skillslice'
import AppBar from '../../../Components/AppBar'
import { fetchJobCategories } from '../../../Redux/Slices/JobCategoryslice'
import usePermissionCheck from '../../../Utils/HasPermission'

const Skill = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSkills, setFilteredSkills] = useState([]);
    const Skills = useSelector(state => state.skills.skills)
    const loading = useSelector(state => state.skills.loading)
    const [isModalVisible, setModalVisible] = useState(false);
  
    const handleAddData = ({field1,cat_id}) => {
      dispatch(postskills({field1,id:cat_id}))
    };

    const handleUpdateData = (field1,id,cat_id) => {
      dispatch(updateskills({cat_id,field1,id}))
    };

    const deleteItem =(id)=>{
      dispatch(deleteskills(id))
    }

  
    const dispatch = useDispatch()
  
    //filteration via query
    const handleSearch = (query) => {
      setSearchQuery(query);
    }

  
    useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredSkills(Skills);
      } else {
        const filteredData = Skills?.filter(Skills =>
            Skills.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSkills(filteredData);
      }
    }, [searchQuery, Skills]);
  
  
    useEffect(()=>{
      dispatch(fetchJobCategories())
      dispatch(fetchskills())
    },[])
  
    const addPress =()=>{
      setModalVisible(true)
    }

    const hasPermission = usePermissionCheck()
    const [refresh , setRefresh] = useState(false)


  return (
    <View
      style={{
        backgroundColor: globalColors.backgroundshade,
        flex:1
      }}>
      <AppBar navtitle={t('Job Skills')} />
      <SearchbarAdd showadd={hasPermission('Job Skill Create Mobile')} handleSearch={handleSearch} addbtnPress={addPress}  placeholder={t('search for job skill')}/>
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={()=>{setRefresh(true) ,dispatch(fetchJobCategories()),dispatch(fetchskills()) ,setRefresh(false)}} />
      }>
      <AddCategoryModal
        skills={true}
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddData}
        modal_title={'Add Skill'}
        btntitle={"Add"} 
        placeholder={"Enter Skill"}
      />
      <View
        style={{
          flexDirection: 'row',
          marginTop: h(2.5),
          marginHorizontal: '10%',
          gap: w(10),
          justifyContent: 'space-between',
        }}>
      </View>
      {loading ? (
         <SkeltonLoader/>
        ) : 
        <FlatList
        data={filteredSkills}
        contentContainerStyle={{ paddingBottom: h(2) }}
        renderItem={({item}) => (
          <JobCategoryCard modal_title={"Update Skill"} showedit={hasPermission('Job Skill Update Mobile')} showdelete={hasPermission('Job Skill Delete Mobile')} deleteItem={deleteItem} cat_id={item.job_category_id} handleAddData={handleUpdateData} id={item.id} title={item.name} subtitle={item?.job_category?.category_name}  />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<NoData text={'No Matching skills'}/>}
      />}
      </ScrollView>
    </View>
  )
}

export default Skill

const styles = StyleSheet.create({})