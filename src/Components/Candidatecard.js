import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {
  candidatedemo, educationicon,
  locationpng,
  suitcase
} from '../Theme/globalImages';
import { f, h, w } from 'walstar-rn-responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import highlightText from '../Utils/HighlightText';
import { baseurl } from '../Utils/API';

export default function Candidatecard({searchQuery ,item}) {
  const {fname,lname, location, max_experience, profession} = item;

  const navigation = useNavigation();
  const showLocation = item.village?.village + item.taluka?.taluka

  return (
    <TouchableOpacity
      style={styles.MainContainer}
      onPress={() =>
        navigation.navigate('CandidateDetails', {item})
      }>
      <View>
        <Image
          resizeMode="contain"
          style={styles.Logo}
          source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : { uri: 'https://gramjob.walstarmedia.com/dashboard_assets/images/admin_img.png'}}        />
      </View>
      <View style={styles.Information}>
        <View >
          <Text style={styles.Text2}>{highlightText(`${fname} ${lname}`, searchQuery)}</Text>
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
          <Text style={styles.Textedu}>{item.education?.[0]?.name}</Text>
        </View>
        <View style={styles.SecondRow}>
          <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
          <Text style={styles.Text3}>{item.min_experience}-{item.max_experience} Year Experience</Text>
          <Image
            resizeMode="contain"
            style={{
              marginRight: w(1),
              width: w(2.45),
              height: w(2.45),
            }}
            source={locationpng}
          />
          <Text style={styles.Text3}>{showLocation.length > 25 ? `${showLocation.slice(0,23)}...` : showLocation}</Text>
        </View>
      </View>
      <View style={styles.End}>
        <View>
          <TouchableOpacity
            style={{
              backgroundColor: globalColors.activepink,
              borderRadius: w(10),
            }}
            onPress={() =>
              navigation.navigate('CandidateDetails', {item})
            }>
            <MaterialIcons
              name="keyboard-arrow-right"
              color={globalColors.white}
              size={f(2.3)}
            />
          </TouchableOpacity>
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
  },

  End: {
    marginHorizontal: w(2),
    marginVertical: w(1),
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
    marginTop: w(-1.5),
  },
  Text2: {
    color: globalColors.darkblack,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-SemiBold',
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
