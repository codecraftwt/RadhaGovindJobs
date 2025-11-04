import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { edit, jobsdemo, locationpng, maleuser, Rgjobs } from '../Theme/globalImages';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import { baseurl } from '../Utils/API';

const CompanyCardLarge = ({ item }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <TouchableOpacity
          style={{ width: '100%' }}
          onPress={() => navigation.navigate('EmployerDetails', { item })}>
          <View style={styles.firstrowcontainer}>
            <View>
              <Image resizeMode="contain" style={styles.Logo} source={item?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : Rgjobs} />
            </View>
            <View style={styles.titlecontainer}>
              <Text style={styles.jobtitle}>{item?.users_info?.[0]?.name}</Text>
              <View style={styles.locationcontainer}>
                <Text style={styles.address}>{item.email}</Text>
              </View>
              <View style={styles.thirdcontainer}>
                <View style={styles.thirdsubcontainer}>
                  <Text style={styles.post}> Registered Date : {item.users_info[0]?.registered_date}</Text>
                </View>
              </View>
              <View style={styles.salarycontainer}>
                <Image
                  style={{ width: h(2), height: h(2) }}
                  source={locationpng}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: 'BaiJamjuree-Medium',
                    fontSize: f(1.5),
                    color: globalColors.darkblack,
                  }}>
                  {item.users_info[0]?.village?.village} ,{item.users_info[0]?.taluka?.taluka} ,{item.users_info[0]?.district?.district}
                </Text>
              </View>
            </View>
            {/* <View style={styles.salarycontainer}>
              <View style={styles.seccol}>
                <View
                  style={[
                    styles.statusbtncontainer,
                    {
                      backgroundColor:
                        item.status.toLowerCase().toString() == 'expired'
                          ? globalColors.vividred
                          : globalColors.green,
                    },
                  ]}>
                  <Text style={styles.statustxt}>{item.status}</Text>
                </View>
                <View style={styles.actionbtnconatainer}>
                  <TouchableOpacity>
                    <View style={styles.actionbtn}>
                      <Image
                        style={styles.actionbtnimg}
                        source={edit}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontSize: f(1.2),
                          fontFamily: 'BaiJamjuree-Regular',
                          color: globalColors.darkblack,
                        }}>
                        Edit
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View> */}
          </View>

          {/*  */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CompanyCardLarge;

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.white,
    elevation: 7,
    paddingHorizontal: w(4),
    paddingVertical: h(2),
    width: '90%',
    borderRadius: w(4),
    marginHorizontal: '5%',
    marginTop: h(1.5),
    marginBottom: 0,
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(1),
    borderColor: globalColors.lightgrey,
    height: w(9),
    width: w(9),
    marginStart: w(3),
    marginEnd: w(4),
    marginTop: w(1.5),
  },
  actionbtn: {
    width: w(21),
    height: w(5.6),
    borderRadius: w(0.8),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: w(1),
    alignItems: 'center',
    backgroundColor: globalColors.Magnolia,
  },
  actionbtnimg: {
    width: w(2.5),
    height: w(2.5),
  },
  actionbtnconatainer: {
    flexDirection: 'row',
    gap: w(1.3),
  },
  statusbtncontainer: {
    height: w(6),
    width: w(21),
    borderRadius: w(0.7),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: w(0.5),
    marginBottom: w(2),
  },
  statustxt: {
    color: globalColors.white,
    fontSize: f(1.5),
    fontFamily: 'BaiJamjuree-Regular',
  },
  firstrowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thirdcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h(0.8),
  },
  thirdsubcontainer: {
    flexDirection: 'row',

  },

  titlecontainer: {
    flex: 1,
    width: w(65),
    paddingLeft: w(3),
    marginTop: h(-0.3),
  },
  locationcontainer: {
    flexDirection: 'row',
    gap: w(1.5),
    marginTop: h(-0.6),
  },
  jobtitle: {
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.darkblack,
  },
  address: {
    marginStart: '0.5%',
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
  },
  salarycontainer: {
    flexDirection: 'row',
    marginTop: h(0.7),
    alignItems: 'center',
    gap: w(1),
  },
  post: {
    backgroundColor: globalColors.greishwhite,
    // paddingHorizontal: w(2.3),
    paddingVertical: h(0.3),
    // borderRadius: w(2),
    color: globalColors.navypurple,
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Medium',
  },
});
