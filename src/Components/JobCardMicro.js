import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import { f, h, w } from 'walstar-rn-responsive';
import { jobsdemo, Rgjobs } from '../Theme/globalImages';
import { baseurl } from '../Utils/API';

const JobCardMicro = ({item , navigateto}) => {
  const navigation = useNavigation();

  return (
      <TouchableOpacity
      style={styles.container}
        onPress={() => navigation.navigate(`${navigateto}`, {item})}>
          <View style={styles.firstrowcontainer}>
            <Image
              style={styles.cardimage}
              resizeMode="contain"
              source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs}
            />
            <View style={styles.titlecontainer}>
              <Text style={styles.jobtitle}>{item.title}</Text>
              <View style={styles.locationcontainer}>
                <Text style={styles.companytitle}>{item.user?.name}</Text>
                <Text style={styles.companytitle}>{item.location}</Text>
              </View>
            </View>
          </View>
          <View style={{justifyContent:'center'}}>
              <Text style={styles.post}>{item.job_type?.job_type_name}</Text>
            </View>
      </TouchableOpacity>
  );
};

export default JobCardMicro;

const styles = StyleSheet.create({
  firstrowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex:1
    
  },
  container:{
    backgroundColor: globalColors.white,
    elevation: 3,
    paddingHorizontal: w(4),
    width:'90%',
    paddingVertical: h(2),
    borderRadius: w(3),
    marginHorizontal: '5%',
    marginTop: h(1.5),
    marginBottom: 0,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  titlecontainer: {
    flex: 1,
    paddingLeft: w(3),
    marginTop: h(-0.3),
  },
  locationcontainer: {
    flexDirection: 'row',
    gap: w(1.5),
    marginTop: h(-0.6),
  },
  cardimage: {
    height: w(9.5),
    width: w(9.5),
    borderRadius: w(1.7),
    alignSelf:'center'
  },
  jobtitle: {
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.darkblack,
  },
  companytitle: {
    fontSize: f(1.5),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
  },

  post: {
    backgroundColor: globalColors.greishwhite,
    paddingHorizontal: w(2.3),
    paddingVertical: h(0.3),
    borderRadius: w(2),
    color: globalColors.navypurple,
    fontSize: f(1.45),
    fontFamily: 'BaiJamjuree-Medium',
  },
});
