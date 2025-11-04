import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import { edit } from '../../../Theme/globalImages';
import ApplyBtn from '../../../Components/applyBtn';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ImagePickerModal from '../../../Components/ImagePickerModal';
import { useSelector , useDispatch } from 'react-redux';
import { fetchProfile } from '../../../Redux/Slices/ProfileSlice';
import { 
  deleteAdmin,
  deleteCandidate,
  deleteEmployer,
  deleteConsultant,
  deleteInstitute,
  deleteGram ,
  clearDeleteState 
} from '../../../Redux/Slices/deleteSlice'; // ← ADDED
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfirmDeleteModal from '../../../Components/SuccessModal';
import { baseurl } from '../../../Utils/API';
import { updateCandidates } from '../../../Redux/Slices/Candidateslice';

const ProfileDetails = () => {

    const id = useSelector(state => state?.Permissions.userId);
    const deleteState = useSelector(state => state.delete); 

    const dispatch = useDispatch();

    const [updatesPrifile, setUpdatesPrifile] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    
    const candidates = useSelector(state => state.Profile.ProfileDetails);
    const loading = useSelector(state => state.Profile.loading);

    const [profile, setProfile] = useState(
      candidates?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file 
        ? `${baseurl}/${candidates?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` 
        : 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'
    );

    const roles = [
      { role_id: 1, role: "admin", action: deleteAdmin }, 
      { role_id: 2, role: "candidate", action: deleteCandidate }, 
      { role_id: 3, role: "employer", action: deleteEmployer }, 
      { role_id: 4, role: "consultant", action: deleteConsultant }, 
      { role_id: 5, role: "institute", action: deleteInstitute },
      { role_id: 6, role: "gram", action: deleteGram } 
    ];

    useEffect(() => {
      if (id != null) {
        dispatch(fetchProfile(id))
      }
    }, [id, updatesPrifile]);

    // Update profile when image changes
    useEffect(() => {
      console.log("printing calling",candidates)
      if (candidates != null && profile?.data) {
        const eduID = candidates?.education?.map(item => String(item.id));
        const skillID = candidates?.skills?.map(item => String(item.id));
        
        const payload = {
          profile: profile?.data,
          user_id: candidates?.user_id,
          fname: candidates?.fname ||candidates?.name,
          middle_name: candidates?.middle_name,
          lname: candidates?.lname,
          email: candidates?.email,
          min_experience: candidates?.min_experience,
          max_experience: candidates?.max_experience,
          state_id: candidates?.state_id,
          district_id: candidates?.district_id,
          gender: candidates?.user?.gender,
          profession: candidates?.profession,
          taluka_id: candidates?.taluka_id,
          village_id: candidates?.village_id,
          zipcode: candidates?.zipcode,
          dob: candidates?.dob,
          phone: candidates?.contact_number_1,
          contact_number_2: candidates?.contact_number_2,
          address_line_1: candidates?.address_line_1,
          address_line_2: candidates?.address_line_2,
          aadhar_no: candidates?.aadhar_no,
          pancard_no: candidates?.pancard_no,
          blood_group: candidates?.blood_group,
          job_location: candidates?.job_location,
          passout_year: candidates?.passout_year,
          college_name: candidates?.college_name,
          description: candidates?.description,
          job_category_id: ["1"],   
          education: eduID,       
          skill: skillID,    
        };

        if (payload.email == null) return;

        dispatch(updateCandidates({ id: candidates?.id, data: payload }))
          .then(async () => {
            setUpdatesPrifile(pre => !pre);
            
            // Update AsyncStorage with new profile image
            const usertest = await AsyncStorage.getItem('user');
            if (usertest) {
              const userData = JSON.parse(usertest);
              const updatedUserData = {
                ...userData,
                document: userData.document.map(doc =>
                  doc.document_type == "profile"
                    ? { ...doc, document_file: `${profile}` }
                    : doc
                )
              };
              await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
            }
          })
          .catch(error => {
            console.log('Profile update error:', error);
            Alert.alert('Error', 'Failed to update profile image');
          });
      }
    }, [profile?.data]);

    // Update profile state when candidates data loads
    useEffect(() => {
      if (candidates?.user?.document?.length > 0) {
        const profileDoc = candidates.user.document.find(doc => doc.document_type === 'profile')?.document_file;
        const profileUrl = `${baseurl}/${profileDoc}`;
        if (profileUrl) {
          setProfile(profileUrl);
        }
      }
    }, [candidates]);

    const handleDeleteAccount = () => {
      const userRole = roles.find(role => role.role_id === candidates?.user?.role_id);

      if (!userRole) {
        Alert.alert("Error", "Unable to determine your account type.");
        return;
      }

      setSelectedRole(userRole);
      setDeleteModalVisible(true);
    };

    useEffect(() => {
      if (deleteState.success && deleteState.deletedRole) {
        console.log(`${deleteState.deletedRole} account deleted successfully`);

        const clearStorageAndNavigate = async () => {
          try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            console.log('AsyncStorage cleared successfully');

            Alert.alert(
              "Success",
              `Your ${deleteState.deletedRole} account has been deleted successfully.`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.replace('Auth');
                    dispatch(clearDeleteState());
                  }
                }
              ]
            );
          } catch (storageError) {
            console.log('Error clearing AsyncStorage:', storageError);
            navigation.replace('Auth');
            dispatch(clearDeleteState());
          }
        };

        clearStorageAndNavigate();
      }

      if (deleteState.error) {
        console.log("Delete error:", deleteState.error);
        Alert.alert(
          "Error",
          `Failed to delete account: ${deleteState.error.message || deleteState.error}`
        );
        dispatch(clearDeleteState());
      }
    }, [deleteState.success, deleteState.error, deleteState.deletedRole, dispatch, navigation]);



    const buttonText = () => {
      return (
         <TouchableOpacity 
          style={styles.buttonContent}
          onPress={handleDeleteAccount}
          disabled={deleteState.loading}
        >
          <MaterialIcons
            name="delete-outline"
            size={w(6)}
            color={deleteState.loading ? globalColors.grey : globalColors.white}
            style={styles.icon}
          />
          <Text
            style={{
              fontFamily: 'BaiJamjuree-Bold',
              color: deleteState.loading ? globalColors.grey : globalColors.white,
              fontSize: f(1.8),
              textAlign: 'center',
            }}>
            {deleteState.loading ? 'Deleting...' : 'Delete Account'} 
          </Text>
        </TouchableOpacity>
      );
    };
    

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const navigation = useNavigation();
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:globalColors.backgroundshade,flex:1}}>
        <LinearGradient
          colors={[
            globalColors.purplemedium1,
            globalColors.purplemedium2,
            globalColors.purplemedium1,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{height: h(4)}}>
          <StatusBar backgroundColor="transparent" translucent />
        </LinearGradient>
        <View style={styles.profileImgContainer}>
          <LinearGradient
            colors={[
              globalColors.purplemedium1,
              globalColors.purplemedium2,
              globalColors.purplemedium1,
            ]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{height: w(25), marginBottom: h(13.5)}}>
            <View style={styles.crossContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('bottomnavigation', {screen: 'Home'})}>
                <MaterialIcons
                  name="close"
                  size={h(4)}
                  color={globalColors.white}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{alignItems: 'center', justifyContent: 'space-between'}} onPress={openModal}>
              <Image
                resizeMode="cover"
                source={
                  profile
                    ? typeof profile === 'string' && profile.startsWith('http')
                      ? { uri: profile }
                      : typeof profile === 'string'
                      ? { uri: `data:image/jpeg;base64,${profile}` }
                      : { uri: 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg' }
                    : { uri: 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg' }
                }
                style={styles.userImage}
              />
             <Image resizeMode='contain' style={{position:'absolute',left:'55%',top:'55%',height:w(5),marginTop:w(5),tintColor:globalColors.black}} source={edit}/>
            </TouchableOpacity>
            <View style={styles.userNameContainer}>
              <Text
                style={{
                  marginTop: h(1),
                  fontSize: f(2),
                  fontFamily: 'BaiJamjuree-Bold',
                  color: globalColors.darkblack,
                }}>
                {candidates?.name || `${candidates?.fname} ${candidates?.lname}`}
              </Text>
            </View>
            <View style={styles.horizontalRule} />
          </LinearGradient>
        </View>
        <View style={styles.userDetailsContanier}>
          <Text style={styles.userDetailsText}>
            <Text>Email Address</Text>{'   '}
            <Text style={styles.semidetails}>
              {candidates?.email}
            </Text>
          </Text>
          <View style={styles.horizontalRule2} />
          <Text style={styles.userDetailsText}>
            <Text>Address</Text>{'   '}
            <Text style={styles.semidetails}>
              {[
                candidates?.state?.state,
                candidates?.district?.district,
                candidates?.taluka?.taluka,
                candidates?.village?.village,
                candidates?.zipcode,
              ]
              .filter(Boolean) // remove null/undefined/empty
                .join(", ")}
            </Text>
          </Text>
          <View style={styles.horizontalRule2} />
          <Text style={styles.userDetailsText}>
            <Text>Mobile No</Text>{'   '}
            <Text style={styles.semidetails}>
            {/* 7889887950 */}
              {candidates?.contact_number || candidates?.contact_number_1 || candidates?.contact_number_2}
            </Text>
          </Text>
          <View style={styles.horizontalRule2} />
          <Text style={styles.userDetailsText}>
            <Text>Gst No</Text>{'   '}
            <Text style={styles.semidetails}>{candidates?.gst_no}</Text>
          </Text>
          <View style={styles.horizontalRule2} />
          <Text style={styles.userDetailsText}>
            <Text>Website</Text>{'   '}
            <Text style={styles.semidetails}>{candidates?.website_url}</Text>
          </Text>
          <View style={styles.horizontalRule2} />
        </View>
        <View style={styles.btnContainer}>
          <ApplyBtn buttonText={buttonText()} />
        </View>
        <ImagePickerModal
              visible={modalVisible}
              onClose={closeModal}
              setProfile={setProfile}
              noimg={true}
              setDefaultImage={true}
            />
            <ConfirmDeleteModal
              visible={deleteModalVisible}
              role={selectedRole?.role}
              loading={deleteState.loading}
              onCancel={() => setDeleteModalVisible(false)}
              onConfirm={() => {
                dispatch(selectedRole.action(id));
                setDeleteModalVisible(false);
              }}
            />
      </ScrollView>
    );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  userImage: {
    borderRadius: h(10),
    borderWidth: h(0.4),
    height: w(27),
    width: w(27),
    borderColor: globalColors.white,
  },
  userNameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  semidetails: {    fontSize: f(1.6),
    color: globalColors.grey, fontFamily: 'BaiJamjuree-Medium'},
  horizontalRule: {
    borderBottomColor: globalColors.purplegrey,
    borderBottomWidth: h(0.1),
    marginTop: h(2),
    marginBottom: h(1),
    marginHorizontal: h(3),
  },
  userDetailsContanier: {
    marginTop: h(0),
    marginHorizontal: h(2),
  },
  horizontalRule2: {
    borderBottomColor: globalColors.purplegrey,
    borderBottomWidth: h(0.1),
    marginVertical: h(1),
  },
  userDetailsText: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.darkblack,
    marginTop: h(2),
  },
  btnContainer: {
    marginHorizontal: w(20),
    marginVertical: h(3),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: w(2),
  },
  crossContainer: {
    alignItems: 'flex-end',
    marginHorizontal: h(2),
    marginTop: h(2),
  },
});
