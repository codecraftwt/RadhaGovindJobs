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
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { globalColors } from '../../Theme/globalColors';
import { h, w, f } from 'walstar-rn-responsive';
import LocationFields from './LocationFields';
import { validateForm } from './validations';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EmployerForm = ({
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
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = 'https://gramjob.walstarmedia.com/api';
  const AUTH_TOKEN = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5ZmQ3OTVjYS0xNjdjLTQ5YzEtOWQ5MS04NmIyZjlmODNjYzMiLCJqdGkiOiIyNTJmNmZjZDE1OTVkNzBjZjE1MDUzYjVlNGMxNTgzNTJlMGE2NDkzYTdkYzI2ZTdjN2MzNjFmMWI2MDE1MDQzNTM0MzZmYjY1OThlNzlkNiIsImlhdCI6MTc2Mjg0MTU3MC4xMzM3NiwibmJmIjoxNzYyODQxNTcwLjEzMzc2MSwiZXhwIjoxNzk0Mzc3NTcwLjEzMjYxMiwic3ViIjoiMSIsInNjb3BlcyI6W119.mnWy3RX7GIVL13pNo9DEwK4MdWqkUvQWzXfiW2HWE8sA-08TkblaSWTJU8DfBBeIhO_s0bFKtjrxmi33ZLfUmZYJbtoNFxLdB4jJwbvY7U0s0V-dDJX1MzXl3Gvb965YMYyIPbM9vip9p7iwdi0W3feGj3rArj_eSpyTGaju8s-haKJeW2JWM6uV91eCf81IDxGSgQrOAXQC8ZNi4vDZquCXw0qv2JrDs-iNLd8-gfl3rPNrci5ZkTpiSc7aSOnPJbohvzHKXAhGgEojzojUEbZV3WXLdSeNRbCdB60KTml7YDz-ctNHJHcB8NNnHkHgjGOeLpe8QvyKIueJVWVbeBNGMGkIMh7DinA9cOvczPwV6GogwqvNpSXASDLsamrHzywNYGmz7kciEdfRpVBpFp8cTEXALD8qdzAs-KJQoNrhxnwUIA52ugiKhNdJikzAyf7T6m4kX7LFVhztXUiXz4vOlBYbCm4NFkI3MkQzG9Nf79AWhQraokfADZw5AIGQAol9771JamMOUIhN5wOhKZuAZAUPhAUbpl65XW2PjoTOPXxmbaHgUvesDWANAvKcapJ89UBRFiL4aakGtxXeZ_rmzZ3__olHln4bPoo3NCzl9zURuKccVKmp09Ks8pYdUqsWPo6ihjNea_7l7aXwn1jSqFTzNVh1-h3pLRnwUjw';

  const companySectors = [
    { id: 1, name: 'IT & Software' },
    { id: 2, name: 'Manufacturing' },
    { id: 3, name: 'Healthcare' },
    { id: 4, name: 'Education' },
    { id: 5, name: 'Finance' },
    { id: 6, name: 'Retail' },
    { id: 7, name: 'Construction' },
  ];

  const companyTypes = [
    { id: 1, name: 'Private Limited' },
    { id: 2, name: 'Public Limited' },
    { id: 3, name: 'Partnership' },
    { id: 4, name: 'Proprietorship' },
    { id: 5, name: 'LLP' },
  ];

  const handleSubmit = async () => {
    const errors = validateForm(formData, 'employer');
    
    if (Object.keys(errors).length > 0) {
      Alert.alert('Validation Error', Object.values(errors).join('\n'));
      return;
    }

    await registerEmployer();
  };

  const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword(!showConfirmPassword);
};

  const registerEmployer = async () => {
    try {
      setApiLoading(true);

      // Prepare API payload according to the curl example
      const apiPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        description: formData.description || '',
        state_id: parseInt(formData.state_id) || 0,
        district_id: parseInt(formData.district_id) || 0,
        taluka_id: parseInt(formData.taluka_id) || 0,
        village_id: parseInt(formData.village_id) || 0,
        contact_number_2: formData.contact_number_2 || '',
        address_line_1: formData.address_line_1 || '',
        address_line_2: formData.address_line_2 || '',
        latitude: formData.latitude || '',
        longitude: formData.longitude || '',
        zipcode: formData.zipcode || '',
        website_url: formData.website_url || '',
        registered_date: formData.established_date || new Date().toISOString().split('T')[0],
        gst_no: formData.gst_no || '',
        profile: formData.profile_logo ? formData.profile_logo.data : ''
      };

      console.log('Sending payload:', apiPayload);

      const response = await fetch(`${API_BASE_URL}/employers`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': AUTH_TOKEN,
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
        },
        body: JSON.stringify(apiPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      if (responseData.status) {
        Alert.alert('Success', 'Employer registration successful!');
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

  const handleSectorSelect = (sector) => {
    onInputChange('company_sector', sector.name);
    onInputChange('company_sector_id', sector.id.toString());
    setShowSectorDropdown(false);
  };

  const handleTypeSelect = (type) => {
    onInputChange('company_type', type.name);
    onInputChange('company_type_id', type.id.toString());
    setShowTypeDropdown(false);
  };

  const renderDropdownModal = (visible, data, onSelect, selectedValue, type) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (type === 'sector') setShowSectorDropdown(false);
          if (type === 'type') setShowTypeDropdown(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            if (type === 'sector') setShowSectorDropdown(false);
            if (type === 'type') setShowTypeDropdown(false);
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
                  const isSelected = selectedValue === item.name;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalDropdownItem,
                        isSelected && styles.selectedDropdownItem,
                      ]}
                      onPress={() => {
                        onSelect(item);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalDropdownItemText,
                          isSelected && styles.selectedDropdownItemText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const isSubmitLoading = isLoading || apiLoading;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>Employer Registration</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Employer name *</Text>
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
          placeholder="test.employer@gmail.com"
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
          onChangeText={(text) => onInputChange('password', text)}
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password *</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirm_password}
          onChangeText={(text) => onInputChange('confirm_password', text)}
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
        <Text style={styles.label}>Company Sector</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowSectorDropdown(!showSectorDropdown);
            setShowTypeDropdown(false);
          }}
        >
          <Text style={formData.company_sector ? styles.selectedText : styles.placeholderText}>
            {formData.company_sector || 'Select Sector'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showSectorDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          showSectorDropdown,
          companySectors,
          handleSectorSelect,
          formData.company_sector,
          'sector'
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company Type</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {
            setShowTypeDropdown(!showTypeDropdown);
            setShowSectorDropdown(false);
          }}
        >
          <Text style={formData.company_type ? styles.selectedText : styles.placeholderText}>
            {formData.company_type || 'Select Type'}
          </Text>
          <Text style={styles.dropdownArrow}>
            {showTypeDropdown ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {renderDropdownModal(
          showTypeDropdown,
          companyTypes,
          handleTypeSelect,
          formData.company_type,
          'type'
        )}
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
            placeholder="Enter alternate contact number"
            keyboardType="phone-pad"
            value={formData.contact_number_2}
            onChangeText={(text) => onInputChange('contact_number_2', text)}
            maxLength={10}
          />
        </View>
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address Line 2</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter address line 2"
          value={formData.address_line_2}
          onChangeText={(text) => onInputChange('address_line_2', text)}
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
          placeholder="Enter website URL"
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
          placeholder="Enter GST number"
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
          placeholder="Enter company description"
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
            <Text style={styles.submitButtonText}>Register as Employer</Text>
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
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: w(4),
    top: h(1.5),
    zIndex: 1,
  },
  eyeText: {
    fontSize: 18,
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
});

export default EmployerForm;