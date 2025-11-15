import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../Theme/globalColors';
import { h, w, f } from 'walstar-rn-responsive';
import LocationFields from './LocationFields';
import { validateForm } from './validations';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const InstituteForm = ({
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
  isLoading,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigation = useNavigation();

  const API_BASE_URL = 'https://gramjob.walstarmedia.com/api';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  
  const handleSubmit = async () => {
    const errors = validateForm(formData, 'institute');
    
    if (Object.keys(errors).length > 0) {
      Alert.alert('Validation Error', Object.values(errors).join('\n'));
      return;
    }

    await registerInstitute();
  };

  const registerInstitute = async () => {
    try {
      setApiLoading(true);

      // Prepare form data according to the API requirements
      const formDataToSend = new FormData();

      // Add all fields according to the API structure
      formDataToSend.append('role_id', '5'); // Institute role ID
      formDataToSend.append('fname', formData.name); 
      formDataToSend.append('lname', "Institute"); 
      formDataToSend.append('middle_name', " middle_name"); 
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('contact_number_1', formData.phone);
      
      // Institute specific fields
      formDataToSend.append('head_of_institute', formData.head_of_institute || '');
      formDataToSend.append('established_date', formData.established_date || '');
      formDataToSend.append('approval_id', formData.approval_id || '');
      formDataToSend.append('institute_type', formData.institute_type || '');
      formDataToSend.append('no_of_students', formData.no_of_students || '');
      
      // Address fields
      formDataToSend.append('address_line_1', formData.address_line_1 || '');
      formDataToSend.append('address_line_2', formData.address_line_2 || '');
      formDataToSend.append('state_id', formData.state_id?.toString() || '');
      formDataToSend.append('district_id', formData.district_id?.toString() || '');
      formDataToSend.append('taluka_id', formData.taluka_id?.toString() || '');
      formDataToSend.append('village_id', formData.village_id?.toString() || '');
      formDataToSend.append('zipcode', formData.zipcode || '');

      // Additional fields
      formDataToSend.append('contact_number_2', formData.contact_number_2 || '');
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('website_url', formData.website_url || '');
      formDataToSend.append('gst_no', formData.gst_no || '');

      // File uploads
      if (formData.profile_logo && formData.profile_logo.path) {
        formDataToSend.append('profile', {
          uri: formData.profile_logo.path,
          type: formData.profile_logo.type || 'image/jpeg',
          name: formData.profile_logo.filename || 'profile_logo.jpg'
        });
      }

      console.log('Sending institute registration data...');

      const response = await fetch(`${API_BASE_URL}/registration`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
      console.log("Registration response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      if (responseData.status) {
        Alert.alert('Success', 'Institute registration successful!');
        navigation.navigate('Login');
        console.log('Registration successful:', responseData);
      } else {
        throw new Error(responseData.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      onInputChange(dateField, formattedDate);
    }
  };

  const showDatePickerModal = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'dd-mm-yyyy';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const instituteTypes = [
    { id: 1, name: 'Engineering College' },
    { id: 2, name: 'Medical College' },
    { id: 3, name: 'Arts College' },
    { id: 4, name: 'Science College' },
    { id: 5, name: 'Polytechnic' },
    { id: 6, name: 'ITI' },
  ];

  const isSubmitLoading = isLoading || apiLoading;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>Institute Registration</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Institute name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Full Name"
          value={formData.name}
          onChangeText={(text) => onInputChange('name', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Id *</Text>
        <TextInput
          style={styles.input}
          placeholder="test.institute@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => onInputChange('email', text)}
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
        <Text style={styles.label}>Head of Institute *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={formData.head_of_institute}
          onChangeText={(text) => onInputChange('head_of_institute', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Established Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showDatePickerModal('established_date')}
        >
          <Text style={formData.established_date ? styles.selectedText : styles.placeholderText}>
            {formatDate(formData.established_date)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Approval ID *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Approval ID"
          value={formData.approval_id}
          onChangeText={(text) => onInputChange('approval_id', text)}
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
            onChangeText={(text) => onInputChange('phone', text)}
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
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={formData.contact_number_2}
            onChangeText={(text) => onInputChange('contact_number_2', text)}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Institute Type</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {/* Implement institute type dropdown */}}
        >
          <Text style={formData.institute_type ? styles.selectedText : styles.placeholderText}>
            {formData.institute_type || 'Select Institute Type'}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>No of Students</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Total Students NO"
          keyboardType="numeric"
          value={formData.no_of_students}
          onChangeText={(text) => onInputChange('no_of_students', text)}
        />
      </View>

      <Text style={styles.sectionTitle}>Address Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line 1</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address line 1"
          value={formData.address_line_1}
          onChangeText={(text) => onInputChange('address_line_1', text)}
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website Url</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your website link"
          keyboardType="url"
          autoCapitalize="none"
          value={formData.website_url}
          onChangeText={(text) => onInputChange('website_url', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>GST No</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your GST No"
          value={formData.gst_no}
          onChangeText={(text) => onInputChange('gst_no', text)}
          maxLength={15}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Profile logo</Text>
        <TouchableOpacity 
          style={styles.fileUploadButton}
          onPress={() => onImagePicker('profile_logo')}
        >
          <Text style={styles.fileUploadText}>
            {formData.profile_logo ? formData.profile_logo.filename || 'Logo selected' : 'No file chosen'}
          </Text>
        </TouchableOpacity>
        {formData.profile_logo && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: formData.profile_logo.path }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <Text style={styles.fileInfoText}>
              {formData.profile_logo.filename} ({(formData.profile_logo.size / 1024).toFixed(1)} KB)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter institute description"
          value={formData.description}
          onChangeText={(text) => onInputChange('description', text)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={isSubmitLoading}
      >
        <LinearGradient
          colors={[globalColors.purplegradient1, globalColors.purplegradient2]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isSubmitLoading ? (
            <ActivityIndicator color={globalColors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Register as Institute</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.established_date ? new Date(formData.established_date) : new Date()}
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
    width: w(15),
    height: w(15),
    borderRadius: w(2),
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

export default InstituteForm;