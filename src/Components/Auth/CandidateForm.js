import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../Theme/globalColors';
import { h, w, f } from 'walstar-rn-responsive';
import LocationFields from './LocationFields';
import { validateForm } from './validations';
import { useNavigation } from '@react-navigation/native';
import DocumentUpload from '../DocumentUpload';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CandidateForm = ({
  formData,
  loadingStates,
  states,
  districts,
  talukas,
  villages,
  showStateList,
  showDistrictList,
  showTalukaList,
  showVillageList,
  onInputChange,
  onFetchDistricts,
  onFetchTalukas,
  onFetchVillages,
  onFetchZipcode,
  onToggleDropdown,
  onMeasureDropdown,
  getSelectedName,
  onImagePicker,
  onSubmit,
  isLoading,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showBloodGroupDropdown, setShowBloodGroupDropdown] = useState(false);
  const [showQualificationDropdown, setShowQualificationDropdown] =
    useState(false);
  const [showJobCategoryDropdown, setShowJobCategoryDropdown] = useState(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  // New states for API data
  const [jobCategories, setJobCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loadingJobCategories, setLoadingJobCategories] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const [dropdownLayouts, setDropdownLayouts] = useState({
    gender: { x: 0, y: 0, width: 0, height: 0 },
    bloodGroup: { x: 0, y: 0, width: 0, height: 0 },
    qualification: { x: 0, y: 0, width: 0, height: 0 },
    jobCategory: { x: 0, y: 0, width: 0, height: 0 },
    skills: { x: 0, y: 0, width: 0, height: 0 },
  });
useEffect(() => {
  console.log('=== Document Upload Debug ===');
  console.log('formData.resume:', formData.resume);
  console.log('Type of resume:', typeof formData.resume);
  if (formData.resume && typeof formData.resume === 'string') {
    console.log('Resume string length:', formData.resume.length);
    console.log('First 100 chars:', formData.resume.substring(0, 100));
  }
  console.log('=== End Debug ===');
}, [formData.resume]);

  const API_BASE_URL = 'https://gramjob.walstarmedia.com/api';

  const genders = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];

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

  const qualifications = [
    { label: 'High School', value: 'high_school' },
    { label: 'Diploma', value: 'diploma' },
    { label: "Bachelor's Degree", value: 'bachelors' },
    { label: "Master's Degree", value: 'masters' },
    { label: 'PhD', value: 'phd' },
    { label: 'Certificate', value: 'certificate' },
    { label: 'Associate Degree', value: 'associate' },
    { label: 'Professional Certification', value: 'professional_cert' },
  ];

  // Fetch job categories on component mount
  useEffect(() => {
    fetchJobCategories();
  }, []);

  // Fetch skills when job category is selected
  useEffect(() => {
    if (formData.job_category) {
      fetchSkills(formData.job_category);
    }
  }, [formData.job_category]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const fetchJobCategories = async () => {
    try {
      setLoadingJobCategories(true);
      const response = await fetch(`${API_BASE_URL}/job_category`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job categories');
      }

      const data = await response.json();
      if (data.status && data.data) {
        setJobCategories(data.data.map(category => ({
          label: category.category_name,
          value: category.id.toString()
        })));
      }
    } catch (error) {
      console.error('Error fetching job categories:', error);
      Alert.alert('Error', 'Failed to load job categories');
    } finally {
      setLoadingJobCategories(false);
    }
  };

  const fetchSkills = async (jobCategoryId) => {
    try {
      setLoadingSkills(true);
      const response = await fetch(`${API_BASE_URL}/fetch-skill/${jobCategoryId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }

      const data = await response.json();
      if (data.data) {
        setSkills(data.data.map(skill => ({
          label: skill.name,
          value: skill.id.toString()
        })));
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      Alert.alert('Error', 'Failed to load skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleSubmit = async () => {
    const errors = validateForm(formData, 'candidate');

    if (Object.keys(errors).length > 0) {
      Alert.alert('Validation Error', Object.values(errors).join('\n'));
      return;
    }

    // Prepare form data according to the curl example
    const formDataToSend = new FormData();

    // Add all fields according to the curl example
    formDataToSend.append('role_id', '2'); // Candidate role
    formDataToSend.append('fname', formData.fname || '');
    formDataToSend.append('middle_name', formData.middle_name || '');
    formDataToSend.append('lname', formData.lname || '');
    formDataToSend.append('email', formData.email || '');
    formDataToSend.append('password', formData.password || '');
    formDataToSend.append('contact_number_1', formData.phone || '');
    formDataToSend.append('dob', formData.dob || '');
    
    // Address fields
    formDataToSend.append('state_id', formData.state_id?.toString() || '');
    formDataToSend.append('district_id', formData.district_id?.toString() || '');
    formDataToSend.append('taluka_id', formData.taluka_id?.toString() || '');
    formDataToSend.append('village_id', formData.village_id?.toString() || '');
    formDataToSend.append('zipcode', formData.zipcode || '');
    formDataToSend.append('address_line_1', formData.address_line_1 || 'Pune City');

    // Additional optional fields
    if (formData.contact_number_2) {
      formDataToSend.append('contact_number_2', formData.contact_number_2);
    }
    if (formData.gender) {
      formDataToSend.append('gender', formData.gender);
    }

    // DEBUG: Check what's in formData.resume
    console.log('formData.resume before processing:', formData.resume);

    // File uploads
    if (formData.profile && formData.profile.path) {
      formDataToSend.append('profile', {
        uri: formData.profile.path,
        type: formData.profile.type || 'image/jpeg',
        name: formData.profile.filename || 'profile.jpg'
      });
    }

    // FIX: Handle resume upload - check for base64 data or file path
    if (formData.resume) {
      console.log('Resume data found:', formData.resume);
      
      // Check if it's base64 data (from your logs)
      if (formData.resume.includes('JVBERi0xLjQNJeLjz9MNCjE1')) { // PDF base64 header
        console.log('Resume is base64 data');
        // Convert base64 to blob or handle appropriately
        formDataToSend.append('resume', {
          uri: `data:application/pdf;base64,${formData.resume}`,
          type: 'application/pdf',
          name: 'resume.pdf'
        });
      } 
      // Check if it has file path structure
      else if (formData.resume.path || formData.resume.uri) {
        const uri = formData.resume.path || formData.resume.uri;
        const type = formData.resume.type || 'application/pdf';
        const name = formData.resume.filename || formData.resume.name || 'resume.pdf';
        
        console.log('Adding resume file from path:', { uri, type, name });
        
        formDataToSend.append('resume', {
          uri: uri,
          type: type,
          name: name
        });
      }
      // If it's just base64 string without the object wrapper
      else if (typeof formData.resume === 'string' && formData.resume.length > 100) {
        console.log('Resume is base64 string');
        formDataToSend.append('resume', {
          uri: `data:application/pdf;base64,${formData.resume}`,
          type: 'application/pdf',
          name: 'resume.pdf'
        });
      }
      else {
        console.log('Unknown resume format:', formData.resume);
      }
    } else {
      console.log('No resume data found in formData');
    }

    try {
      console.log("Sending registration request...");
      
      // Log form data for debugging
      console.log("FormData contents:");
      for (let [key, value] of formDataToSend._parts) {
        console.log(key, typeof value === 'object' ? '[FILE OBJECT]' : value);
      }

      const response = await fetch(`${API_BASE_URL}/registration`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
        },
        body: formDataToSend,
      });

      console.log("Response status:", response.status);
      
      // Get raw response text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.log("Response is not JSON:", responseText);
        throw new Error('Server returned non-JSON response: ' + responseText);
      }

      console.log("Parsed response:", result);

      if (response.ok) {
        Alert.alert('Success', 'Candidate registration successful!');
        navigation.navigate('Login');
      } else {
        throw new Error(result.message || `Registration failed with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onInputChange(dateField, formattedDate);
    }
  };

  const showDatePickerModal = field => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const formatDate = dateString => {
    if (!dateString) return 'dd-mm-yyyy';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const handleGenderSelect = gender => {
    onInputChange('gender', gender.value);
    setShowGenderDropdown(false);
  };

  const handleBloodGroupSelect = bloodGroup => {
    onInputChange('blood_group', bloodGroup.value);
    setShowBloodGroupDropdown(false);
  };

  const handleQualificationSelect = qualification => {
    onInputChange('qualification', qualification.value);
    setShowQualificationDropdown(false);
  };

  const handleJobCategorySelect = jobCategory => {
    onInputChange('job_category', jobCategory.value);
    setShowJobCategoryDropdown(false);
    // Clear skills when job category changes
    onInputChange('skills', '');
    setSkills([]);
  };

  const handleSkillSelect = skill => {
    const currentSkills = formData.skills ? formData.skills.split(',') : [];

    if (currentSkills.includes(skill.value)) {
      const updatedSkills = currentSkills.filter(s => s !== skill.value);
      onInputChange('skills', updatedSkills.join(','));
    } else {
      const updatedSkills = [...currentSkills, skill.value];
      onInputChange('skills', updatedSkills.join(','));
    }
  };

  const measureDropdown = (type, event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setDropdownLayouts(prev => ({
      ...prev,
      [type]: { x, y, width, height },
    }));
  };

  const renderDropdownModal = (
    type,
    visible,
    data,
    onSelect,
    selectedValue,
  ) => {
    const isMultiSelect = type === 'skills';

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (type === 'gender') setShowGenderDropdown(false);
          if (type === 'bloodGroup') setShowBloodGroupDropdown(false);
          if (type === 'qualification') setShowQualificationDropdown(false);
          if (type === 'jobCategory') setShowJobCategoryDropdown(false);
          if (type === 'skills') setShowSkillsDropdown(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            if (type === 'gender') setShowGenderDropdown(false);
            if (type === 'bloodGroup') setShowBloodGroupDropdown(false);
            if (type === 'qualification') setShowQualificationDropdown(false);
            if (type === 'jobCategory') setShowJobCategoryDropdown(false);
            if (type === 'skills') setShowSkillsDropdown(false);
          }}
        >
          <View style={styles.centeredModalContainer}>
            <View style={styles.centeredModalContent}>
              <ScrollView
                style={styles.modalScrollView}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {data.map(item => {
                  let isSelected = false;

                  if (isMultiSelect) {
                    const selectedSkills = selectedValue
                      ? selectedValue.split(',')
                      : [];
                    isSelected = selectedSkills.includes(item.value);
                  } else {
                    isSelected = selectedValue === item.value;
                  }

                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.modalDropdownItem,
                        isSelected && styles.selectedDropdownItem,
                        isMultiSelect && styles.multiSelectItem,
                      ]}
                      onPress={() => {
                        onSelect(item);
                        if (!isMultiSelect) {
                          if (type === 'gender') setShowGenderDropdown(false);
                          if (type === 'bloodGroup')
                            setShowBloodGroupDropdown(false);
                          if (type === 'qualification')
                            setShowQualificationDropdown(false);
                          if (type === 'jobCategory')
                            setShowJobCategoryDropdown(false);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.modalDropdownItemText,
                          isSelected && styles.selectedDropdownItemText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isMultiSelect && isSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {isMultiSelect && (
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => setShowSkillsDropdown(false)}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>Candidate Registration</Text>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.label}>Candidate First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            value={formData.fname}
            onChangeText={text => onInputChange('fname', text)}
          />
        </View>

        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.label}>Middle Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter middle name"
            value={formData.middle_name}
            onChangeText={text => onInputChange('middle_name', text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={formData.lname}
          onChangeText={text => onInputChange('lname', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Id *</Text>
        <TextInput
          style={styles.input}
          placeholder="test.candidate@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={text => onInputChange('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password *</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={text => onInputChange('password', text)}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={togglePasswordVisibility}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye' : 'eye-off'}
            size={w(5.5)}
            color={globalColors.mauve}
          />
        </TouchableOpacity>
      </View>
      </View>

    {/* Confirm Password Field - Fixed */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirm_password}
          onChangeText={text => onInputChange('confirm_password', text)}
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={toggleConfirmPasswordVisibility}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? 'eye' : 'eye-off'}
            size={w(5.5)}
            color={globalColors.mauve}
          />
        </TouchableOpacity>
      </View>
        <Text style={styles.hintText}>(Minimum 6 characters)</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>DOB</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showDatePickerModal('dob')}
        >
          <Text
            style={formData.dob ? styles.selectedText : styles.placeholderText}
          >
            {formatDate(formData.dob)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gender Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowGenderDropdown(!showGenderDropdown);
            setShowBloodGroupDropdown(false);
            setShowQualificationDropdown(false);
            setShowJobCategoryDropdown(false);
            setShowSkillsDropdown(false);
          }}
          onLayout={event => measureDropdown('gender', event)}
        >
          <Text
            style={
              formData.gender ? styles.selectedText : styles.placeholderText
            }
          >
            {formData.gender
              ? genders.find(g => g.value === formData.gender)?.label
              : 'Select Gender'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showGenderDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          'gender',
          showGenderDropdown,
          genders,
          handleGenderSelect,
          formData.gender,
        )}
      </View>

      {/* Blood Group Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Blood Group</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowBloodGroupDropdown(!showBloodGroupDropdown);
            setShowGenderDropdown(false);
            setShowQualificationDropdown(false);
            setShowJobCategoryDropdown(false);
            setShowSkillsDropdown(false);
          }}
          onLayout={event => measureDropdown('bloodGroup', event)}
        >
          <Text
            style={
              formData.blood_group
                ? styles.selectedText
                : styles.placeholderText
            }
          >
            {formData.blood_group ? formData.blood_group : 'Select Blood Group'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showBloodGroupDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          'bloodGroup',
          showBloodGroupDropdown,
          bloodGroups,
          handleBloodGroupSelect,
          formData.blood_group,
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Aadhar Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your valid Aadhar Card Number"
          keyboardType="numeric"
          value={formData.aadhar_no}
          onChangeText={text => onInputChange('aadhar_no', text)}
          maxLength={12}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pan Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your valid Pan Card Number"
          value={formData.pancard_no}
          onChangeText={text => onInputChange('pancard_no', text)}
          maxLength={10}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile number *</Text>
        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={text => onInputChange('phone', text)}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Alternate Contact No</Text>
        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+91</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Enter alternate contact number"
            keyboardType="phone-pad"
            value={formData.contact_number_2}
            onChangeText={text => onInputChange('contact_number_2', text)}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Profession</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your profession"
          value={formData.profession}
          onChangeText={text => onInputChange('profession', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter description"
          value={formData.description}
          onChangeText={text => onInputChange('description', text)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <Text style={styles.sectionTitle}>Address Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address line 1"
          value={formData.address_line_1}
          onChangeText={text => onInputChange('address_line_1', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address line 2"
          value={formData.address_line_2}
          onChangeText={text => onInputChange('address_line_2', text)}
        />
      </View>

      {/* Location Fields */}
      <LocationFields
        formData={formData}
        loadingStates={loadingStates}
        states={states}
        districts={districts}
        talukas={talukas}
        villages={villages}
        showStateList={showStateList}
        showDistrictList={showDistrictList}
        showTalukaList={showTalukaList}
        showVillageList={showVillageList}
        onInputChange={onInputChange}
        onFetchDistricts={onFetchDistricts}
        onFetchTalukas={onFetchTalukas}
        onFetchVillages={onFetchVillages}
        onFetchZipcode={onFetchZipcode}
        onToggleDropdown={onToggleDropdown}
        onMeasureDropdown={onMeasureDropdown}
        getSelectedName={getSelectedName}
      />

      <Text style={styles.sectionTitle}>Education Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>College Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter college name"
          value={formData.college_name}
          onChangeText={text => onInputChange('college_name', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Passout Year</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter passout year"
          keyboardType="numeric"
          value={formData.passout_year}
          onChangeText={text => onInputChange('passout_year', text)}
          maxLength={4}
        />
      </View>

      {/* Qualification Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Qualification</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowQualificationDropdown(!showQualificationDropdown);
            setShowGenderDropdown(false);
            setShowBloodGroupDropdown(false);
            setShowJobCategoryDropdown(false);
            setShowSkillsDropdown(false);
          }}
          onLayout={event => measureDropdown('qualification', event)}
        >
          <Text
            style={
              formData.qualification
                ? styles.selectedText
                : styles.placeholderText
            }
          >
            {formData.qualification
              ? qualifications.find(q => q.value === formData.qualification)
                  ?.label
              : 'Select Qualification'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showQualificationDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          'qualification',
          showQualificationDropdown,
          qualifications,
          handleQualificationSelect,
          formData.qualification,
        )}
      </View>

      {/* Job Category Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Job Category</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowJobCategoryDropdown(!showJobCategoryDropdown);
            setShowGenderDropdown(false);
            setShowBloodGroupDropdown(false);
            setShowQualificationDropdown(false);
            setShowSkillsDropdown(false);
          }}
          onLayout={event => measureDropdown('jobCategory', event)}
        >
          <View style={styles.dropdownContent}>
            <Text
              style={
                formData.job_category
                  ? styles.selectedText
                  : styles.placeholderText
              }
            >
              {formData.job_category
                ? jobCategories.find(jc => jc.value === formData.job_category)
                    ?.label
                : 'Select Job Category'}
            </Text>
            {loadingJobCategories && (
              <ActivityIndicator size="small" color={globalColors.mauve} />
            )}
          </View>
          <Text style={styles.dropdownArrow}>
            {showJobCategoryDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          'jobCategory',
          showJobCategoryDropdown,
          jobCategories,
          handleJobCategorySelect,
          formData.job_category,
        )}
      </View>

      {/* Skills Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Skills</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            !formData.job_category && styles.disabledButton
          ]}
          onPress={() => {
            if (formData.job_category) {
              setShowSkillsDropdown(!showSkillsDropdown);
              setShowGenderDropdown(false);
              setShowBloodGroupDropdown(false);
              setShowQualificationDropdown(false);
              setShowJobCategoryDropdown(false);
            }
          }}
          onLayout={event => measureDropdown('skills', event)}
          disabled={!formData.job_category}
        >
          <View style={styles.dropdownContent}>
            <Text
              style={
                formData.skills ? styles.selectedText : styles.placeholderText
              }
            >
              {formData.skills
                ? `${formData.skills.split(',').length} skill(s) selected`
                : formData.job_category ? 'Select Skills' : 'Select Job Category First'}
            </Text>
            {loadingSkills && (
              <ActivityIndicator size="small" color={globalColors.mauve} />
            )}
          </View>
          <Text style={styles.dropdownArrow}>
            {showSkillsDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          'skills',
          showSkillsDropdown,
          skills,
          handleSkillSelect,
          formData.skills,
        )}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.label}>Minimum Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Min years"
            keyboardType="numeric"
            value={formData.min_experience}
            onChangeText={text => onInputChange('min_experience', text)}
          />
        </View>

        <View style={[styles.inputContainer, styles.halfInput]}>
          <Text style={styles.label}>Maximum Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Max years"
            keyboardType="numeric"
            value={formData.max_experience}
            onChangeText={text => onInputChange('max_experience', text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Job Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter preferred job location"
          value={formData.job_location}
          onChangeText={text => onInputChange('job_location', text)}
        />
      </View>

      {/* Resume Upload using DocumentUpload Component */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Resume Upload *</Text>
        <DocumentUpload 
          type="Upload Resume" 
          onUploadComplete={(fileInfo) => {
            console.log('Resume uploaded callback - raw fileInfo:', fileInfo);
            if (fileInfo.uri) {
              // If it has a file URI
            onInputChange('resume', {
              path: fileInfo.uri,
              filename: fileInfo.name || 'resume.pdf',
              size: fileInfo.size,
                type: fileInfo.type || 'application/pdf'
              });
            } else if (fileInfo.base64) {
              // If it's base64 data
              console.log('Setting resume as base64 data');
              onInputChange('resume', fileInfo.base64);
            } else if (typeof fileInfo === 'string') {
              console.log('Setting resume as base64 string');
              onInputChange('resume', fileInfo);
            } else {
              console.log('Unknown fileInfo structure, setting raw:', fileInfo);
              onInputChange('resume', fileInfo);
            }
          }}
          onRemove={() => {
            console.log('Resume removed');
            onInputChange('resume', null);
          }}
        />
        {formData.resume && (
          <Text style={styles.fileInfoText}>
            Selected: {formData.resume.filename} ({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
          </Text>
        )}
      </View>

      {/* Profile Photo Upload */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Profile Photo Upload</Text>
        <TouchableOpacity
          style={styles.fileUploadButton}
          onPress={() => onImagePicker('profile')}
        >
          <Text style={styles.fileUploadText}>
            {formData.profile
              ? formData.profile.filename || 'Photo selected'
              : 'No file chosen'}
          </Text>
        </TouchableOpacity>
        {formData.profile && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: formData.profile.path }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <Text style={styles.fileInfoText}>
              {formData.profile.filename} ({(formData.profile.size / 1024).toFixed(1)} KB)
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[globalColors.purplegradient1, globalColors.purplegradient2]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color={globalColors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Register as Candidate</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.dob ? new Date(formData.dob) : new Date('2000-01-01')}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formTitle: {
    fontSize: f(3),
    fontFamily: 'BaiJamjuree-SemiBold',
    textAlign: 'center',
    marginBottom: h(3),
    color: globalColors.black,
  },
  sectionTitle: {
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.black,
    marginTop: h(2),
    marginBottom: h(1),
    paddingLeft: w(1),
  },
  inputContainer: {
    marginBottom: h(1.5),
    position: 'relative',
  },
  label: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.7),
    color: globalColors.black,
    marginBottom: h(0.5),
    marginLeft: w(1),
  },
  input: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderRadius: h(0.8),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.black,
  },
  textArea: {
    minHeight: h(10),
    textAlignVertical: 'top',
  },
  hintText: {
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.5),
    color: globalColors.mauve,
    marginTop: h(0.5),
    marginLeft: w(1),
  },
  datePickerButton: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderRadius: h(0.8),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
    justifyContent: 'center',
  },
  dropdownButton: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderRadius: h(0.8),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  selectedText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.black,
  },
  placeholderText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.mauve,
  },
  dropdownArrow: {
    fontSize: f(1.8),
    color: globalColors.mauve,
    marginLeft: w(2),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderTopLeftRadius: h(0.8),
    borderBottomLeftRadius: h(0.8),
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: globalColors.lightpink,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.black,
  },
  phoneInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 0,
  },
  fileUploadButton: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderRadius: h(0.8),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
    borderStyle: 'dashed',
  },
  fileUploadText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.mauve,
    textAlign: 'center',
  },
  fileInfoText: {
    fontFamily: 'BaiJamjuree-Regular',
    fontSize: f(1.4),
    color: globalColors.mauve,
    marginTop: h(0.5),
    marginLeft: w(1),
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginTop: h(1),
  },
  imagePreview: {
    width: w(20),
    height: w(20),
    borderRadius: w(10),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
  },
  submitButton: {
    borderRadius: h(0.8),
    marginTop: h(2),
    marginBottom: h(4),
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: h(1.5),
    paddingHorizontal: w(4),
    alignItems: 'center',
  },
  submitButtonText: {
    color: globalColors.white,
    fontSize: f(2),
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  // Dropdown Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredModalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  centeredModalContent: {
    maxHeight: 300,
  },
  modalScrollView: {
    paddingVertical: 10,
  },
  modalDropdownItem: {
    padding: h(1.5),
    borderBottomWidth: 1,
    borderBottomColor: globalColors.lightpink,
  },
  selectedDropdownItem: {
    backgroundColor: globalColors.purplegradient1,
  },
  modalDropdownItemText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.8),
    color: globalColors.black,
  },
  selectedDropdownItemText: {
    color: globalColors.white,
  },
  multiSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: f(1.8),
    color: globalColors.white,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: globalColors.purplegradient1,
    padding: h(1.5),
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  doneButtonText: {
    color: globalColors.white,
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: w(4),
    top: h(1.5),
    zIndex: 1,
  },
});

export default CandidateForm;