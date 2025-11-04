import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState} from 'react';
import { dustbin, edit, jobsdemo, locationpng, Rgjobs, suitcase, wallet } from '../Theme/globalImages';
import { f, h, w } from 'walstar-rn-responsive';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Saved, deleteJobData, unSaved } from '../Redux/Slices/Jobslice';
import DeleteModal from './DeleteModal';
import usePermissionCheck from '../Utils/HasPermission';
import { useTranslation } from 'react-i18next';
import { baseurl } from '../Utils/API';

export default function EmployerJobCard({ item, navigateto }) {
  const dispatch = useDispatch();
  const bookmarkedJobs = useSelector(state => state.jobs.SavedJobs);
  // const isBookmarked = bookmarkedJobs.find(job => job.id === item.id);
  const isBookmarked = bookmarkedJobs?.some(job => job?.id === item?.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      dispatch(unSaved({ id: item.id }));
    } else {
      dispatch(Saved({ id: item.id, item }));
    }
  };

  const {t} = useTranslation();

  const navigation = useNavigation();

  const deleteJob=()=>{
    dispatch(deleteJobData(item.id))
  }

  const hasPermission = usePermissionCheck()

  return (
    <View style={styles.MainContainer}>
      <DeleteModal visible={showDeleteModal} onDelete={deleteJob} itemName={`${item.title} Job`} onCancel={() => setShowDeleteModal(false)} />
      <View>
        <Image resizeMode="contain" style={styles.Logo} 
       source={item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { uri: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } :  Rgjobs}
        />
      </View>
      <TouchableOpacity
        style={styles.Information}
        onPress={() => navigation.navigate(`JobDetails`, { item , goback:'JobListMnt'})}>
        <View>
          <Text style={styles.Text1}>{item.user?.name}</Text>
          <Text style={styles.Text2}>{item.title}</Text>
        </View>
        <View style={styles.SecondRow}>
          <Image resizeMode="contain" style={styles.Logo1} source={suitcase} />
          <Text style={styles.Text3}>
            {item.min_experience}-{item.max_experience} Years
          </Text>
          <Image resizeMode="contain" style={styles.Logo1} source={wallet} />
          <Text style={styles.Text4}>
            {item.max_salary > 1000
              ? `${item.max_salary.slice(0, -3)}k/Month`
              : `${item.max_salary}/Month`}
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
          <Text style={styles.Text3}>{item.location}</Text>
          <View style={{ position: 'absolute', right: -w(15), top: w(0.5) }}>
            {hasPermission('Manage Applicants') &&(
              <TouchableOpacity
              style={{
                backgroundColor: globalColors.commonpink,
                borderRadius: w(3),
              }}
              onPress={() => navigation.navigate('Applications',{JobId:item.id})}>
              <Text
                style={{
                  color: globalColors.white,
                  fontSize: f(1.25),
                  fontFamily: 'BaiJamjuree-Regular',
                  paddingHorizontal: w(5),
                  paddingVertical: w(0.6)

                }}>
                {t("Manage Employee")}
              </Text>
            </TouchableOpacity>

            )}
          </View>
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
      <View style={styles.End}>
        <View>
        {hasPermission('Jobs Update') && (
          <TouchableOpacity onPress={() => navigation.navigate('AddJob',{ item, updatejob: true })}>
            <View style={styles.actionbtn}>
              <Image
                style={styles.actionbtnimg}
                source={edit}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>)}
          {hasPermission('Jobs Delete') && (
            <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
            <View style={[styles.actionbtn, { marginTop: w(1) }]}>
              <Image
                style={[styles.actionbtnimg, { tintColor: globalColors.red }]}
                source={dustbin}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          )}
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
    marginTop: w(-1),
  },
  ThirdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  End: {
    marginHorizontal: w(2.5),
  },
  actionbtn: {
    width: w(12),
    height: w(6.5),
    borderRadius: w(0.8),
    justifyContent: 'center',
    flexDirection: 'row',
    gap: w(1),
    alignItems: 'center',
    backgroundColor: globalColors.white,
    elevation: 3
  },
  actionbtnimg: {
    width: w(3.5),
    height: w(3.5),
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
    fontSize: f(2.05),
    fontFamily: 'BaiJamjuree-SemiBold',
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
