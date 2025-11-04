import {
  FlatList, RefreshControl, StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppBar from '../../../Components/AppBar';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../../../Redux/Slices/Jobslice';
import UserJobCard from '../../../Components/UserJobCard';
import JobCardMicro from '../../../Components/JobCardMicro';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const InstitutionsHome = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobs.jobData);
  const loading = useSelector(state => state.jobs.loading);
  const error = useSelector(state => state.jobs.error);

  useEffect(() => {
    dispatch(fetchJobData());
  }, [dispatch]);

  if (error) {
    return <NoData refresh={() => dispatch(fetchJobData())} />;
  }

  const [refresh, setRefresh] = useState(false)

  const onRefresh = () => {
    setRefresh(true)
    dispatch(fetchJobData())
    setRefresh(false)
  }

  return (
    <View style={styles.container}>
      <AppBar />
      <ScrollView
        contentContainerStyle={loading ? { flex: 1 } : null}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        {loading ? (
          <SkeltonLoader skeltonstyles={{ marginTop: h(5) }} />
        ) : (
          <>
            {/* <View style={{paddingStart: w(5), paddingVertical: h(2)}}>
                <Text style={styles.titletxt}>Find Your</Text>
                <Text style={styles.titletxt}>Dream Job Here</Text>
              </View> */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: w(3),
              }}>
              <Text
                style={{
                  fontSize: f(2.2),
                  fontFamily: 'BaiJamjuree-SemiBold',
                  color: globalColors.black,
                  paddingStart: w(5),
                }}>
                {t("Recent Job")}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <Text style={styles.apply}>{t("View All")}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={jobData.slice(-10)}
                keyExtractor={item => item.id}
                horizontal={true}
                contentContainerStyle={{ paddingBottom: h(2) }}
                renderItem={({ item }) => <UserJobCard item={item} />}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: h(4),
              }}>
              <Text
                style={{
                  fontSize: f(2.2),
                  fontFamily: 'BaiJamjuree-SemiBold',
                  color: globalColors.black,
                  paddingStart: w(5),
                }}>
                {t("All Jobs")}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <Text style={styles.viewall}>{t("View All")}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={jobData.slice(0, 10)}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: h(2) }}
                renderItem={({ item }) => <JobCardMicro navigateto={'JobDetails'} item={item} />}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default InstitutionsHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
  titletxt: {
    fontSize: f(3),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.black,
    lineHeight: h(4.5),
  },
  apply: {
    backgroundColor: globalColors.white,
    paddingHorizontal: w(3),
    paddingVertical: h(0.3),
    color: globalColors.navypurple,
    borderRadius: w(1),
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Medium',
    marginEnd: w(3),
    elevation: 1,
  },

  viewall: {
    paddingHorizontal: w(3),
    paddingVertical: h(0.3),
    color: globalColors.navypurple,
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Medium',
    marginEnd: w(3),
  }
});
