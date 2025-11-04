import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import { baseurl } from '../Utils/API';

export default function Consultantcard({item}) {

  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.MainContainer}
      onPress={() =>
        navigation.navigate('ConsultantDetails', { item })
      }>
      <View>
        <Image
          resizeMode="contain"
          style={styles.Logo}
          source={item?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : { uri: 'https://gramjob.walstarmedia.com/dashboard_assets/images/admin_img.png'}}        />
      </View>
      <View style={styles.Information}>
        <View style={styles.FirstRow}>
          <Text style={styles.Text2}>{item.name}</Text>
        </View>
        <View style={styles.SecondRow}>
          <Text style={styles.Text1}>{item.email}  </Text>
          {/* <Image
            resizeMode="contain"
            style={{
              marginRight: w(0.7),
              width: w(2.22),
            }}
            source={locationpng}
          />
          <Text style={styles.Text1}>{location}</Text> */}
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
              navigation.navigate('ConsultantDetails', { item })
            }
            >
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
    paddingVertical: w(3),
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
    marginTop: w(0.5),
    alignItems: 'center',
  },

  End: {
    marginHorizontal: w(-3),
    marginVertical: w(3.5),
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(1),
    height: w(10),
    width: w(10),
    marginEnd: w(4),
    marginStart: w(2),
    marginTop: w(1.1),
  },
  Text1: {
    color: globalColors.navypurple,
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Regular',
    marginBottom: h(0.4),
  },
  Text2: {
    color: globalColors.darkblack,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-Bold',
  },
});
