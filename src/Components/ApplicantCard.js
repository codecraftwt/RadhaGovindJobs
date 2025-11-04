import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  candidatedemo,
  educationicon,
  locationpng,
  suitcase,
} from '../Theme/globalImages';
import {f, h, w} from 'walstar-rn-responsive';
import {globalColors} from '../Theme/globalColors';
import {useNavigation} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { fetchApplications, updateStatus } from '../Redux/Slices/Applicationslice';
import { useDispatch } from 'react-redux';
import { baseurl } from '../Utils/API';

export default function ApplicantCard({item}) {
  const {fname,lname, education, profession,min_experience,max_experience,village,taluka } = item?.candidate?.[0];
  const [selected, setSelected] = useState(item.interview_status == "Shortlisted"  ? "shortlist"  : item.interview_status == "Selected"  ? "Select" : item.interview_status == "Rejected" ? "reject" :null);
  const {t} = useTranslation();

 
  const dispatch = useDispatch()

  const handleSelect = (type) => {
    setSelected(type);
    const data = {
      "application_id": item.id,
      "status": type == "shortlist" ? "Shortlisted" : type == "Select" ? "Selected" : "Rejected"
    }
    dispatch(updateStatus(data))
    .then(()=>{
      dispatch(fetchApplications(item.job_id))
    })
  };

 

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.MainContainer}
      onPress={() => navigation.navigate('CandidateDetails',{ item:{user_id:item.candidate[0].user_id}, goback: 'Applications' })}>
      <View>
        <Image
          resizeMode="contain"
          style={styles.Logo}
          source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : { uri: 'https://gramjob.walstarmedia.com/dashboard_assets/images/admin_img.png'}}        />
      </View>
      <View style={styles.Information}>
        <View style={styles.FirstRow}>
          <Text style={styles.Text2}>{fname} {lname}</Text>
          <Text style={styles.Text1}>{profession}</Text>
        </View>
        <View style={styles.ThirdRow}>
          <Image
            resizeMode="contain"
            style={{
              marginRight: w(1.5),
              width: w(2.5),
              height:w(2.5)
            }}
            source={educationicon}
          />
          <Text style={styles.Textedu}>{education?.[0]?.name}</Text>
        </View>
        <View style={styles.SecondRow}>
          <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
          <Text style={styles.Text3}>{min_experience} - {max_experience} Year Experience</Text>
          <Image
            resizeMode="contain"
            style={{
              marginRight: w(1),
              width: w(2.45),
              height:w(2.45)
            }}
            source={locationpng}
          />
          <Text style={styles.Text3}>{village?.village} , {taluka?.taluka}</Text>
        </View>
      </View>
      <View style={styles.End}>
        {item.interview_status == "Review" ? <TouchableOpacity
          style={{
            backgroundColor: selected === 'shortlist'
            ? globalColors.activepink
            : globalColors.white,
            borderRadius: w(3),
          }}
          onPress={() => handleSelect('shortlist')}>
          <Text
            style={{
              color: selected === 'shortlist'
              ? globalColors.white
              : globalColors.grey,
              borderWidth:w(0.1),
              borderRadius:w(3),
              borderColor:selected === 'shortlist'
              ? globalColors.activepink
              : globalColors.grey,
              fontSize: f(1.25),
              fontFamily: 'BaiJamjuree-Regular',
              paddingHorizontal: w(2),
              paddingVertical: w(0.7),
            }}>
            {t("Shortlist")}
          </Text>
        </TouchableOpacity>
        : item.interview_status == "Rejected" ? <TouchableOpacity
        style={{
          backgroundColor: selected === 'shortlist'
          ? globalColors.activepink
          : globalColors.white,
          borderRadius: w(3),
        }}
        onPress={() => handleSelect('shortlist')}>
        <Text
          style={{
            color: selected === 'shortlist'
            ? globalColors.white
            : globalColors.grey,
            borderWidth:w(0.1),
            borderRadius:w(3),
            borderColor:selected === 'shortlist'
            ? globalColors.activepink
            : globalColors.grey,
            fontSize: f(1.25),
            fontFamily: 'BaiJamjuree-Regular',
            paddingHorizontal: w(2),
            paddingVertical: w(0.7),
          }}>
          {t("Shortlist")}
        </Text>
      </TouchableOpacity> :
        <TouchableOpacity
          style={{
            backgroundColor: selected === 'Select'
            ? globalColors.activepink
            : globalColors.white,
            borderRadius: w(3),
          }}
          onPress={() => handleSelect('Select')}>
          <Text
            style={{
              color: selected === 'Select'
              ? globalColors.white
              : globalColors.grey,
              borderWidth:w(0.1),
              borderRadius:w(3),
              borderColor:selected === 'Select'
              ? globalColors.activepink
              : globalColors.grey,
              fontSize: f(1.25),
              fontFamily: 'BaiJamjuree-Regular',
              paddingHorizontal: w(2),
              paddingVertical: w(0.7),
            }}>
            {t("Select")}
          </Text>
        </TouchableOpacity>}
        <TouchableOpacity
          style={{
            backgroundColor:
              selected === 'reject'
                ? globalColors.activepink
                : globalColors.white,
            borderRadius: w(3),
          }}
          onPress={() => handleSelect('reject')}>
          <Text
             style={{
                color: selected === 'reject'
                ? globalColors.white
                : globalColors.grey,
                borderWidth:w(0.1),
                borderRadius:w(3),
                borderColor:selected === 'reject'
                ? globalColors.activepink
                : globalColors.grey,
                fontSize: f(1.25),
                fontFamily: 'BaiJamjuree-Regular',
                paddingHorizontal: w(3.1),
                paddingVertical: w(0.7),
            }}>
            {t('Reject')}
          </Text>
        </TouchableOpacity>
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
    marginTop: w(1),
    marginHorizontal: '5%',
    marginBottom: '1%',
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
    marginTop: w(-0.5),
  },
  ThirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width:w(90),
  },

  End: {
    marginHorizontal: w(2),
    marginVertical: w(1),
    flexDirection: 'row',
    height: w(6),
    gap: w(1),
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(20),
    height: w(10),
    width: w(10),
    marginEnd: w(4),
    marginStart: w(2),
  },
  Text1: {
    color: globalColors.navypurple,
    fontSize: f(1.55),
    fontFamily: 'BaiJamjuree-Regular',
    marginBottom: h(0.4),
  },
  Text2: {
    color: globalColors.darkblack,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-Bold',
    marginTop: w(-1.5),
  },
  Text3: {
    marginEnd: w(4),
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.4),
  },
  Textedu: {
    marginEnd: w(4),
    color: globalColors.navypurple,
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.4),
  },
  Logo1: {
    marginRight: w(1.5),
    width: w(3),
    height:w(3)
  },
});
