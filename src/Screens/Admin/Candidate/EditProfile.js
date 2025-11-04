// EditProfileModal.js   created for test
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';

const EditProfileModal = ({ visible, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    middle_name: '',
    email: '',
    contact_number_1: '',
    contact_number_2: '',
    dob: '',
    aadhar_no: '',
    pancard_no: '',
    blood_group: '',
    college_name: '',
    passout_year: '',
    profession: '',
    job_location: '',
    min_experience: '',
    max_experience: '',
    address_line_1: '',
    address_line_2: '',
    zipcode: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [openBloodGroup, setOpenBloodGroup] = useState(false);

  // Blood group options
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

  useEffect(() => {
    if (userData) {
      setFormData({
        fname: userData.fname || '',
        lname: userData.lname || '',
        middle_name: userData.middle_name || '',
        email: userData.email || '',
        contact_number_1: userData.contact_number_1 || '',
        contact_number_2: userData.contact_number_2 || '',
        dob: userData.dob || '',
        aadhar_no: userData.aadhar_no || '',
        pancard_no: userData.pancard_no || '',
        blood_group: userData.blood_group || '',
        college_name: userData.college_name || '',
        passout_year: userData.passout_year || '',
        profession: userData.profession || '',
        job_location: userData.job_location || '',
        min_experience: userData.min_experience || '',
        max_experience: userData.max_experience || '',
        address_line_1: userData.address_line_1 || '',
        address_line_2: userData.address_line_2 || '',
        zipcode: userData.zipcode || '',
      });
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fname) newErrors.fname = 'First name is required';
    if (!formData.lname) newErrors.lname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.contact_number_1) newErrors.contact_number_1 = 'Contact number is required';
    if (formData.contact_number_1 && !/^\d{10}$/.test(formData.contact_number_1)) newErrors.contact_number_1 = 'Contact number must be 10 digits';
    if (formData.aadhar_no && !/^\d{12}$/.test(formData.aadhar_no)) newErrors.aadhar_no = 'Aadhar must be 12 digits';
    // if (formData.pancard_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancard_no)) newErrors.pancard_no = 'PAN must be valid format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSave(formData);
      Alert.alert('Success', 'Profile updated successfully');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, dob: formattedDate }));
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const InputField = ({ label, value, onChange, placeholder, keyboardType = 'default', maxLength, error }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={globalColors.mauve}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={h(3)} color={globalColors.darkblack} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Personal Information */}
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.row}>
            <InputField
              label="First Name *"
              value={formData.fname}
              onChange={(value) => updateField('fname', value)}
              placeholder="Enter first name"
              error={errors.fname}
            />
            <InputField
              label="Last Name *"
              value={formData.lname}
              onChange={(value) => updateField('lname', value)}
              placeholder="Enter last name"
              error={errors.lname}
            />
          </View>

          <InputField
            label="Middle Name"
            value={formData.middle_name}
            onChange={(value) => updateField('middle_name', value)}
            placeholder="Enter middle name"
          />

          <InputField
            label="Email *"
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            placeholder="Enter email"
            keyboardType="email-address"
            error={errors.email}
          />

          <View style={styles.row}>
            <InputField
              label="Contact No. *"
              value={formData.contact_number_1}
              onChange={(value) => updateField('contact_number_1', value)}
              placeholder="10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.contact_number_1}
            />
            <InputField
              label="Alternate Contact"
              value={formData.contact_number_2}
              onChange={(value) => updateField('contact_number_2', value)}
              placeholder="10-digit number"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                value={formData.dob}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={globalColors.mauve}
                editable={false}
              />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          {/* Professional Information */}
          <Text style={styles.sectionTitle}>Professional Information</Text>

          <InputField
            label="Profession"
            value={formData.profession}
            onChange={(value) => updateField('profession', value)}
            placeholder="Enter profession"
          />

          <InputField
            label="Job Location"
            value={formData.job_location}
            onChange={(value) => updateField('job_location', value)}
            placeholder="Enter job location"
          />

          <View style={styles.row}>
            <InputField
              label="Min Experience"
              value={formData.min_experience}
              onChange={(value) => updateField('min_experience', value)}
              placeholder="Years"
              keyboardType="numeric"
              maxLength={2}
            />
            <InputField
              label="Max Experience"
              value={formData.max_experience}
              onChange={(value) => updateField('max_experience', value)}
              placeholder="Years"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          {/* Education */}
          <Text style={styles.sectionTitle}>Education</Text>

          <InputField
            label="College/University"
            value={formData.college_name}
            onChange={(value) => updateField('college_name', value)}
            placeholder="Enter college name"
          />

          <InputField
            label="Passout Year"
            value={formData.passout_year}
            onChange={(value) => updateField('passout_year', value)}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
          />

          {/* Identity Documents */}
          <Text style={styles.sectionTitle}>Identity Documents</Text>

          <InputField
            label="Aadhar Number"
            value={formData.aadhar_no}
            onChange={(value) => updateField('aadhar_no', value)}
            placeholder="12-digit number"
            keyboardType="numeric"
            maxLength={12}
            error={errors.aadhar_no}
          />

          <InputField
            label="PAN Number"
            value={formData.pancard_no}
            onChange={(value) => updateField('pancard_no', value.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
            error={errors.pancard_no}
          />

          {/* Blood Group Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Blood Group</Text>
            <DropDownPicker
              open={openBloodGroup}
              setOpen={setOpenBloodGroup}
              value={formData.blood_group}
              items={bloodGroups}
              setValue={(value) => updateField('blood_group', value)}
              placeholder="Select blood group"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
            />
          </View>

          {/* Address */}
          <Text style={styles.sectionTitle}>Address</Text>

          <InputField
            label="Address Line 1"
            value={formData.address_line_1}
            onChange={(value) => updateField('address_line_1', value)}
            placeholder="Enter address line 1"
          />

          <InputField
            label="Address Line 2"
            value={formData.address_line_2}
            onChange={(value) => updateField('address_line_2', value)}
            placeholder="Enter address line 2"
          />

          <InputField
            label="ZIP Code"
            value={formData.zipcode}
            onChange={(value) => updateField('zipcode', value)}
            placeholder="Enter ZIP code"
            keyboardType="numeric"
            maxLength={6}
          />

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={globalColors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: globalColors.backgroundshade,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: w(4),
    backgroundColor: globalColors.white,
    borderBottomWidth: 1,
    borderBottomColor: globalColors.lightgrey,
  },
  modalTitle: {
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.darkblack,
  },
  scrollView: {
    flex: 1,
    padding: w(4),
  },
  sectionTitle: {
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.darkblack,
    marginTop: h(2),
    marginBottom: h(1),
  },
  inputContainer: {
    marginBottom: h(1.5),
  },
  inputLabel: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.darkblack,
    marginBottom: h(0.5),
  },
  input: {
    backgroundColor: globalColors.white,
    borderRadius: w(2),
    padding: w(3),
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.darkblack,
    elevation: 2,
  },
  inputError: {
    borderColor: globalColors.red,
    borderWidth: 1,
  },
  errorText: {
    color: globalColors.red,
    fontSize: f(1.4),
    fontFamily: 'BaiJamjuree-Medium',
    marginTop: h(0.5),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: w(2),
  },
  dropdown: {
    backgroundColor: globalColors.white,
    borderWidth: 0,
    elevation: 2,
  },
  dropdownContainer: {
    backgroundColor: globalColors.white,
    borderWidth: 0,
    elevation: 3,
  },
  dropdownText: {
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.darkblack,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: h(3),
    marginBottom: h(2),
    gap: w(3),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: globalColors.lightgrey,
    padding: w(3),
    borderRadius: w(2),
    alignItems: 'center',
  },
  cancelButtonText: {
    color: globalColors.white,
    fontFamily: 'BaiJamjuree-Medium',
    fontSize: f(1.6),
  },
  saveButton: {
    flex: 1,
    backgroundColor: globalColors.commonlightpink,
    padding: w(3),
    borderRadius: w(2),
    alignItems: 'center',
  },
  saveButtonText: {
    color: globalColors.white,
    fontFamily: 'BaiJamjuree-Medium',
    fontSize: f(1.6),
  },
});

export default EditProfileModal;