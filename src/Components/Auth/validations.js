export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateLocation = (formData) => {
  return formData.state_id && formData.district_id && formData.taluka_id && formData.village_id;
};

export const validateGST = (gstNo) => {
  if (!gstNo) return true; // Optional field
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNo);
};

export const validateWebsite = (website) => {
  if (!website) return true; // Optional field
  const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return websiteRegex.test(website);
};

export const validateAadhar = (aadhar) => {
  if (!aadhar) return true; // Optional field
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(aadhar);
};

export const validatePAN = (pan) => {
  if (!pan) return true; // Optional field
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validateNumber = (value) => {
  if (!value) return true; // Optional field
  return !isNaN(value) && parseInt(value) >= 0;
};

export const validateForm = (formData, role) => {
  const errors = {};

  // Common validations for all roles
  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (!validateConfirmPassword(formData.password, formData.confirm_password)) {
    errors.confirm_password = 'Passwords do not match';
  }

  if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid 10-digit phone number';
  }

  if (!validateLocation(formData)) {
    errors.location = 'Please select all location fields';
  }

  // Role-specific validations
  switch (role) {
    case 'candidate':
      if (!validateRequired(formData.fname)) {
        errors.fname = 'First name is required';
      }
      if (!validateRequired(formData.lname)) {
        errors.lname = 'Last name is required';
      }
      if (formData.aadhar_no && !validateAadhar(formData.aadhar_no)) {
        errors.aadhar_no = 'Please enter a valid 12-digit Aadhar number';
      }
      if (formData.pancard_no && !validatePAN(formData.pancard_no)) {
        errors.pancard_no = 'Please enter a valid PAN card number';
      }
      if (formData.min_experience && !validateNumber(formData.min_experience)) {
        errors.min_experience = 'Please enter a valid number';
      }
      if (formData.max_experience && !validateNumber(formData.max_experience)) {
        errors.max_experience = 'Please enter a valid number';
      }
      break;

    case 'consultant':
      if (!validateRequired(formData.name)) {
        errors.name = 'Consultant name is required';
      }
      if (formData.gst_no && !validateGST(formData.gst_no)) {
        errors.gst_no = 'Please enter a valid GST number';
      }
      if (formData.website_url && !validateWebsite(formData.website_url)) {
        errors.website_url = 'Please enter a valid website URL';
      }
      break;

    case 'employer':
      if (!validateRequired(formData.name)) {
        errors.name = 'Company name is required';
      }
      if (formData.gst_no && !validateGST(formData.gst_no)) {
        errors.gst_no = 'Please enter a valid GST number';
      }
      if (formData.website_url && !validateWebsite(formData.website_url)) {
        errors.website_url = 'Please enter a valid website URL';
      }
      break;

    case 'institute':
      if (!validateRequired(formData.name)) {
        errors.name = 'Institute name is required';
      }
      if (!validateRequired(formData.head_of_institute)) {
        errors.head_of_institute = 'Head of Institute is required';
      }
      if (!validateRequired(formData.approval_id)) {
        errors.approval_id = 'Approval ID is required';
      }
      if (formData.no_of_students && !validateNumber(formData.no_of_students)) {
        errors.no_of_students = 'Please enter a valid number';
      }
      if (formData.gst_no && !validateGST(formData.gst_no)) {
        errors.gst_no = 'Please enter a valid GST number';
      }
      if (formData.website_url && !validateWebsite(formData.website_url)) {
        errors.website_url = 'Please enter a valid website URL';
      }
      break;

    case 'gram_panchayat':
      if (!validateRequired(formData.name)) {
        errors.name = 'Gram Panchayat name is required';
      }
      if (formData.gst_no && !validateGST(formData.gst_no)) {
        errors.gst_no = 'Please enter a valid GST number';
      }
      if (formData.website_url && !validateWebsite(formData.website_url)) {
        errors.website_url = 'Please enter a valid website URL';
      }
      break;
  }

  return errors;
};