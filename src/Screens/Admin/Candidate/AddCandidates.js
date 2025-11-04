import { ActivityIndicator, Alert, Button, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import AppBar from '../../../Components/AppBar'
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchJobCategories } from '../../../Redux/Slices/JobCategoryslice';
import { fetchskills } from '../../../Redux/Slices/Skillslice';
import { fetchEducation } from '../../../Redux/Slices/Educationslice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDistrictById, fetchStates, fetchTalukaById, fetchVillageById, fetchZipcodeById } from '../../../Redux/Slices/Locationslice';
import ImagePickerModal from '../../../Components/ImagePickerModal';
import { gallery } from '../../../Theme/globalImages';
import { fetchCandidateDetails, postCandidates, updateCandidates } from '../../../Redux/Slices/Candidateslice';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import { baseurl } from '../../../Utils/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentUpload from '../../../Components/DocumentUpload';
import ResumePreviewPopup from '../../../Components/ResumeViewerPopup';

const AddCandidates = ({ route }) => {
  const { item: passeditem, updateCandidate, back } = route.params;
  const resumeUrl=route.params.item?.user?.document?.find(doc => doc.document_type === 'resume')?.document_file;
  const [fname, setFname] = useState('');
  const [middle_name, setMiddleName] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [min_experience, setMinExperience] = useState('');
  const [max_experience, setMaxExperience] = useState('');
  const [state_id, setStateId] = useState('');
  const [district_id, setDistrictId] = useState('');
  const [taluka_id, setTalukaId] = useState('');
  const [village_id, setVillageId] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [contact_number_2, setContactNumber2] = useState('');
  const [address_line_1, setAddressLine1] = useState('');
  const [address_line_2, setAddressLine2] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [aadhar_no, setAadharNo] = useState('');
  const [pancard_no, setPancardNo] = useState('');
  const [blood_group, setBloodGroup] = useState('');
  const [job_location, setJobLocation] = useState('');
  const [passout_year, setPassoutYear] = useState('');
  const [college_name, setCollegeName] = useState('');
  const [job_category_id, setJobCategoryId] = useState([]);
  const [description, setDescription] = useState('');
  const [education, setEducation] = useState([]);
  const [skill, setSkill] = useState([]);
  const [birthdate, setbirthDate] = useState(new Date());
  const [birthshow, setbirthShow] = useState(false);
  const [formattedbirthDate, setFormattedbirthDate] = useState('');
  const [resume, setResume] = useState('');
  const [profile, setProfile] = useState(null);
  const [profession, setProfession] = useState('');
  const [gender, setGender] = useState('');
  const [openGender, setOpenGender] = useState('')
  const [errors, setErrors] = useState({})
  const [BGmodal, setBGmodal] = useState(false)
  const [openskill, setOpenskill] = useState(false);
  const [openqualification, setOpenqualification] = useState(false);
  const [opencategory, setOpencategory] = useState(false);
  const [openstate, setOpensstate] = useState(false);
  const [opendistrict, setOpendistrict] = useState(false);
  const [opentaluka, setOpentaluka] = useState(false);
  const [openvillage, setOpenvillage] = useState(false);
  const skills = useSelector(state => state.skills.skills).map(item => ({ label: item.name, value: item.id.toString() }));
  const jobCategories = useSelector(state => state.jobCategory.JobCategory).map(item => ({ label: item.category_name, value: item.id.toString() }));
  const qualification = useSelector(state => state.Education.Education).map(item => ({ label: item.name, value: item.id.toString() }));
  const states = useSelector(state => state.location.states).map(item => ({ label: item.state, value: item.id.toString() }));
  const districts = useSelector(state => state.location.districts).map(item => ({ label: item.district, value: item.id.toString() }));
  const talukas = useSelector(state => state.location.talukas).map(item => ({ label: item.taluka, value: item.id.toString() }));
  const villages = useSelector(state => state.location.villages).map(item => ({ label: item.village, value: item.id.toString() }));
  const [modalVisible, setModalVisible] = useState(false);
  const [liveValidating, setLiveValidating] = useState(false);
  const [user, setUser] = useState(null);
  const item = useSelector(state => state.candidates.selectedCandidate)
  const loading = useSelector(state => state.candidates.modifyloading)
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedResume, setSelectedResume] = useState('');
  const [resumeInfo,setResumeInfo]=useState()
  const [updateSuccess, setUpdateSuccess] = useState(false);  

  useLayoutEffect(() => {
    if(passeditem?.id){
      dispatch(fetchCandidateDetails(passeditem?.id))
    }
  }, [passeditem])


  const onChangebirthdate = (event, selectedDate) => {
    setbirthShow(false);
    if (new Date() < selectedDate) {
      Alert.alert('Invalid Date', 'Birth date cannot be Greater than today.');
      return;
    }
    const currentDate = selectedDate || birthdate;
    setbirthDate(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;
    setFormattedbirthDate(formattedDateString);
  };

  const fetchZipcodeFromNominatim = async (villageName) => {
  try {
    // Encode the village name for the URL
    const StateObj = states.find(v => v.value === state_id);
    const stateName = StateObj ? StateObj.label : null;

    const encodedVillageName = encodeURIComponent(`${villageName},${stateName}, India`);
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodedVillageName}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'YourAppName/1.0 (your@email.com)',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    

    if (data && data.length > 0) {
      const locationData = data[0];
      
      // Extract pincode from display_name or use other methods
      const pincode = extractPincodeFromLocationData(locationData);
      
      if (pincode) {
        setZipcode(pincode);
      } else {
        setZipcode(''); // Clear if no pincode found
      }
    } else {
      setZipcode(''); // Clear if no data found
    }
  } catch (error) {
    console.log('Error fetching zipcode from Nominatim:', error);
    // You might want to set a default value or show an error message
    setZipcode('');
  }
};

  const extractPincodeFromLocationData = (locationData) => {
  // Method 1: Check if pincode is in display_name (most common)
  const displayName = locationData.display_name || '';
  
  // Look for 6-digit pincode pattern in display_name
  const pincodeMatch = displayName.match(/\b\d{6}\b/);
  if (pincodeMatch) {
    return pincodeMatch[0];
  }
  
  // Method 2: For Indian addresses, pincode is often at the end
  // You can add more specific parsing logic based on your needs
  
  // Method 3: If the above doesn't work, you might need to use a different API
  // or implement more sophisticated parsing
  
  return null;
};

  const validateFields = useCallback(() => {
    const newErrors = {};
    if (!fname) newErrors.fname = 'First Name is required';
    if (!middle_name) newErrors.middle_name = 'Middle Name is required';
    if (!lname) newErrors.lname = 'Last Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Enter a valid email address';
    }    if (!profession) newErrors.profession = 'profession is required';
    if (!gender) newErrors.gender = 'gender is required';
    if (!updateCandidate || !item) {
      if (password?.length < 6) {
        newErrors.password = 'Password length must be 6 or more';
      }
    }
    if (!min_experience || !max_experience) newErrors.experience = 'Min - Max Experience is required';
    if (parseInt(min_experience) > parseInt(max_experience)) newErrors.experience = 'Max Experience Should be greater than Min Experience';    
    if (!state_id) newErrors.state_id = 'State ID is required';
    if (!district_id) newErrors.district_id = 'District ID is required';
    if (!taluka_id) newErrors.taluka_id = 'Taluka ID is required';
    if (!village_id) newErrors.village_id = 'Village ID is required';
    if (!zipcode) newErrors.zipcode = 'Zipcode is required';
    if (phone?.length < 10 || parseInt(phone) < 1) newErrors.phone = 'Valid Phone number is required';
    if (contact_number_2?.length < 10|| parseInt(contact_number_2) < 1) newErrors.contact_number_2 = 'Valid Contact number 2 is required';
    // if (aadhar_no?.length != 12) newErrors.aadhar_no = 'Valid Aadhar number is required';
    // if (pancard_no?.length != 10) newErrors.pancard_no = 'Pancard number is required';
    // if (!blood_group) newErrors.blood_group = 'Blood group is required';
    if (!job_location) newErrors.job_location = 'Job location is required';
    // if (!passout_year) newErrors.passout_year = 'Passout year is required';
    // if (!college_name) newErrors.college_name = 'College name is required';
    if (!job_category_id?.length) newErrors.job_category_id = 'Job category is required';
    if (!description) newErrors.description = 'Description is required';
    if (!education?.length) newErrors.education = 'Education is required';
    if (!skill?.length) newErrors.skill = 'Skills are required';
    if (!formattedbirthDate) newErrors.birthDate = 'Dob is required';
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  },[
    fname,
    middle_name,
    lname,
    email,
    password,
    min_experience,
    max_experience,
    state_id,
    district_id,
    taluka_id,
    village_id,
    zipcode,
    phone,
    gender,
    profession,
    contact_number_2,
    aadhar_no,
    pancard_no,
    blood_group,
    job_location,
    passout_year,
    college_name,
    job_category_id,
    description,
    education,
    skill,
    formattedbirthDate
    ]);

    useEffect(() => {
      if (liveValidating) {
        validateFields();
      }
    }, [liveValidating , validateFields]);


      const onComplete =async ( file ,info)=> {
        if (!file || !info) {
            return
        };
        setResume(file);
        setResumeInfo(info)
      };
  
