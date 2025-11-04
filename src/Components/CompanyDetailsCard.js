import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { f, h, w } from 'walstar-rn-responsive';
import {
  jobsdemo,
  locationpng,
  Rgjobs,
  suitcase,
  user,
  wallet,
} from '../Theme/globalImages';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useDispatch, useSelector } from 'react-redux';
import { SavedCompany, unSavedCompany } from '../Redux/Slices/Employerslice';
import { baseurl } from '../Utils/API';

const CompanyDetailsCard = ({ item }) => {
  const dispatch = useDispatch();
  const bookmarkedCompany = useSelector(state => state.employers.SavedCompany);

  const isBookmarked = bookmarkedCompany.find(employer => employer.id === item?.id);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      dispatch(unSavedCompany({ id: item?.id }));
    } else {
      dispatch(SavedCompany({ id: item?.id, item }));
    }
  };

  return (
    <View style={styles.jobDetailContainer}>
      <View style={styles.jobDetailsCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: w(2) }}>
          <Image resizeMode="contain" style={styles.Logo} source={item?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs} />
          <View style={{ marginTop: w(1) }}>
            <Text style={styles.Text1}>{item?.email}</Text>
            <Text style={styles.Text2}>{item?.name}</Text>
          </View>
        </View>
        

        <View style={styles.detailItem}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={locationpng}
          />
          <Text style={styles.detailText}>{item?.users_info?.[0]?.village?.village} ,{item?.users_info?.[0]?.taluka?.taluka} ,{item?.users_info?.[0]?.district?.district}</Text>
        </View>
        <View style={styles.detailItem}>
          <Image
            style={styles.icon}
            resizeMode="contain"
            source={wallet}
          />
          <Text style={styles.detailText}>{item?.users_info?.[0]?.website_url}</Text>
        </View>
        <View style={styles.detailItem}>
          <Image
            resizeMode="contain"
            source={suitcase}
            style={styles.icon}
          />
          <Text style={styles.detailText}>
            Registered Date : {item?.users_info?.[0]?.registered_date}
          </Text>
        </View>
        {/* <View style={styles.horizontalRule} />
        

        <View style={styles.userDetails}>
          <View style={styles.totalApplicant}>
            <Image resizeMode="contain" source={user} style={styles.icon} />
            <Text style={styles.detailText}>32 applicants</Text>
          </View>
          <View style={styles.postedDetails}>
            <Text style={styles.detailText}>Posted 18 hrs ago</Text>
          </View>
        </View> */}
      </View>
      {/* <View style={styles.bookmarkContainer}>
        <TouchableOpacity onPress={handleBookmarkToggle}>
          {isBookmarked ? (
            <MaterialCommunityIcons
              name="bookmark"
              color={globalColors.navypurple}
              size={f(2.9)}
            />
          ) : (
            <MaterialCommunityIcons
              name="bookmark-outline"
              color={globalColors.navypurple}
              size={f(3)}
            />
          )}
        </TouchableOpacity>
        <Text style={{ color: globalColors.darkblack, fontSize: f(1.65), fontFamily: 'BaiJamjuree-Regular' }}>24h</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  jobDetailContainer: {
    flexDirection: 'row',
    margin: h(2),
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: globalColors.white,
    elevation: 2
  },
  jobDetailsCard: {
    paddingHorizontal: h(1),
    paddingVertical: h(1.5),
    flex: 1,
  },
  Logo: {
    borderWidth: 1,
    borderRadius: w(1),
    borderColor: globalColors.lighGray,
    height: w(10),
    width: w(10),
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

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(1),
    marginHorizontal: h(1),
    fontFamily: 'BaiJamjuree-Medium',
  },
  icon: {
    width: h(1.7),
    height: h(1.7),
    tintColor: globalColors.black
  },
  detailText: {
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.suvagrey,
    fontSize: f(1.53),
    paddingHorizontal: h(1),
  },
  horizontalRule: {
    borderBottomColor: globalColors.suvagrey,
    borderBottomWidth: h(0.1),
    marginVertical: h(0.5),
    marginEnd: w(-13)
  },
  userDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h(0.5),
  },
  totalApplicant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: h(14),
    marginLeft: h(1),
  },

  bookmarkContainer: {
    paddingVertical: h(2.4),
    paddingHorizontal: h(2),
  },
});

export default CompanyDetailsCard;
