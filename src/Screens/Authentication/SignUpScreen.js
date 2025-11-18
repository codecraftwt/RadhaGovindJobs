import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from 'react-native';
import { h, w, f } from 'walstar-rn-responsive';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../Theme/globalColors';

// Components
import RoleSelection from '../../Components/Auth/RoleSelection';
import CandidateForm from '../../Components/Auth/CandidateForm';
import ConsultantForm from '../../Components/Auth/ConsultantForm';
import EmployerForm from '../../Components/Auth/EmployerForm';
import InstituteForm from '../../Components/Auth/InstituteForm';
import GramPanchayatForm from '../../Components/Auth/GramPanchayatForm';
import ImagePickerModal from '../../Components/ImagePickerModal';

// Services
import { useLocationService } from '../../Services/LocationService';
import { useTranslation } from 'react-i18next';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const isLoading = useSelector(state => state.auth.isLoading);
  const { t } = useTranslation();

  const [selectedRole, setSelectedRole] = useState('');
  const [step, setStep] = useState(1);
  const [imagePickerModal, setImagePickerModal] = useState({
    visible: false,
    field: null,
  });

  // Initialize form data with all possible fields for all roles
  const [formData, setFormData] = useState({
    // Common fields for all roles
    email: '',
    password: '',
    confirm_password: '',
    phone: '',

    // Candidate specific
    fname: '',
    middle_name: '',
    lname: '',
    dob: '',
    gender: '',
    blood_group: '',
    aadhar_no: '',
    pancard_no: '',
    profession: '',
    description: '',
    address_line_1: '',
    address_line_2: '',
    college_name: '',
    passout_year: '',
    qualification: '',
    job_category: '',
    skills: '',
    min_experience: '',
    max_experience: '',
    job_location: '',
    resume: null,
    profile: null,

    // Consultant/Employer/Institute/Gram Panchayat common
    name: '',
    established_date: '',
    contact_number_2: '',
    website_url: '',
    gst_no: '',
    description: '',
    profile_logo: null,

    // Institute specific
    head_of_institute: '',
    approval_id: '',
    institute_type: '',
    no_of_students: '',

    // Employer specific
    company_sector: '',
    company_type: '',

    // Location fields (common for all)
    state_id: '',
    district_id: '',
    taluka_id: '',
    village_id: '',
    zipcode: '',
  });

  // Location service hook
  const locationService = useLocationService();

  const handleRoleSelect = role => {
    if (role === 'Login') {
      navigation.navigate('Login');
    } else {
      setSelectedRole(role);
      setStep(2);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Handle location cascading through service
    locationService.handleLocationChange(field, value, setFormData);
  };

  const handleImagePicker = field => {
    setImagePickerModal({
      visible: true,
      field,
    });
  };

  const handleImageSelect = image => {
    if (image && imagePickerModal.field) {
      setFormData(prev => ({
        ...prev,
        [imagePickerModal.field]: image,
      }));
    }
    setImagePickerModal({ visible: false, field: null });
  };

  const closeImagePickerModal = () => {
    setImagePickerModal({ visible: false, field: null });
  };

  const handleSubmit = async () => {
    console.log('Submitting form for:', selectedRole, formData);

    // Prepare payload based on role with base64 images
    let payload = {};
    let endpoint = '';

    switch (selectedRole) {
      case 'candidate':
        payload = {
          fname: formData.fname,
          middle_name: formData.middle_name,
          lname: formData.lname,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          blood_group: formData.blood_group,
          aadhar_no: formData.aadhar_no,
          pancard_no: formData.pancard_no,
          profession: formData.profession,
          description: formData.description,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          state_id: formData.state_id,
          district_id: formData.district_id,
          taluka_id: formData.taluka_id,
          village_id: formData.village_id,
          zipcode: formData.zipcode,
          college_name: formData.college_name,
          passout_year: formData.passout_year,
          qualification: formData.qualification,
          job_category: formData.job_category,
          skills: formData.skills,
          min_experience: formData.min_experience,
          max_experience: formData.max_experience,
          job_location: formData.job_location,
          resume: formData.resume ? formData.resume.data : null,
          profile: formData.profile ? formData.profile.data : null,
          resume_filename: formData.resume ? formData.resume.filename : null,
          profile_filename: formData.profile ? formData.profile.filename : null,
        };
        endpoint = '/api/candidates';
        break;

      case 'consultant':
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          established_date: formData.established_date,
          contact_number_2: formData.contact_number_2,
          address_line_1: formData.address_line_1,
          state_id: formData.state_id,
          district_id: formData.district_id,
          taluka_id: formData.taluka_id,
          village_id: formData.village_id,
          zipcode: formData.zipcode,
          website_url: formData.website_url,
          gst_no: formData.gst_no,
          description: formData.description,
          profile_logo: formData.profile_logo
            ? formData.profile_logo.data
            : null,
          profile_logo_filename: formData.profile_logo
            ? formData.profile_logo.filename
            : null,
        };
        endpoint = '/api/consultants';
        break;

      case 'employer':
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          established_date: formData.established_date,
          company_sector: formData.company_sector,
          company_type: formData.company_type,
          contact_number_2: formData.contact_number_2,
          address_line_1: formData.address_line_1,
          state_id: formData.state_id,
          district_id: formData.district_id,
          taluka_id: formData.taluka_id,
          village_id: formData.village_id,
          zipcode: formData.zipcode,
          website_url: formData.website_url,
          gst_no: formData.gst_no,
          description: formData.description,
          profile_logo: formData.profile_logo
            ? formData.profile_logo.data
            : null,
          profile_logo_filename: formData.profile_logo
            ? formData.profile_logo.filename
            : null,
        };
        endpoint = '/api/employers';
        break;

      case 'institute':
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          head_of_institute: formData.head_of_institute,
          established_date: formData.established_date,
          approval_id: formData.approval_id,
          contact_number_2: formData.contact_number_2,
          institute_type: formData.institute_type,
          no_of_students: formData.no_of_students,
          address_line_1: formData.address_line_1,
          state_id: formData.state_id,
          district_id: formData.district_id,
          taluka_id: formData.taluka_id,
          village_id: formData.village_id,
          zipcode: formData.zipcode,
          website_url: formData.website_url,
          gst_no: formData.gst_no,
          description: formData.description,
          profile_logo: formData.profile_logo
            ? formData.profile_logo.data
            : null,
          profile_logo_filename: formData.profile_logo
            ? formData.profile_logo.filename
            : null,
        };
        endpoint = '/api/institutes';
        break;

      case 'gram_panchayat':
        payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          established_date: formData.established_date,
          contact_number_2: formData.contact_number_2,
          address_line_1: formData.address_line_1,
          state_id: formData.state_id,
          district_id: formData.district_id,
          taluka_id: formData.taluka_id,
          village_id: formData.village_id,
          zipcode: formData.zipcode,
          website_url: formData.website_url,
          gst_no: formData.gst_no,
          description: formData.description,
          profile_logo: formData.profile_logo
            ? formData.profile_logo.data
            : null,
          profile_logo_filename: formData.profile_logo
            ? formData.profile_logo.filename
            : null,
        };
        endpoint = '/api/gram-panchayats';
        break;
    }

    try {
      // Here you would make your API call with base64 data
      console.log('Payload with base64:', payload);

      // Example API call (uncomment and adjust as needed)
      /*
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token-here'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      */

      // For demo purposes, show success message
      Alert.alert(
        'Success',
        `${
          selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
        } registration successful!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole('');
    // Reset form data
    setFormData({
      email: '',
      password: '',
      confirm_password: '',
      phone: '',
      fname: '',
      middle_name: '',
      lname: '',
      dob: '',
      gender: '',
      blood_group: '',
      aadhar_no: '',
      pancard_no: '',
      profession: '',
      description: '',
      address_line_1: '',
      address_line_2: '',
      college_name: '',
      passout_year: '',
      qualification: '',
      job_category: '',
      skills: '',
      min_experience: '',
      max_experience: '',
      job_location: '',
      resume: null,
      profile: null,
      name: '',
      established_date: '',
      contact_number_2: '',
      website_url: '',
      gst_no: '',
      profile_logo: null,
      head_of_institute: '',
      approval_id: '',
      institute_type: '',
      no_of_students: '',
      company_sector: '',
      company_type: '',
      state_id: '',
      district_id: '',
      taluka_id: '',
      village_id: '',
      zipcode: '',
    });
  };

  const renderForm = () => {
    const commonProps = {
      formData,
      loadingStates: locationService.loadingStates,
      states: locationService.states,
      districts: locationService.districts,
      talukas: locationService.talukas,
      villages: locationService.villages,
      showStateList: locationService.showStateList,
      showDistrictList: locationService.showDistrictList,
      showTalukaList: locationService.showTalukaList,
      showVillageList: locationService.showVillageList,
      onInputChange: handleInputChange,
      onFetchDistricts: locationService.fetchDistricts,
      onFetchTalukas: locationService.fetchTalukas,
      onFetchVillages: locationService.fetchVillages,
      onFetchZipcode: locationService.fetchZipcode,
      onToggleDropdown: locationService.toggleDropdown,
      onMeasureDropdown: locationService.measureDropdown,
      getSelectedName: locationService.getSelectedName,
      onImagePicker: handleImagePicker,
      onSubmit: handleSubmit,
      isLoading,
    };

    switch (selectedRole) {
      case 'candidate':
        return <CandidateForm {...commonProps} />;

      case 'consultant':
        return <ConsultantForm {...commonProps} />;

      case 'employer':
        return <EmployerForm {...commonProps} />;

      case 'institute':
        return <InstituteForm {...commonProps} />;

      case 'gram_panchayat':
        return <GramPanchayatForm {...commonProps} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && <RoleSelection onRoleSelect={handleRoleSelect} />}

      {step === 2 && (
        <>
          <TouchableOpacity style={styles.backLink} onPress={handleBack}>
            <Text style={styles.backLinkText}>{t('back_to_roles')}</Text>
          </TouchableOpacity>

          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderForm()}
          </ScrollView>

          {/* Image Picker Modal */}
          <ImagePickerModal
            visible={imagePickerModal.visible}
            onClose={closeImagePickerModal}
            setProfile={handleImageSelect}
            noimg={true}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
    padding: w(5),
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: h(4),
  },
  backButton: {
    marginBottom: h(2),
    borderRadius: h(0.8),
    overflow: 'hidden',
  },
  backButtonGradient: {
    paddingVertical: h(1),
    paddingHorizontal: w(4),
    alignItems: 'center',
  },
  backButtonText: {
    color: globalColors.white,
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  backLink: {
    alignSelf: 'flex-start',
    marginBottom: h(2),
    paddingVertical: h(0.5),
    paddingHorizontal: w(0),
  },
  backLinkText: {
    color: globalColors.purplegradient1,
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-SemiBold',
    textDecorationLine: 'underline',
  },
});

export default SignUpScreen;
