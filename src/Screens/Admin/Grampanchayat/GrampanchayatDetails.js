import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
  } from 'react-native';
  import React, { useDebugValue, useLayoutEffect } from 'react';
  import { globalColors } from '../../../Theme/globalColors';
  import { f, h, w } from 'walstar-rn-responsive';
  import TitleDescriptionCard from '../../../Components/TitleDescriptionCard';
  import ConsultantDetailsCard from '../../../Components/ConsultantDetailsCard';
  import AppBar from '../../../Components/AppBar';
  import { useTranslation } from 'react-i18next';
  import { useDispatch, useSelector } from 'react-redux';
  import { fetchConsultantDetails } from '../../../Redux/Slices/Consultantslice';
  import SkeltonLoader from '../../../Components/SkeltonLoader';
import GrampanchayatDetailsCard from '../../../Components/GrampanchayatDetailsCard';
  
  const GrampanchayatDeatils = ({ route }) => {
    const { item: passeditem } = route.params;
    const { t } = useTranslation();
  
    // const item = useSelector(state => state.consultants.ConsultantDetails)
    const loading = useSelector(state => state.Grampanchayat.loading)
  
    // const dispatch = useDispatch()
    // useLayoutEffect(() => {
    //   dispatch(fetchConsultantDetails(passeditem?.id))
    // }, [passeditem])
  
  
    //fake details data
    // const customData = [
    //   { title: 'Consultant Name', value: `${item.name}` },
    //   { title: 'Position', value: `${item.profession}` },
    //   { title: 'Address', value: `${item.location}` },
    //   { title: 'Mobile No', value: '123-456-7890' },
    //   { title: 'Email Address', value: 'john.doe@example.com' },
    //   { title: 'Gender', value: 'Male' },
    //   { title: 'Age', value: 30 },
    //   { title: 'Blood Group', value: 'A+' },
    // ];
  
  
    //details design
    // const personaldetailsdesign = item => (
    //   <View style={styles.desContainer}>
    //     <Text style={styles.destitle}>{item.title} :</Text>
    //     <Text style={[styles.dessubtitle, { paddingEnd: w(3) }]}>
    //       {' '}
    //       {item.value}
    //     </Text>
    //   </View>
    // );
  
    //consultant details
    return (
      <View style={styles.container}>
        <AppBar backto={'Grampanchayat'} navtitle={t('Grampanchayat Details')} showBack={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {loading ? <SkeltonLoader/> : <>
          <GrampanchayatDetailsCard
            item={passeditem}
          />
          <View style={styles.aboutContainer}>
            <TitleDescriptionCard descriptiontitle={t('Description')} description={passeditem?.users_info[0]?.description} />
          </View>
          {/* <View style={styles.aboutContainer}>
            <Text style={styles.title}>Personal Details</Text>
            <FlatList
              data={customData.slice(0, 5)}
              renderItem={({ item }) => personaldetailsdesign(item)}
            />
            <View style={styles.desContainer}>
              <Text style={styles.destitle}>{customData[5].title} :</Text>
              <Text style={styles.dessubtitle}> {customData[5].value}</Text>
              <Text style={styles.destitle}>{customData[6].title} :</Text>
              <Text style={styles.dessubtitle}> {customData[6].value}</Text>
              <Text style={styles.destitle}>{customData[7].title} :</Text>
              <Text style={styles.dessubtitle}> {customData[7].value}</Text>
            </View>
          </View> */}
          </>}
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: globalColors.backgroundshade,
      flex: 1,
      marginBottom: h(2)
    },
    aboutContainer: {
      backgroundColor: globalColors.white,
      margin: h(2),
      marginBottom: 0,
      paddingHorizontal: h(2.5),
      paddingVertical: h(1.5),
      borderRadius: h(1.2),
      borderWidth: w(0.12),
      borderColor: globalColors.borderColor,
    },
    title: {
      fontFamily: 'BaiJamjuree-Bold',
      color: globalColors.black,
      fontSize: f(2),
      paddingVertical: h(0.5),
    },
    desContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: h(0.5),
      borderBottomWidth: w(0.11),
      borderColor: globalColors.purplegrey,
    },
  
    destitle: {
      fontFamily: 'BaiJamjuree-SemiBold',
      color: globalColors.black,
      fontSize: f(1.54),
      paddingVertical: h(0.5),
    },
    dessubtitle: {
      fontFamily: 'BaiJamjuree-Medium',
      color: globalColors.navypurple,
      fontSize: f(1.5),
      paddingEnd: w(10),
      paddingTop: h(0.8),
    },
  });
  
  export default GrampanchayatDeatils;
  