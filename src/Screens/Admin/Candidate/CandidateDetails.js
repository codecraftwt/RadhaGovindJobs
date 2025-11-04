import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import CandidateDetailsCard from '../../../Components/CandidateDetailsCard';
import TitleDescriptionCard from '../../../Components/TitleDescriptionCard';
import BulletpointContainer from '../../../Components/BulletpointContainer';
import { calender, educationicon, suitcase } from '../../../Theme/globalImages';
import AppBar from '../../../Components/AppBar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidateDetails } from '../../../Redux/Slices/Candidateslice';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const CandidateDetails = ({route}) => {
  const {item:passeditem , goback} = route.params;
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const item = useSelector(state => state.candidates.selectedCandidate)
  const loading = useSelector(state => state.candidates.modifyloading)

  useLayoutEffect(()=>{
    dispatch(fetchCandidateDetails(passeditem?.id))
  },[passeditem])

  //details fakedata
  const customData = [
    {title: t('Candidate Code'), value: `${item?.candidate_id}`},
    {title: t('Address'), value: `${item?.village?.village} , ${item?.taluka?.taluka}`},
    {title: t('Mobile No'), value: `${item?.contact_number_1} , ${item?.contact_number_2}`},
    {title: t('Email Address'), value: `${item?.email}`},
    {title: t('Gender'), value: `${item?.user?.gender}`},
    {title: t('Age'), value: `${new Date().getFullYear() - parseInt(item?.dob?.slice(0,5))}`},
    {title: t('Blood Group'), value: item?.blood_group},
    {title: t('Aadhar Card No'), value: `${item?.aadhar_no}`},
    {title: t('Pan Card No'), value: `${item?.pancard_no}`},
  ];


  //details design
  const personaldetailsdesign = item => (
    <View style={styles.desContainer}>
      <Text style={styles.destitle}>{item?.title} :</Text>
      <Text style={[styles.dessubtitle, {paddingEnd: w(3)}]}>
        {' '}
        {item?.value}
      </Text>
    </View>
  );

  //fake bulletpointdata
  const projectdata = [ 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
 
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  ];

  return (
    <View style={styles.container}>
      <AppBar backto={ goback ? goback : null}  navtitle={t('Candidate Details')} showBack={true} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? <SkeltonLoader/> :  
        <>
        <CandidateDetailsCard item={item}/>
        <View style={styles.aboutContainer}>
          <TitleDescriptionCard descriptiontitle={t('About Candidate')} description={item?.description} />
        </View>
        <View style={styles.aboutContainer}>
          <Text style={styles.title}>{t("Personal Details")}</Text>
          <FlatList
            data={customData.slice(0, 4)}
            renderItem={({item}) => personaldetailsdesign(item)}
          />
          <View style={styles.desContainer}>
            <Text style={styles.destitle}>{customData[4].title} :</Text>
            <Text style={styles.dessubtitle}> {customData[4].value}</Text>
            <Text style={styles.destitle}>{customData[5].title} :</Text>
            <Text style={styles.dessubtitle}> {customData[5].value}</Text>
            <Text style={styles.destitle}>{customData[6].title} :</Text>
            <Text style={styles.dessubtitle}> {customData[6].value}</Text>
          </View>
          <FlatList
            data={customData.slice(7, 9)}
            renderItem={({item}) => personaldetailsdesign(item)}
          />
        </View>
        <View style={styles.aboutContainer}>
          {/* <Text style={styles.title}>{t("Experience Details")}</Text>
          <Text style={styles.subtitle}>google info tech</Text>
          <View style={styles.SecondRow}>
            <Image
              resizeMode="contain"
              style={styles.Logo1}
              source={suitcase}
            />
            <Text style={styles.Text3}>{item?.experience} {t("Year Experience")}</Text>
            <Image
              resizeMode="contain"
              style={{
                marginRight: w(1),
                width: w(2.56),
                height: w(2.56),
              }}
              source={educationicon}
            />
            <Text style={styles.Text3} numberOfLines={1}>
              {item?.college_name?.slice(0, 30)}
              {item?.college_name?.length > 30 ? '...' : ''}
            </Text>
          </View>
          <View style={styles.SecondRow}>
            <Image
              resizeMode="contain"
              style={styles.Logo1}
              source={calender}
            />
            <Text style={styles.Text3}>
              08 Jan 2022{' '}
              <Text
                style={[
                  styles.Text3,
                  {fontFamily: 'BaiJamjuree-SemiBold', fontSize: f(1.72)},
                ]}>
                {' '}
                to{' '}
              </Text>{' '}
              20 jan 2023
            </Text>
          </View> */}
          <Text style={styles.subtitle}>{t("Job Category")}</Text>
          <BulletpointContainer data={item?.job_categories?.map(item =>({"name":item.category_name}))} />
          <Text style={styles.subtitle}>{t("Education")}</Text>
          <BulletpointContainer data={item?.education} />
          <Text style={styles.subtitle}>{t("Skill")}</Text>
          <BulletpointContainer data={item?.skills} />
        </View> 
        </>}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    flex: 1,
    marginBottom: h(2),
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
    alignSelf:'center'
  },
  dessubtitle: {
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
    fontSize: f(1.5),
    paddingEnd: w(10),
    alignSelf:'center',
    paddingVertical: h(0.5),
  },

  subtitle: {
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.black,
    fontSize: f(1.65),
    marginTop:w(2)
    // paddingVertical: h(0.5),
  },
  Text3: {
    marginEnd: w(4),
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.53),
  },
  Logo1: {
    marginRight: w(1.52),
    width: w(3.15),
    height: w(3.15),
  },

  SecondRow: {
    flexDirection: 'row',
    marginTop: w(1),
    alignItems: 'center',
    marginTop: w(-0.5),
  },
});

export default CandidateDetails;
