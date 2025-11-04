import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import {
  edit,
  email,
  phone,
  upload,
  user,
  userprofileedit
} from '../../../Theme/globalImages';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ImagePickerModal from '../../../Components/ImagePickerModal';
import { useSelector , useDispatch } from 'react-redux';
import { fetchProfile } from '../../../Redux/Slices/ProfileSlice';
// import DocumentUpload from '../../../Components/DocumentUpload';
import EditProfileModal from '../Candidate/EditProfile';
import {baseurl} from '../../../Utils/API'
import { updateCandidates } from '../../../Redux/Slices/Candidateslice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Grid Item Component - Updated to receive navigation prop
const ProfileGridItem = ({  label, value, onEdit, resumeFile, navigation }) => (
  <TouchableOpacity 
    style={[
    styles.gridItem,
    { width: label == "DOB" || label == "Blood Group" || label == "Passout Year" || label == "Experience" ? w(38) : w(84) },
  ]}
    onPress={() => {
      if (label === 'View Resume' && resumeFile) {
        onEdit(resumeFile);
      } else if (onEdit) {
        onEdit();
      }
    }}
    disabled={label === 'View Resume' && !resumeFile}
  >
    <View style={styles.gridHeader}>
      <Text style={styles.gridLabel}>{label}</Text>
    </View>
    <Text style={[
      styles.gridValue, 
      {color: label === 'View Resume'? "rgb(9 166 237)" : globalColors.darkblack}
    ]} numberOfLines={2}>
      {value || 'Not provided'}
    </Text>
  </TouchableOpacity>
);

