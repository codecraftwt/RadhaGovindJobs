import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobData } from '../../../Redux/Slices/Jobslice';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import JobCard from '../../../Components/JobCard';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import NoData from '../../Common/Nodata';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const RecentJobList = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const jobData = useSelector(state => state.jobs.jobData);
  const loading = useSelector(state => state.jobs.loading);
  const error = useSelector(state => state.jobs.error);

  // const [filteredJobData, setFilteredJobData] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchJobData());
  }, [dispatch]);

  // useEffect(() => {
  //   if (searchQuery.trim() === '') {
  //     setFilteredJobData(jobData);
  //   } else {
  //     const filteredData = jobData.filter(
  //       (job) =>
  //         job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //         job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  //     );
  //     setFilteredJobData(filteredData);
  //   }
  // }, [searchQuery, jobData]);


  //error handle
  if (error) {
    return (
        <NoData refresh={()=>dispatch(fetchJobData())}/>
    );
  }


  //loading handle
  if (loading) {
    return (
        <SkeltonLoader/>
    );
  }


  //recent jobs screen
  return (
    <View style={styles.container}>
      {jobData && jobData.slice(0, 2).map(job => (
        <JobCard
          key={job.id}
          item={job}
        />
      ))}
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.viewall}
          onPress={() => navigation.navigate('Jobs')}>
          <Text style={styles.viewalltxt}>{t('View All')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentJobList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    flex: 1,
  },
  viewall: {
    marginVertical: h(3.5),
    paddingHorizontal: w(10),
    paddingVertical: h(0.5),
    borderWidth: w(0.3),
    borderColor: globalColors.commonpink,
    borderRadius: w(1.5),
  },

  viewalltxt: {
    fontSize: f(1.9),
    color: globalColors.commonpink,
    fontFamily: 'BaiJamjuree-SemiBold',
  },
});
