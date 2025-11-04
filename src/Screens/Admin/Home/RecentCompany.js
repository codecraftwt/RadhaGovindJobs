import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { fetchEmployers } from '../../../Redux/Slices/Employerslice';
import NoData from '../../Common/Nodata';
import CompanyCardLarge from '../../../Components/CompanyCardLarge';
import SkeltonLoader from '../../../Components/SkeltonLoader';

const RecentCompany = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const employers = useSelector(state => state.employers.employers);
  const loading = useSelector(state => state.employers.loading);
  const error = useSelector(state => state.employers.error);

  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  //api error handle
  if (error) {
    return <NoData refresh={() => dispatch(fetchEmployers())} />;
  }

  //loading handle
  if (loading) {
    return (
        <SkeltonLoader/>
    );
  }

  //recent company screen
  return (
    <View style={styles.container}>
  
      {employers && employers.slice(0, 2).map(employers => (
        <CompanyCardLarge key={employers.id} item={employers} />
      ))}

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.viewall}
          onPress={() => navigation.navigate('Employee')}>
          <Text style={styles.viewalltxt}>{t('View All')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecentCompany;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    flex: 1,
  },
  viewall: {
    marginVertical: h(2.5),
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
