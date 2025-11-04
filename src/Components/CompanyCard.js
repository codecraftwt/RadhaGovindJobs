import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { jobsdemo, locationpng, Rgjobs, suitcase, wallet } from '../Theme/globalImages';
import {
  f,
  h,
  w,
} from 'walstar-rn-responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SavedCompany, unSavedCompany } from '../Redux/Slices/Employerslice';
import { baseurl } from '../Utils/API';
  
  export default function CompanyCard({item}) {
  
    // const dispatch = useDispatch();
    // const bookmarkedCompany = useSelector(state => state.employers.SavedCompany);
  
    // const isBookmarked = bookmarkedCompany.find(employer => employer.id === item.id);
  
    // const handleBookmarkToggle = () => {
    //   if (isBookmarked) {
    //     dispatch(unSavedCompany({ id: item.id }));
    //   } else {
    //     dispatch(SavedCompany({ id: item.id, item}));
    //   }
    // };
  
   
    const navigation = useNavigation()
  
    return (
      <View style={styles.MainContainer}>
        <View>
          <Image resizeMode="contain" style={styles.Logo} source={item?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs} />
        </View>
        <TouchableOpacity style={styles.Information} onPress={()=>navigation.navigate('EmployerDetails',{item})}>
          <View  style={{marginBottom:w(1),gap:w(-1.5)}}>
            <Text style={styles.Text2}>{item.users_info[0]?.name}</Text>
            <Text style={styles.Text1}>{item.email}</Text>
          </View>
          <View style={styles.SecondRow}>
            <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
            <Text style={styles.Text3}>
            Registered Date : {item.users_info[0]?.registered_date}
            </Text>
          </View>
          <View style={styles.ThirdRow}>
            <Image
              resizeMode="contain"
              style={{
                marginRight: w(1.5),
                width: w(2.6),
                height:w(2.6)
              }}
              source={locationpng}
            />
            <Text style={styles.Text3}>{item.users_info[0]?.village?.village} ,{item.users_info[0]?.taluka?.taluka} ,{item.users_info[0]?.district?.district}</Text>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.End}>
          <View>
            <TouchableOpacity onPress={handleBookmarkToggle}>
            {isBookmarked ? (
              <MaterialCommunityIcons
                name="bookmark"
                color={globalColors.navypurple}
                size={f(3.1)}
              />
            ) : (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={globalColors.navypurple}
                size={f(3.2)}
              />
            )}
            </TouchableOpacity>
            <Text style={styles.Text5}>24h</Text>
          </View>
        </View> */}
      </View>
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
      borderRadius: w(4),
      justifyContent: 'space-between',
      elevation: 4,
    },
  
    Information: {
      flex: 1,
    },
    SecondRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginTop: w(-1),
    },
    ThirdRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  
    End: {
      marginHorizontal: w(2.5),
      marginVertical: w(2.5),
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
    Text1: {
      color: globalColors.navypurple,
      fontSize: f(1.45),
      fontFamily: 'BaiJamjuree-Regular',
    },
    Text2: {
      color: globalColors.darkblack,
      fontSize: f(2.10),
      fontFamily: 'BaiJamjuree-Bold',
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
      fontFamily: 'BaiJamjuree-Regular',
      fontSize: f(1.7),
      fontWeight: '400',
      marginLeft: w(0.5),
    },
    Logo1: {
      marginRight: w(1.5),
      width: w(3.2),
      height:w(3.2)
    },
  });
  