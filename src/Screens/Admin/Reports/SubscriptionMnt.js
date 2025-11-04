import {
  View,
  Text, ScrollView,
  StyleSheet, FlatList, TouchableWithoutFeedback
} from 'react-native';
import React from 'react';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import Subscriptioncard from '../../../Components/Subscriptioncard';
import AppBar from '../../../Components/AppBar';
import { useTranslation } from 'react-i18next';

const SubscriptionMnt = () => {
 
  const {t} = useTranslation();

  const renderItem = ({item}) => (
    <Subscriptioncard name={item.name} endDate={item.endDate} />
  );

  //fake card data
  const data = [
    {id: '1', name: 'Subscription 1', endDate: 'Jan 25, 2024'},
    {id: '2', name: 'Subscription 2', endDate: 'Feb 15, 2024'},
    {id: '3', name: 'Subscription 3', endDate: 'Mar 10, 2024'},
    {id: '4', name: 'Subscription 3', endDate: 'Apr 15, 2024'},
    {id: '5', name: 'Subscription 3', endDate: 'May 17, 2024'},
  ];

  //subscription mnt screen
  return (
    <View style={{backgroundColor: globalColors.backgroundshade, flexGrow: 1}}>
      <AppBar navtitle={t('Subscription Management')} />
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <View style={styles.container}>
            <Text
              style={{
                fontFamily: 'BaiJamjuree',
                color: globalColors.black,
                marginStart:w(3),
                marginTop:w(1),
                fontSize: f(1.5),
              }}>
              <Text>
                It is psum is that it has a morgfyuhdeuifhgufd guidf dfghd idfhg  idfg odfgdfggiusdhfi guidfhiug duifghiue-or-less
                normal distribution of{'  '}
              </Text>
              <TouchableWithoutFeedback>
                <Text
                  style={{
                    fontFamily: 'BaiJamjuree',
                    color: globalColors.black,
                    fontSize: f(1.5),
                    textDecorationLine: 'underline',
                  }}>
                  {t("Learn more about subscription")}
                </Text>
              </TouchableWithoutFeedback>
            </Text>

            <Text
              style={{
                fontFamily: 'BaiJamjuree-Bold',
                color: globalColors.black,
                fontSize: f(2),
                marginStart:w(3),
                marginTop:w(1),
              }}>
              {t('Active')}
            </Text>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
        </View>
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.backgroundshade,
    flex: 1,
    paddingHorizontal: w(2),
  },
  titleText: {
    marginVertical: h(2),
  },
});

export default SubscriptionMnt;