const UserProfile = ({ route }) => {
  // console.log("route",route)
  const navigation = useNavigation();
  const [resume, setResume] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updatesPrifile, setUpdatesPrifile] = useState(false);
  const [profile, setProfile] = useState(
    'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg',
  );
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

      const id = useSelector(state => state?.Permissions.userId);
      const updatedProfile = useSelector(state => state?.Profile?.loading);
      // console.log("first",updatedProfile)
  
      const dispatch = useDispatch();
    
        useEffect(()=>{
          // console.log("comming here")
          if (id != null) {
            dispatch(fetchProfile(id))
          }
        },[id,route?.params?.candidateUpdated,updatesPrifile])
    
      const candidates = useSelector(state => state.Profile.ProfileDetails);
      const loading = useSelector(state => state.Profile.loading);

      useEffect(() => {
        // console.log("printing candidates",candidates)
        if (candidates?.user?.document?.length > 0) {
          const profileDoc = candidates.user.document.find(doc => doc.document_type === 'profile')?.document_file;
          const profileUrl=`${baseurl}/${profileDoc}`
          if (profileUrl) {
            setProfile(profileUrl);
          }
        }
      }, [candidates]); 

      useEffect(()=>{
        // console.log("printing profile",profile,candidates)
        if ( candidates != null ) {
          const eduID = candidates?.education?.map(item => String(item.id));
          const skillID = candidates?.skills?.map(item => String(item.id));
          const payload = {
            profile: profile?.data,
            user_id: candidates?.user_id,
            fname: candidates?.fname,
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
            // console.log("payload is",payload)
            if (payload.email==null) return 
           dispatch(updateCandidates({ id: candidates?.id, data: payload }))
           .then(async() => {
             setUpdatesPrifile(pre=>!pre)
            const usertest = await AsyncStorage.getItem('user');
            if (usertest) {
              const  userData = JSON.parse(usertest);
              // console.log("testusertest in profile", userData)

                // update only profile document
                const updatedUserData = {
                  ...userData,
                  document: userData.document.map(doc =>
                    doc.document_type == "profile"
                      ? { ...doc, document_file: `${profile}` }
                      : doc
                  )
                };
                // console.log("testusertest in payload updated", updatedUserData,"and profile is",profile)
               await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
            }
           })
        }
      },[profile])

  const onComplete = async (file) => {
    if (!file) {
      return;
    }
    setResume(file);
    Alert.alert('Success', 'Document uploaded successfully', file);
  };

  // Resume opening function - MOVED INSIDE UserProfile component
  const openResume = (resumeFile) => {
    if (!resumeFile) {
      Alert.alert('No Resume', 'No resume available for this candidate');
      return;
    }

    
    // Option 1: Navigate to ResumeViewer screen
    navigation.navigate('ResumeViewer', { resumeUrl: `${baseurl}/${resumeFile}` });
    
    // Option 2: Open with external app (uncomment if preferred)
    // const resumeUrl = `${baseurl}/${resumeFile}`;
    // Linking.openURL(resumeUrl).catch(error => {
    //   console.error('Failed to open URL:', error);
    //   Alert.alert('Error', 'Cannot open resume file');
    // });
  };

  // Enhanced grid configuration with edit handlers
  const PROFILE_GRID_CONFIG = [
    {
      label: 'Address',
      value: [
        candidates?.address_line_1,
        candidates?.address_line_2,
        candidates?.state?.state,
        candidates?.district?.district,
        candidates?.taluka?.taluka,
        candidates?.village?.village,
        candidates?.zipcode,
      ].filter(Boolean).join(", "),
    },
    {
      label: 'Job Location',
      value: candidates?.job_location,
    },
    {
      label: 'DOB',
      value: candidates?.dob,
    },
    {
      label: 'Blood Group',
      value: candidates?.blood_group,
    },
    {
      label: 'Aadhar No',
      value: candidates?.aadhar_no,
    },
    {
      label: 'PAN',
      value: candidates?.pancard_no,
    },
    {
      label: 'College',
      value: candidates?.college_name,
    },
    {
      label: 'Passout Year',
      value: candidates?.passout_year,
    },
    {
      label: 'Experience',
      value: candidates?.min_experience && candidates?.max_experience
        ? `${candidates.min_experience} - ${candidates.max_experience} years`
        : null,
    },
    {
      label: 'Alternate Contact',
      value: candidates?.contact_number_2,
    },
    {
      label: 'View Resume',
      value: candidates?.user?.document?.find(doc => doc.document_type === 'resume')?.document_file ? 'Tap to view resume' : 'No resume available',
      resumeFile: candidates?.user?.document?.find(doc => doc.document_type === 'resume')?.document_file,
    },
  ].filter(item => item.value && item.value !== 'No resume available');

  const handleUploadResume = () => {
    navigation.navigate('ResumeUpload');
  };

  const handleEditProfile = () => {
    navigation.navigate('AddCandidates', { 
      item: candidates, 
      updateCandidate: true,
      back: "UserDetails"
    });
  };

  const handleSaveProfile = async (updatedData) => {
  };

  const handleCloseModal = () => {
    setEditModalVisible(false);
  };

  // Handle grid item press
  const handleGridItemPress = (label, resumeFile) => {
    if (label === 'View Resume') {
      openResume(resumeFile);
    }
  };

  return (
    <>
      <EditProfileModal
        visible={editModalVisible}
        onClose={handleCloseModal}
        userData={candidates}
        onSave={handleSaveProfile}
      />
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
      {!loading &&( <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[
            globalColors.purplemedium1,
            globalColors.purplemedium2,
            globalColors.purplemedium1,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{flex: 1}}>
          <View style={styles.crossContainer}>
            <Text style={styles.myprofile}>My Profile</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.navigate('bottomnavigation', { screen: 'Home' })}>
              <MaterialIcons
                name="close"
                size={h(4)}
                color={globalColors.white}
              />
            </TouchableOpacity>
          </View>
           {/* Profile Content */}
            <View style={styles.profileContent}>
              {/* Profile Image */}
            <TouchableOpacity onPress={openModal} style={styles.profileImageContainer}>
              <Image
                resizeMode="cover"
                source={
                      profile
                        ? typeof profile === 'string' && profile.startsWith('http')
                          ? { uri: profile } // normal URL
                          : typeof profile === 'string'
                          ? { uri: `data:image/jpeg;base64,${profile}` } // base64
                          : { uri: 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg' } // fallback if not string
                        : { uri: 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg' } // fallback if undefined/null
                    }
                style={styles.userImage}
              />
                <View style={styles.editImageOverlay}>
                  <MaterialIcons name="edit" size={f(2)} color={globalColors.white} />
                </View>
            </TouchableOpacity>

              {/* User Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {candidates?.name || `${candidates?.fname} ${candidates?.lname}`}
                </Text>
                <Text style={styles.userProfession}>
                  {candidates?.profession}
                </Text>
                
                {/* Contact Info */}
                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <Image source={email} style={styles.contactIcon} />
                    <Text style={styles.contactText}>{candidates?.email}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Image source={phone} style={styles.contactIcon} />
                    <Text style={styles.contactText}>
                      {candidates?.contact_number || candidates?.contact_number_1 || candidates?.contact_number_2}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>

              {/* Upload Resume */}
              {/* <DocumentUpload type="Resume" onUploadComplete={onComplete} onRemove={() =>{ setResume('')}}/> */}

              {/* About Me Section */}
              <View style={styles.aboutMeSection}>
                
                {/* Grid Layout */}
                <View style={styles.gridContainer}>
                  {PROFILE_GRID_CONFIG.map((item, index) => (
                    <ProfileGridItem
                      key={index}
                      label={item.label}
                      value={item.value}
                      resumeFile={item.resumeFile}
                      onEdit={() => handleGridItemPress(item.label, item.resumeFile)}
                      navigation={navigation} // Pass navigation prop
                    />
                  ))}
                </View>
              </View>
            </View>

            <ImagePickerModal
              visible={modalVisible}
              onClose={closeModal}
              setProfile={setProfile}
              noimg={true}
              setDefaultImage={true}
            />
          </LinearGradient>
        </ScrollView>
      )}
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  // ... your existing styles remain the same
  crossContainer: {
    marginHorizontal: h(2),
    marginTop: h(2),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  myprofile: {
    fontSize: f(3),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.white,
  },
  closeButton: {
    position: 'absolute',
    right: w(0),
  },
  profileContent: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
    marginTop: h(8),
    borderTopLeftRadius: h(5),
    borderTopRightRadius: h(5),
    paddingBottom: h(3),
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: h(-5),
  },
  userImage: {
    borderRadius: w(12),
    borderWidth: h(0.4),
    height: w(23),
    width: w(23),
    borderColor: globalColors.white,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: w(1),
    right: w(1),
    backgroundColor: globalColors.commonpink,
    borderRadius: w(2),
    padding: w(1),
  },
  userInfo: {
    alignItems: 'center',
    marginTop: h(2),
    paddingHorizontal: w(5),
  },
  userName: {
    fontSize: f(2.3),
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.darkblack,
    textAlign: 'center',
  },
  userProfession: {
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.navypurple,
    marginTop: h(0.5),
    textAlign: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: h(2),
    paddingHorizontal: w(2),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  contactIcon: {
    width: w(3),
    height: w(3),
    tintColor: globalColors.darkpurple,
    marginRight: w(1),
  },
  contactText: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Regular',
    color: globalColors.darkblack,
    flexShrink: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: w(8),
    marginTop: h(3),
    marginBottom: h(2),
  },
  actionButton: {
    paddingHorizontal: w(6),
    paddingVertical: h(1),
    backgroundColor: globalColors.white,
    borderRadius: w(2.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width:"100%"
  },
  actionButtonText: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.commonpink,
    textAlign:"center"
  },
  iconButton: {
    backgroundColor: globalColors.white,
    padding: w(3),
    borderRadius: w(2.5),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconButtonImage: {
    width: w(4),
    height: w(4),
    tintColor: globalColors.commonpink,
  },
  uploadResumeButton: {
    flexDirection: 'row',
    backgroundColor: globalColors.commonlightpink,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: h(1.5),
    marginHorizontal: w(5),
    paddingHorizontal: w(4),
    borderRadius: w(2),
    marginTop: h(1),
    elevation: 2,
  },
  uploadResumeText: {
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.white,
  },
  uploadIcon: {
    width: w(4),
    height: w(4),
  },
  aboutMeSection: {
    marginTop: h(3),
    paddingHorizontal: w(4),
  },
  aboutMeTitle: {
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.black,
    fontSize: f(2),
    marginBottom: h(2),
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal:w(4)
  },
  gridItem: {
    width: w(82),
    backgroundColor: globalColors.white,
    borderRadius: w(3),
    padding: w(4),
    marginBottom: h(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent:'center',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: h(1),
  },
  gridIcon: {
    fontSize: f(2.5),
  },
  editIconBtn: {
    padding: w(1),
  },
  gridLabel: {
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.black,
    fontWeight: 'bold',
    marginBottom: h(0.5),
  },
  gridValue: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.darkblack,
    lineHeight: h(2.2),
  },
});