import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TopTabNavigation from '../../../Navigations/TopTabNavigation';
import { globalColors } from '../../../Theme/globalColors';
import { h, w, sh, sw, f } from 'walstar-rn-responsive';
import { lens } from '../../../Theme/globalImages';
import PieStats from '../../../Components/PieStats';
import { useTranslation } from 'react-i18next';
import AppBar from '../../../Components/AppBar';
import { useDispatch} from 'react-redux';
import { fetchJobData } from '../../../Redux/Slices/Jobslice';
import { fetchEmployers } from '../../../Redux/Slices/Employerslice';


export default function Home({navigation}) {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const [refresh, setRefresh ] = useState(false)

  const onRefresh = ()=>{
    setRefresh(true)
    dispatch(fetchJobData())
    dispatch(fetchEmployers())
    setRefresh(false)
  }
  //home screen
  return (
    <View style={styles.container}>
      <AppBar/>
      <ScrollView showsVerticalScrollIndicator={false}
       refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      }>
        <TouchableOpacity
          onPress={() => navigation.navigate('Jobs', {autoFocusSearch: true})}>
          <View style={styles.searchbarcontainer}>
          <View style={styles.filtercontainer}>
            <Image
              resizeMode="contain"
              style={{width: w(5), height: w(5)}}
              source={lens}
            />
            </View>
            <View
              style={{
                width: '87%',
                justifyContent: 'center',
                paddingLeft: w(5),
              }}>
              <Text
                style={{
                  color: globalColors.Wisteria,
                  fontFamily: 'BaiJamjuree-Medium',
                  fontSize: f(1.8),
                }}>
                {t('searchPlaceholderjobs')}
              </Text>
            </View>
            
          </View>
        </TouchableOpacity>
        <View
          style={{
            flexGrow: 1,
            height:
              (sw(100) / sh(100)) * 100 > 60.5
                ? sh(sw(100) / sh(100)) * 91.5
                : sh(sw(100) / sh(100)) * 105,
          }}>
          <TopTabNavigation />
        </View>
        <PieStats />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
  searchbarcontainer: {
    flexDirection: 'row',
    height: w(11),
    alignItems: 'center',
    width: '90%',
    backgroundColor: globalColors.white,
    marginHorizontal: '5%',
    marginVertical: h(3),
    borderColor: globalColors.lightgrey,
    borderWidth: 1,
    borderRadius: h(2),
  },
  filtercontainer: {
    borderTopRightRadius: h(0.7),
    borderBottomRightRadius: h(0.7),
    height: w(11),
    width: '13%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
