import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, {useLayoutEffect, useMemo, useState} from 'react';
import {globalColors} from '../../../Theme/globalColors';
import {f, h, w} from 'walstar-rn-responsive';
import ApplyBtn from '../../../Components/applyBtn';
import TitleDescriptionCard from '../../../Components/TitleDescriptionCard';
import BulletpointContainer from '../../../Components/BulletpointContainer';
import AppBar from '../../../Components/AppBar';
import {jobdetailsbg} from '../../../Theme/globalImages';
import UserJobDetailsCard from '../../../Components/UserJobDetailsCard';
import usePermissionCheck from '../../../Utils/HasPermission';
import {useTranslation} from 'react-i18next';
import {applyJob, fetchJobDetails} from '../../../Redux/Slices/Jobslice';
import {useDispatch, useSelector} from 'react-redux';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import RenderHtml from 'react-native-render-html';

const JobDetails = ({route}) => {
  const {item: passeditem, goback, params} = route.params;
  const {t} = useTranslation();
  const [user, setUser] = useState(null);

  const item = useSelector(state => state.jobs.JobDetails);
  const loading = useSelector(state => state.jobs.modifyloading);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const hasPermission = usePermissionCheck();

  useFocusEffect(
    useCallback(() => {
      fetchuser();
      return () => {};
    }, []),
  );


  useLayoutEffect(() => {
    if (passeditem?.id) {
      dispatch(fetchJobDetails(passeditem.id));
    }
  }, [passeditem]);

  const fetchuser = async () => {
    const userJson = await AsyncStorage.getItem('user');
    const userData = userJson != null ? JSON.parse(userJson) : null;
    setUser(userData);
  };

  const buttonText = useMemo(
    () => (
      <Text
        style={{
          fontFamily: 'BaiJamjuree-SemiBold',
          color: globalColors.white,
          fontSize: f(2),
          textAlign: 'center',
        }}>
        {t('Apply This Job')}
      </Text>
    ),
    [t],
  );

  const applyJobHandler = async () => {
    dispatch(applyJob({JobId: item.id, userId: user.id})).then(action => {
      if (action.payload.message) {
        Toast.show({
          text1: action.payload.message,
          position: 'bottom',
        });
        navigation.goBack();
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={{zIndex: 2}}>
        <AppBar
          backto={goback ? goback : null}
          params={params ? params : null}
          navtitle={t('Job Details')}
          showBack={true}
        />
      </View>
      <Image
        style={{
          width: '100%',
          height: h(30),
          position: 'absolute',
          marginTop: h(12),
        }}
        resizeMode="stretch"
        source={jobdetailsbg}
      />
      <ScrollView
        contentContainerStyle={{marginTop: h(18), paddingBottom: h(20)}}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <SkeltonLoader skeltonstyles={{paddingTop: h(10)}} />
        ) : (
          <>
            <UserJobDetailsCard item={item} />
            <View style={styles.jobDescriptionContainer}>
              <View>
                <Text style={styles.title}>{t('About Job')}</Text>
              </View>
              <RenderHtml
                contentWidth={w(100)}
                source={{html: item?.description}}
                tagsStyles={{
                  body: {
                    color: globalColors.suvagrey,
                  },
                }}
              />
              <TitleDescriptionCard
                descriptiontitle={t('Job Category')}
                description={item?.job_category?.category_name}
              />
              <TitleDescriptionCard
                descriptiontitle={t('Job Type')}
                description={item?.job_type?.job_type_name}
              />
              <View>
                <Text style={[styles.title, {marginTop: h(1)}]}>
                  {t('Skill and Experience')}
                </Text>
              </View>
              <BulletpointContainer data={item?.skills} />
            </View>
            <View style={{backgroundColor: globalColors.backgroundshade}}>
              {hasPermission('Apply Job Mobile') && item?.is_applied==0 ? (
                <ApplyBtn onPress={applyJobHandler} buttonText={buttonText} />
              ):( hasPermission('Apply Job Mobile') &&
                <TouchableOpacity style={styles.applyBtnStyles} disabled={true}>
                  <Text style={styles.text}>You have already applied</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
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
   applyBtnStyles: {
        backgroundColor: globalColors.activepink,
        borderRadius: h(0.5),
        paddingVertical: h(0.8),
        paddingHorizontal: h(1),
        alignItems: 'center',
        marginHorizontal: h(2),
        marginBottom: h(1),
    },
    text:{
        fontFamily: 'BaiJamjuree-SemiBold',
        color: globalColors.white,
        fontSize: f(2),
        textAlign: 'center',
    }
});

export default JobDetails;
