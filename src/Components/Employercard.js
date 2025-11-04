import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { edit, locationpng, maleuser } from '../Theme/globalImages';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';

const Employercard = ({item}) => {
  const {title, location, applicants, createdDate, expiryDate, status} = item;
  const navigation = useNavigation();
  return (
    <View style={styles.maincontainer}>
      <TouchableOpacity
        style={styles.firstcol}
        onPress={() => navigation.navigate('EmployerDetails', {item})}>
        <View style={styles.firstrow}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <View style={styles.secondrow}>
          <View >
            <View style={styles.icontxtcontainer}>
              <Image
                style={styles.iconstyle}
                source={locationpng}
                resizeMode="contain"
              />
              <Text style={styles.subtitletxt}>{item.users_info[0]?.village?.village} ,{item.users_info[0]?.taluka?.taluka} ,{item.users_info[0]?.district?.district}</Text>
            </View>
            <View style={styles.icontxtcontainer}>
              <Image
                style={styles.iconstyle}
                source={maleuser}
                resizeMode="contain"
              />
              <Text style={styles.subtitletxt}>{item.email}</Text>
            </View>
          </View>
          {/* <View style={styles.seccoltxt}>
            <View style={styles.subtitletxtcontainer}>
              <Text style={styles.subtitletxt}>Created: {createdDate}</Text>
            </View>
            <View style={styles.subtitletxtcontainer}>
              <Text style={styles.subtitletxt}>Expiry Date: </Text>
              <Text style={[styles.subtitletxt, {color: globalColors.red}]}>
                {expiryDate}
              </Text>
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
      {/* <View style={styles.seccol}>
        <View
          style={[
            styles.statusbtncontainer,
            {
              backgroundColor:
                status.toLowerCase().toString() == 'expired'
                  ? globalColors.vividred
                  : globalColors.green,
            },
          ]}>
          <Text style={styles.statustxt}>{status}</Text>
        </View>
        <View style={styles.actionbtnconatainer}> */}
          {/* <TouchableOpacity>
            <View style={styles.actionbtn}>
              <Image
                style={styles.actionbtnimg}
                source={lock}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <View style={styles.actionbtn}>
              <Image
                style={styles.actionbtnimg}
                source={edit}
                resizeMode="contain"
              />
              <Text
                style={{fontSize: f(1.2), fontFamily:'BaiJamjuree-Regular',color:globalColors.darkblack}}>
                Edit
              </Text>
            </View>
          </TouchableOpacity> */}
          {/* <TouchableOpacity>
            <View style={styles.actionbtn}>
              <Image
                style={styles.actionbtnimgcross}
                source={cross}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity> */}
        {/* </View>
      </View> */}
    </View>
  );
};

export default Employercard;

const styles = StyleSheet.create({
  maincontainer: {
    marginHorizontal: '5%',
    marginTop: w(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
    paddingVertical: '3.5%',
    backgroundColor: globalColors.white,
    borderRadius: w(2),
    elevation: 4,
  },
 
  firstcol: {
    width: '75%',
    paddingBottom:w(3)

  },
  seccol: {
    width: w(25),
    justifyContent: 'flex-end',
  },
  seccoltxt: {
    marginStart: w(3.5),
  },
  title: {
    color: globalColors.darkblack,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-Bold',
    marginTop: w(-1.5),
  },
  statustxt: {
    color: globalColors.white,
    fontSize: f(1.5),
    fontFamily: 'BaiJamjuree-Regular',
  },
  iconstyle: {
    width: w(2.5),
  },

  icontxtcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w(1),
  },
  subtitletxt: {
    color: globalColors.darkblack,
    fontSize: f(1.25),
    fontFamily: 'BaiJamjuree-Regular',
  },
  subtitletxtcontainer: {
    flexDirection: 'row',
  },
  secondrow: {
    flexDirection: 'row',
    gap: w(2.5),
  },
  actionbtn: {
    width: w(21),
    height: w(5.6),
    borderRadius: w(0.8),
    justifyContent: 'center',
    flexDirection: 'row',
    gap:w(1),
    alignItems: 'center',
    backgroundColor: globalColors.Magnolia,
  },
  actionbtnimg: {
    width: w(2.5),
  },
  actionbtnimgcross: {
    width: w(3.1),
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
});
