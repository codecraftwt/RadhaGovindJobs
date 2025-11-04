import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import TitleDescriptionCard from '../../../Components/TitleDescriptionCard';
import BulletpointContainer from '../../../Components/BulletpointContainer';
import AppBar from '../../../Components/AppBar';
import { companydetailsbg } from '../../../Theme/globalImages';
import CompanyDetailsCard from '../../../Components/CompanyDetailsCard';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployerDetails } from '../../../Redux/Slices/Employerslice';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const EmployerDetails = ({ route }) => {
  const { item:passeditem } = route.params;
  const {t} = useTranslation();

  const item = useSelector(state => state.employers.employerDetails)
  const loading = useSelector(state => state.employers.loading)

  const dispatch = useDispatch()
  useLayoutEffect(() => {
    dispatch(fetchEmployerDetails(passeditem?.id))
  }, [passeditem])

  //bulletpoint data
  const jobRequirements = [

    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',

    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',

    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',

    'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',

  ];

  //jobdetails screen
  return (
    <View style={styles.container}>
      <View style={{ zIndex: 2 }}>
        <AppBar navtitle={t('Company Details')} showBack={true} />
      </View>
      <Image style={{ width: '100%', height: h(30), position: 'absolute', marginTop: h(12) }} resizeMode='streach' source={companydetailsbg} />
      <ScrollView contentContainerStyle={{ marginTop: h(18), paddingBottom: h(20) }} showsVerticalScrollIndicator={false}>
        {loading ? <SkeltonLoader skeltonstyles={{paddingTop:h(10)}} /> : <>
        <CompanyDetailsCard item={item} />
        <View style={styles.jobDescriptionContainer}>
          <TitleDescriptionCard descriptiontitle={t('About Company')} description={item?.users_info?.[0]?.description}/>
          {/* <View style={{ marginTop: h(1) }}>
            <TitleDescriptionCard descriptiontitle={'Job Responsibilities'} />
          </View>
          <View>
            <Text style={[styles.title, { marginTop: h(1) }]}>
              Skill and Experience
            </Text>
          </View>
          <BulletpointContainer data={jobRequirements} /> */}
        </View>
        </>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    paddingBottom: h(12),
  },
  jobDescriptionContainer: {
    backgroundColor: globalColors.backgroundshade,
    paddingHorizontal: w(5),
    paddingVertical: h(1.5),

  },
  title: {
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.black,
    fontSize: f(2),
    paddingVertical: h(0.5),
  },
});

export default EmployerDetails;
