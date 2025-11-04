import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {locationpng, Rgjobs, suitcase, wallet } from '../Theme/globalImages';
import {
  f,
  h,
  w,
} from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { baseurl } from '../Utils/API';
import { useNavigation } from '@react-navigation/native';
  
  export default function JobStatusCard({item}) {
    const navigation =useNavigation()
 
  
    return (
      <TouchableOpacity style={styles.MainContainer} 
      onPress={()=>navigation.navigate(`JobDetails`,{item:{id:item.job_id}, goback:'AppliedJobs'})}>
        <View>
          <Image resizeMode="contain" style={styles.Logo} source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs} />
        </View>
        <View style={styles.Information} >
          <View >
            <Text style={styles.Text1}>{item?.job?.user?.name}</Text>
            <Text style={styles.Text2}>{item?.job?.title}</Text>
          </View>
          <View style={styles.SecondRow}>
            <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
            <Text style={styles.Text3}>
            {item?.job?.min_experience}-{item?.job?.max_experience} Years
            </Text>
            <Image resizeMode="contain" style={styles.Logo1} source={wallet} />
            <Text style={styles.Text4}>{item?.job?.max_salary > 1000
                    ? `${item?.job?.max_salary.slice(0, -3)}k/Month`
                    : `${item?.job?.max_salary}/Month`}</Text>
          </View>
          <View style={styles.ThirdRow}>
            <Image
              resizeMode="contain"
              style={{
                marginRight: w(1.5),
                width: w(2.6),
              }}
              source={locationpng}
            />
            <Text style={styles.Text3}>{item?.job?.location}</Text>
          </View>
        </View>
        <View style={styles.End}>
          <View>
            <Text style={styles.Text5}>{item?.interview_status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    MainContainer: {
      flexDirection: 'row',
      paddingVertical: w(2),
      paddingHorizontal: w(1),
      backgroundColor: globalColors.white,
      marginHorizontal: '5%',
      marginBottom: h(2),
      borderRadius: w(2),
      justifyContent: 'space-between',
      elevation: 4,
    },
  
    Information: {
      flex: 1,
    },
    SecondRow: {
      flexDirection: 'row',
      marginTop: w(1),
      alignItems: 'center',
      height:h(3),
      marginTop: w(-1),
    },
    ThirdRow: {
      flexDirection: 'row',
      alignItems: 'center',
      height:h(3)
    },
  
    End: {
      marginHorizontal: w(2.5),
      marginVertical: w(2.5),
    },
    Logo: {
      borderWidth: 1,
      borderRadius: w(1),
      borderColor: globalColors.lighGray,
      height: w(9),
      width: w(9),
      marginStart: w(3),
      marginEnd: w(4),
      marginTop: w(1.5),
    },
    Text1: {
      color: globalColors.navypurple,
      fontSize: f(1.45),
      fontFamily: 'BaiJamjuree-Regular',
    },
    Text2: {
      color: globalColors.darkblack,
      fontSize: f(2.10),
      fontFamily: 'BaiJamjuree-Bold',
      marginTop: w(-1.5),
    },
    Text3: {
      marginEnd: w(5),
      color: globalColors.suvagrey,
      fontFamily: 'BaiJamjuree-Regular',
      fontSize: f(1.45),
    },
    Text4: {
      color: globalColors.suvagrey,
      fontFamily: 'BaiJamjuree-Regular',
      fontSize: f(1.45),
    },
    Text5: {
      color: globalColors.darkblack,
      fontFamily: 'BaiJamjuree-SemiBold',
      fontSize: f(1.55),
      fontWeight: '400',
      marginLeft: w(0.5),
    },
    Logo1: {
      marginRight: w(1.5),
      width: w(3.2),
    },
  });
  