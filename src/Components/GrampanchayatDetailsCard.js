import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import {
  locationpng,
  phone,
} from '../Theme/globalImages';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { baseurl } from '../Utils/API';

export default function GrampanchayatDetailsCard({item}) {

  return (
    <View
      style={styles.MainContainer}>
      <View>
        <Image
          resizeMode="contain"
          style={styles.Logo}
          source={item?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : { uri: 'https://gramjob.walstarmedia.com/dashboard_assets/images/admin_img.png'}}        />
      </View>
      <View style={styles.Information}>
        <View style={styles.FirstRow}>
          <Text style={styles.Text2}>{item?.name}</Text>
          <Text style={styles.Text1}>{item?.email}</Text>
        </View>
        <View style={styles.ThirdRow}>
          <Image
            resizeMode="contain"
            style={{
              marginRight: w(1),
              width: w(2.65),
              height:w(2.65),
              tintColor: globalColors.darkblack,
            }}
            source={locationpng}
          />
          <Text style={styles.Text3}>{item?.users_info[0]?.address},{item?.users_info[0]?.village?.village} , {item?.users_info[0]?.taluka?.taluka}</Text>
        </View>
        <View style={styles.ThirdRow}>
          <Image resizeMode="contain" style={styles.Logo1} source={phone} />
          <Text style={styles.Textedu}>{item?.contact_number}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flexDirection: 'row',
    paddingVertical: w(2),
    paddingHorizontal: w(1),
    marginTop: w(1),
    marginHorizontal: h(2),
    marginBottom: '1%',
    borderRadius: w(4),
    justifyContent: 'space-between',
    elevation: 4,
    backgroundColor: globalColors.white,
    marginTop: h(2),
  },

  Information: {
    flex: 1,
  },
  ThirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  Logo: {
    borderWidth: 1,
    borderRadius: w(20),
    height: w(12),
    width: w(12),
    marginEnd: w(4.5),
    marginStart: w(3),
    marginTop: w(1),
  },
  Text1: {
    color: globalColors.darkblack,
    height: h(3.3),
    fontSize: f(1.65),
    fontFamily: 'BaiJamjuree-Regular',
    marginBottom: h(0.4),
  },
  Text2: {
    color: globalColors.darkblack,
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  Text3: {
    marginEnd: w(4),
    color: globalColors.suvagrey,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.53),
  },
  Textedu: {
    marginEnd: w(4),
    color: globalColors.suvagrey,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.53),
  },
  Logo1: {
    marginRight: w(1.5),
    width: w(3),
    height:w(3),
    tintColor: globalColors.darkblack,
  },
});