useLayoutEffect(() => {
  if (updateCandidate && item) {
    setLiveValidating(false)
    setErrors({});
    setFname(item.fname);
    setMiddleName(item.middle_name);
    setLname(item.lname);
    setEmail(item.email);
    setPassword(item.password);
    setMinExperience(item.min_experience);
    setMaxExperience(item.max_experience);
    
    // Set state first, then trigger district loading
    setStateId(item.state_id?.toString());
    
    setDob(item.dob);
    setGender(item.user?.gender);
    setProfession(item.profession);
    setPhone(item.contact_number_1);
    setContactNumber2(item.contact_number_2);
    setAddressLine1(item.address_line_1);
    setAddressLine2(item.address_line_2);
    setLatitude(item.latitude);
    setLongitude(item.longitude);
    setAadharNo(item.aadhar_no);
    setPancardNo(item.pancard_no);
    setBloodGroup(item.blood_group);
    setJobLocation(item.job_location);
    setPassoutYear(item.passout_year);
    setCollegeName(item.college_name);
    setJobCategoryId(item.job_categories?.map(category => category.id?.toString()));
    setDescription(item.description);
    setEducation(item.education?.map(edu => edu.id.toString()));
    setSkill(item.skills?.map(skill => skill.id.toString()));
    setFormattedbirthDate(item.dob);
    setProfile(item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { path: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : null)
    setResume(item?.user?.document?.filter(doc => doc?.document_type == "resume")?.[0]?.document_file ? { path: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "resume")?.[0].document_file}` } : null)
  } else {
    setErrors({})
    setLiveValidating(false)
    clearForm()
  }
}, [updateCandidate, item]);

// Add this useEffect to handle district, taluka, village loading after state is set
useEffect(() => {
  if (updateCandidate && item && item.state_id) {
    // Fetch districts for the state
    dispatch(fetchDistrictById(item.state_id)).then(() => {
      // After districts are loaded, set district_id and fetch talukas
      setDistrictId(item.district_id?.toString());
      
      if (item.district_id) {
        dispatch(fetchTalukaById(item.district_id)).then(() => {
          // After talukas are loaded, set taluka_id and fetch villages
          setTalukaId(item.taluka_id?.toString());
          
          if (item.taluka_id) {
            dispatch(fetchVillageById(item.taluka_id)).then(() => {
              // After villages are loaded, set village_id and zipcode
              setVillageId(item.village_id?.toString());
              
              if (item.village_id) {
                // dispatch(fetchZipcodeById(item.village_id))
                //   .then(action => {
                //     setZipcode(action.payload[0]?.pincode || item.zipcode);
                //   });
                      const villageObj = villages.find(v => v.value === village_id);
                      const village_name = villageObj ? villageObj.label : null;
                        if (village_name) {
                    fetchZipcodeFromNominatim(village_name);
                        }
              } else {
                setZipcode(item.zipcode);
              }
            });
          } else {
            setZipcode(item.zipcode);
          }
        });
      } else {
        setZipcode(item.zipcode);
      }
    });
  }
}, [updateCandidate, item, dispatch]);


  const clearForm = useCallback(() => {
    setFname('');
    setMiddleName('');
    setLname('');
    setEmail('');
    setPassword('');
    setMinExperience('');
    setMaxExperience('');
    setStateId('');
    setDistrictId('');
    setTalukaId('');
    setVillageId('');
    setZipcode('');
    setDob('');
    setPhone('');
    setContactNumber2('');
    setAddressLine1('');
    setAddressLine2('');
    setLatitude('');
    setLongitude('');
    setAadharNo('');
    setPancardNo('');
    setBloodGroup('');
    setJobLocation('');
    setPassoutYear('');
    setCollegeName('');
    setJobCategoryId([]);
    setDescription('');
    setEducation([]);
    setSkill([]);
    setbirthDate(new Date());
    setFormattedbirthDate('');
    setErrors({});
    setLiveValidating(false);
    setGender('')
    setProfession('')
    setProfile(null)
    setResume(null)
  });

  const dispatch = useDispatch()

  const fetchuser = useCallback(async () => {
    const userJson = await AsyncStorage.getItem('user');
    const userData = userJson != null ? JSON.parse(userJson) : null;
    setUser(userData);
  }, []);
  
  useEffect(() => {
    dispatch(fetchJobCategories())
    dispatch(fetchskills())
    dispatch(fetchEducation())
    dispatch(fetchStates())
    fetchuser(); 
  }, [dispatch])

  useEffect(() => {
    if(state_id){
      dispatch(fetchDistrictById(state_id))
    }
  }, [state_id])

  useEffect(() => {
    if(district_id){
      dispatch(fetchTalukaById(district_id))
    }
  }, [district_id])

  useEffect(() => {
    if(taluka_id){
      dispatch(fetchVillageById(taluka_id))
    }
  }, [taluka_id])

  useEffect(() => {
    if(village_id){
      // dispatch(fetchZipcodeById(village_id))
      // .then(action => {
      //   setZipcode(action.payload[0].pincode)
      // })
      const villageObj = villages.find(v => v.value === village_id);
      const village_name = villageObj ? villageObj.label : null;
        if (village_name) {
    fetchZipcodeFromNominatim(village_name);
  }
    }
  }, [village_id])

  const navigation = useNavigation()

    const handlePreviewResume = (resumeUrl) => {
        setSelectedResume(resumeUrl);
        setPreviewVisible(true);
      }
  const bloodGroups = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  const genders = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];

  const handleSubmit = async () => {
    // Validate all fields before submission
    // if (!validateFields()) {
    //   return;
    // }

    // Construct FormData
    // const base64Image = await urlToBase64(profileImageUri);

    // Construct JSON object
    const candidateData = {
      ...(profile && profile.mime && profile.data ? { profile: `data:${profile.mime};base64,${profile.data}`} : {}),
      user_id:user?.id,
      fname,
      middle_name,
      lname,
      email,
      password,
      min_experience,
      max_experience,
      state_id,
      district_id,
      gender,
      profession,
      taluka_id,
      village_id,
      zipcode,
      dob: formattedbirthDate,
      phone,
      contact_number_2,
      address_line_1,
      address_line_2,
      aadhar_no,
      pancard_no,
      blood_group,
      job_location,
      passout_year,
      college_name,
      description,
      job_category_id,
      education,
      skill,
      ...(!resume?.path ? { resume } : {})
    };

    if (updateCandidate && item) {
      setLiveValidating(true)
      if (!validateFields()) {
        return;
      }
      // Update existing candidate
      dispatch(updateCandidates({ id: item.id, data: candidateData })).then(response => {
        if (response.payload) {
          if (back) {
            setUpdateSuccess(pre=>!pre)
            navigation.navigate('UserDetails', { candidateUpdated: updateSuccess });
            clearForm();
          }
          else{
            navigation.navigate('CandidateMnt', { candidateSaved: true });
            clearForm();
          }
        }
      });
    } else {
      setLiveValidating(true)
      if (!validateFields()) {
        return;
      }
      // Add new candidate
      dispatch(postCandidates(candidateData)).then(response => {
        if (response.payload) {
          if (back) {
            navigation.navigate('UserDetails', { candidateUpdated: true });
            clearForm();
          }
          else{
            navigation.navigate('CandidateMnt', { candidateSaved: true });
            clearForm();
          }
        }
      });
    }
  };

  const onRefresh=()=>{
    setRefresh(true)
    dispatch(fetchJobCategories())
    dispatch(fetchskills())
    dispatch(fetchEducation())
    dispatch(fetchStates())
    if(passeditem?.user_id){
      dispatch(fetchCandidateDetails(passeditem?.user_id))
    }
    if (updateCandidate && item) {
      setLiveValidating(false)
      setErrors({});
      setFname(item.fname);
      setMiddleName(item.middle_name);
      setLname(item.lname);
      setEmail(item.email);
      setPassword(item.password);
      setMinExperience(item.min_experience);
      setMaxExperience(item.max_experience);
      setStateId(item.state_id);
      setDistrictId(item.district_id);
      setTalukaId(item.taluka_id);
      setVillageId(item.village_id);
      setZipcode(item.zipcode);
      setDob(item.dob);
      setGender(item.user?.gender);
      setProfession(item.profession);
      setPhone(item.contact_number_1);
      setContactNumber2(item.contact_number_2);
      setAddressLine1(item.address_line_1);
      setAddressLine2(item.address_line_2);
      setLatitude(item.latitude);
      setLongitude(item.longitude);
      setAadharNo(item.aadhar_no);
      setPancardNo(item.pancard_no);
      setBloodGroup(item.blood_group);
      setJobLocation(item.job_location);
      setPassoutYear(item.passout_year);
      setCollegeName(item.college_name);
      setJobCategoryId(item.job_categories?.map(category => category.id?.toString()));
      setDescription(item.description);
      setEducation(item.education?.map(edu => edu.id.toString()));
      setSkill(item.skills?.map(skill => skill.id.toString()));
      setFormattedbirthDate(item.dob);
      setProfile(item?.user?.document?.filter(doc => doc?.document_type == "profile")?.[0]?.document_file ? { path: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "profile")?.[0].document_file}` } : null)
    setResume(item?.user?.document?.filter(doc => doc?.document_type == "resume")?.[0]?.document_file ? { path: `${baseurl}/${item?.user?.document?.filter(doc => doc.document_type == "resume")?.[0].document_file}` } : null)
    } else {
      setErrors({})
      setLiveValidating(false)
      clearForm()
    }
    setRefresh(false);
}


  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const { t } = useTranslation();
  const [refresh , setRefresh] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: globalColors.backgroundshade }}>
      <AppBar navtitle={updateCandidate ? t(`${back?"Update Profile":"Update candidate"}`) : t('Create Candidate')} showBack={true} backto={back ? back : 'CandidateMnt'} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: globalColors.backgroundshade }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        {loading ? <SkeltonLoader /> : <>
          <Text
            style={{
              fontSize: f(2.2),
              fontFamily: 'BaiJamjuree-SemiBold',
              color: globalColors.darkblack,
              paddingStart: '5.5%',
              paddingTop: w(2),
              fontFamily: 'BaiJamjuree-Medium',
            }}>
            {updateCandidate ? t('Update candidate Details') : t('Add candidate Details')}
          </Text>
          <ImagePickerModal
            visible={modalVisible}
            onClose={closeModal}
            setProfile={setProfile}
            noimg={true}
          />
          <TouchableOpacity style={{ marginStart: '5%' }} onPress={openModal}>
            {profile ? (
              <Image
                resizeMode="contain"
                source={{ uri: profile.path }}
                style={{
                  borderRadius: h(3),
                  borderWidth: h(0.4),
                  height: w(20),
                  width: w(20),
                  borderColor: globalColors.white,
                }}
              />
            ) : (
              <View>
                <Image
                  resizeMode="contain"
                  style={{
                    width: w(15),
                    height: w(15),
                    marginTop: w(5),
                    marginStart: w(1.5),
                    tintColor: globalColors.black,
                  }}
                  source={gallery}
                />
                <Text
                  style={{
                    fontSize: f(1.8),
                    fontFamily: 'BaiJamjuree-Regular',
                    color: globalColors.darkblack,
                    fontFamily: 'BaiJamjuree-Medium',
                  }}>
                  {t("Candidate Profile")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.inputHeder}>{t("First Name")}</Text>
          <TextInput
            placeholder={t("First Name")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={fname}
            onChangeText={setFname}
          />
          {errors.fname ? <Text style={styles.errorText}>{errors.fname}</Text> : null}
          <Text style={styles.inputHeder}>{t("Middle Name")}</Text>
          <TextInput
            placeholder={t("Middle Name")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={middle_name}
            onChangeText={setMiddleName}
          />
          {errors.middle_name ? <Text style={styles.errorText}>{errors.middle_name}</Text> : null}
          <Text style={styles.inputHeder}>{t("Last Name")}</Text>
          <TextInput
            placeholder={t("Last Name")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={lname}
            onChangeText={setLname}
          />
          {errors.lname ? <Text style={styles.errorText}>{errors.lname}</Text> : null}
          <Text style={styles.inputHeder}>{t("Profession")}</Text>
          <TextInput
            placeholder={t("Profession")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={profession}
            onChangeText={setProfession}
          />
          {errors.profession ? <Text style={styles.errorText}>{errors.profession}</Text> : null}
          <Text style={styles.inputHeder}>{t("Gender")}</Text>
          <DropDownPicker
            open={openGender}
            setOpen={setOpenGender}
            value={gender}
            items={genders}
            setValue={setGender}
            placeholder={t('Gender')}
            dropDownContainerStyle={{
              borderWidth: 0,
              borderTopWidth: w(0.1),
              elevation: 5,
            }}
            // listItemLabelStyle={{color:globalColors.darkblack}}
            textStyle={{
              color: gender ? globalColors.darkblack : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 2,
              marginHorizontal: '5%',
              width: '90%',
            }}
            dropDownDirection="BOTTOM"
          />
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}
          <TouchableOpacity onPress={() => setbirthShow(true)}>
            <Text style={styles.inputHeder}>{t("Birth Date : yyyy-mm-dd")}</Text>
            <TextInput
              placeholder={t("Birth Date : yyyy-mm-dd")}
              placeholderTextColor={globalColors.mauve}
              style={styles.miniplaceholder}
              value={formattedbirthDate}
              editable={false}
            />
            {errors.birthDate && (
              <Text style={styles.errorText}>{errors.birthDate}</Text>
            )}
          </TouchableOpacity>
          {birthshow && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              onChange={onChangebirthdate}
            />
          )}
          <Text style={styles.inputHeder}>{t("About Yourself")}</Text>
          <TextInput
            placeholder={t("About Yourself")}
            placeholderTextColor={globalColors.mauve}
            style={styles.multiplaceholder}
            multiline={true}
            value={description}
            onChangeText={setDescription}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
          <Text style={styles.inputHeder}>{t("Email")}</Text>
          <TextInput
            placeholder={t("Email")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          <Text style={styles.inputHeder}>{t("Password")}</Text>
          <TextInput
            placeholder={t("Password")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.minmaxcontainer}>
            <Text
              style={{
                color: globalColors.mauve,
                fontSize: f(1.8),
                paddingTop: h(1),
                fontFamily: 'BaiJamjuree-Medium',
              }}>
              {t("Experience")}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                gap: w(10),
                paddingBottom: h(1.5),
              }}>
              <TextInput
                style={styles.minmaxinput}
                placeholderTextColor={globalColors.mauve}
                placeholder="min years"
                value={min_experience}
                onChangeText={text => {
                  if (/^\d*\.?\d*$/.test(text)) {
                    setMinExperience(text);
                  }
                }}
                maxLength={2}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.minmaxinput}
                placeholderTextColor={globalColors.mauve}
                placeholder="max years"
                value={max_experience}
                onChangeText={text => {
                  if (/^\d*\.?\d*$/.test(text)) {
                    setMaxExperience(text);
                  }
                }}
                maxLength={2}
                keyboardType="numeric"
              />
            </View>
          </View>
          {errors.experience && (
            <Text style={styles.errorText}>{errors.experience}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Phone Number")}</Text>
          <TextInput
            placeholder={t("Phone Number")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={phone}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) {
                setPhone(text);
              }
            }}
            maxLength={12}
            keyboardType="phone-pad"
          />
          {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
          <Text style={styles.inputHeder}>{t("Contact Number 2")}</Text>
          <TextInput
            placeholder={t("Contact Number 2")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={contact_number_2}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) {
                setContactNumber2(text);
              }
            }}
            maxLength={12}
            keyboardType="phone-pad"
          />
          {errors.contact_number_2 ? <Text style={styles.errorText}>{errors.contact_number_2}</Text> : null}
          <Text style={styles.inputHeder}>{t("Address Line 1")}</Text>
          <TextInput
            placeholder={t("Address Line 1")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={address_line_1}
            onChangeText={setAddressLine1}
          />
          {errors.address_line_1 ? <Text style={styles.errorText}>{errors.address_line_1}</Text> : null}
          <Text style={styles.inputHeder}>{t("Address Line 2")}</Text>
          <TextInput
            placeholder={t("Address Line 2")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={address_line_2}
            onChangeText={setAddressLine2}
          />
          {errors.address_line_2 ? <Text style={styles.errorText}>{errors.address_line_2}</Text> : null}
          <Text style={styles.inputHeder}>{t("Select State")}</Text>
          <DropDownPicker
            open={openstate}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpensstate}
            items={states}
            value={state_id}
            setValue={setStateId}
            placeholder={t('Select State')}
            textStyle={{
              color: state_id
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search State")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
          />
          {errors.state_id && (
            <Text style={styles.errorText}>{errors.state_id}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Select district")}</Text>
          <DropDownPicker
            open={opendistrict}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpendistrict}
            items={districts}
            value={district_id}
            setValue={setDistrictId}
            placeholder={t('Select district')}
            textStyle={{
              color: district_id
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search District")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
          />
          {errors.district_id && (
            <Text style={styles.errorText}>{errors.district_id}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Select taluka")}</Text>
          <DropDownPicker
            open={opentaluka}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpentaluka}
            items={talukas}
            value={taluka_id}
            setValue={setTalukaId}
            placeholder={t('Select taluka')}
            textStyle={{
              color: taluka_id
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search Taluka")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
          />
          {errors.taluka_id && (
            <Text style={styles.errorText}>{errors.taluka_id}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Select village")}</Text>
          <DropDownPicker
            open={openvillage}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenvillage}
            items={villages}
            value={village_id}
            setValue={setVillageId}
            placeholder={t('Select village')}
            textStyle={{
              color: village_id
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search Village")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
          />
          {errors.village_id && (
            <Text style={styles.errorText}>{errors.village_id}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Zipcode")}</Text>
          <TextInput
            placeholder={t("Zipcode")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={zipcode}
            editable={false}
          />
          {errors.zipcode ? <Text style={styles.errorText}>{errors.zipcode}</Text> : null}
          <Text style={styles.inputHeder}>{t("Aadhar Number")}</Text>
          <TextInput
            placeholder={t("Aadhar Number")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={aadhar_no}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) {
                setAadharNo(text);
              }
            }}
            maxLength={12}
            keyboardType="numeric"
          />
          {errors.aadhar_no ? <Text style={styles.errorText}>{errors.aadhar_no}</Text> : null}
          <Text style={styles.inputHeder}>{t("Pancard Number")}</Text>
          <TextInput
            placeholder={t("Pancard Number")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={pancard_no}
            onChangeText={setPancardNo}
            maxLength={10}
          />
          {errors.pancard_no ? <Text style={styles.errorText}>{errors.pancard_no}</Text> : null}
          <Text style={styles.inputHeder}>{t("Blood Group")}</Text>
          <DropDownPicker
            open={BGmodal}
            listMode="MODAL"
            searchable={true}
            setOpen={setBGmodal}
            items={bloodGroups}
            value={blood_group}
            setValue={setBloodGroup}
            placeholder={t('Blood Group')}
            textStyle={{
              color: blood_group
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search Blood Group")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
          />
          {errors.blood_group && (
            <Text style={styles.errorText}>{errors.blood_group}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Job Category")}</Text>
          <DropDownPicker
            open={opencategory}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpencategory}
            items={jobCategories}
            value={job_category_id}
            setValue={setJobCategoryId}
            placeholder={t('Job Category')}
            multiple={true}
            textStyle={{
              color: globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t("Search Category")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              width: '90%',
              marginHorizontal: '5%',
            }}
            mode="BADGE"
            badgeColors={[globalColors.commonpink]}
            badgeDotStyle={{ display: 'none' }}
            modalAnimationType="slide"
            badgeTextStyle={{
              paddingStart: w(-1),
              color: globalColors.white,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
            }}
            min={1}
          />
          {errors.job_category_id && (
            <Text style={styles.errorText}>{errors.job_category_id}</Text>
          )}
          <Text style={styles.inputHeder}>{t("skill")}</Text>
          <DropDownPicker
            open={openskill}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenskill}
            items={skills}
            value={skill}
            setValue={setSkill}
            placeholder={t('skill')}
            textStyle={{
              color: globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            multiple={true}
            searchPlaceholder={t("Search skill")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              marginHorizontal: '5%',
              width: '90%',
            }}
            mode="BADGE"
            badgeColors={[globalColors.commonpink]}
            badgeDotStyle={{ display: 'none' }}
            modalAnimationType="slide"
            badgeTextStyle={{
              paddingStart: w(-1),
              color: globalColors.white,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
            }}
            min={1}
          />
          {errors.skill && (
            <Text style={styles.errorText}>{errors.skill}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Education")}</Text>
          <DropDownPicker
            open={openqualification}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenqualification}
            items={qualification}
            value={education}
            setValue={setEducation}
            placeholder={t('Education')}
            textStyle={{
              color: globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            multiple={true}
            searchPlaceholder={t("Search Education")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              zIndex: 1,
              marginHorizontal: '5%',
              width: '90%',
            }}
            mode="BADGE"
            badgeColors={[globalColors.commonpink]}
            badgeDotStyle={{ display: 'none' }}
            modalAnimationType="slide"
            badgeTextStyle={{
              paddingStart: w(-1),
              color: globalColors.white,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
            }}
            min={1}
          />
          {errors.education && (
            <Text style={styles.errorText}>{errors.education}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Job Location")}</Text>
          <TextInput
            placeholder={t("Job Location")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={job_location}
            onChangeText={setJobLocation}
          />
          {errors.job_location ? <Text style={styles.errorText}>{errors.job_location}</Text> : null}
          <Text style={styles.inputHeder}>{t("College Name")}</Text>
          <TextInput
            placeholder={t("College Name")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={college_name}
            onChangeText={setCollegeName}
          />
          {errors.college_name ? <Text style={styles.errorText}>{errors.college_name}</Text> : null}
          <Text style={styles.inputHeder}>{t("Passout Year YYYY")}</Text>
          <TextInput
            placeholder={t("Passout Year YYYY")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={passout_year}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) {
                setPassoutYear(text);
              }
            }}
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.passout_year ? <Text style={styles.errorText}>{errors.passout_year}</Text> : null}
          {  back &&  (<View>
              {resumeInfo && <><Text style={[styles.name,]} numberOfLines={1}>{resumeInfo.name}</Text>
              <Text style={[styles.size, ]}>{(resumeInfo.size / 1024 / 1024).toFixed(2)} MB</Text></>}
                {!resumeInfo && <TouchableOpacity 
                  style={[styles.previewkBtn]}
                  onPress={() => handlePreviewResume(`${baseurl}/${resumeUrl}`)} 
                >
                  <Text style={styles.pickBtnTxt}>{t("Previw Resume")}</Text>
                </TouchableOpacity>}
                <ResumePreviewPopup
                  visible={previewVisible}
                  onClose={() => setPreviewVisible(false)}
                  resumeUrl={selectedResume}
                  getResumeUrl={onComplete}
                />
              </View>)}

             {!back && <DocumentUpload  type={`${back ? "select Resume" : "Update Resume"}`}  onUploadComplete={onComplete} onRemove={() =>{ setResume('')}}/>}

          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'space-between',
              marginVertical: '5%',
              marginHorizontal: '5%',
              gap: w(10),
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.suvagrey,
                flex: 1,
                paddingVertical: w(2),
                borderRadius: w(3),
              }}
              onPress={() => navigation.navigate('CandidateMnt')}>
              <Text
                style={{
                  color: globalColors.white,
                  alignSelf: 'center',
                  fontFamily: 'BaiJamjuree-Medium',
                }}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.commonlightpink,
                flex: 1,
                paddingVertical: w(2),
                borderRadius: w(3),
              }}
              onPress={handleSubmit}>
              {loading ? <ActivityIndicator /> : (
                <Text
                  style={{
                    color: globalColors.white,
                    alignSelf: 'center',
                    fontFamily: 'BaiJamjuree-Medium',
                  }}>
                  {updateCandidate ? t('Update candidate') : t('Create Candidate')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>}
      </ScrollView>
    </View>
  )
}

export default AddCandidates

const styles = StyleSheet.create({
  miniplaceholder: {
    backgroundColor: globalColors.white,
    elevation: 3,
    paddingStart: w(5),
    fontSize: f(1.8),
    borderRadius: h(1.5),
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Medium',
    width: '90%',
    marginStart: '5%',

  },
  inputHeder: {
    color: globalColors.darkblack,
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    marginStart: '6%',
    marginTop: h(2),
  },
  errorText: {
    color: globalColors.red,
    marginBottom: h(1),
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    marginStart: '5%'
  },
  minmaxcontainer: {
    backgroundColor: globalColors.white,
    elevation: 3,
    paddingStart: w(5),
    borderRadius: h(1.5),
    width: '90%',
    marginStart: '5%',
    marginTop: h(2),
  },
  minmaxinput: {
    paddingStart: w(2),
    fontSize: f(1.8),
    borderBottomWidth: w(0.2),
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Medium',
    borderBottomColor: globalColors.mauve,
    width: '30%',
    verticalAlign: 'middle',
  },
  multiplaceholder: {
    backgroundColor: globalColors.white,
    elevation: 3,
    paddingStart: w(5),
    paddingTop: h(2),
    textAlignVertical: 'top',
    color: globalColors.darkblack,
    fontFamily: 'BaiJamjuree-Medium',
    fontSize: f(1.8),
    borderRadius: h(1.5),
    width: '90%',
    marginStart: '5%',
    minHeight: h(12),
    borderBottomWidth: w(0.1),
    borderBottomColor: globalColors.darkblack,
  },
  previewkBtn: {
    marginTop: h(2.5),
    flexDirection: 'row',
    backgroundColor: globalColors.commonlightpink,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: w(1.5),
    marginHorizontal: w(5),
    paddingHorizontal: w(3),
    borderRadius: w(2),
  },
  pickBtnTxt: {
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.white,
  },
  name: { fontSize: 15, fontWeight: '500',width:"80%",margin:"auto",marginTop:h(2) },
  size: { fontSize: 13, color: '#666', marginTop: 2,width:"80%",margin:"auto"},
})