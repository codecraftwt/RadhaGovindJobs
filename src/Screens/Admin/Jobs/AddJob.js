import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '../../../Components/AppBar';
import { globalColors } from '../../../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import { fetchJobDetails, postJobData, updateJobData } from '../../../Redux/Slices/Jobslice';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchJobCategories } from '../../../Redux/Slices/JobCategoryslice';
import { fetchJobType } from '../../../Redux/Slices/JobTypeslice';
import { fetchcategoryskills, fetchskills } from '../../../Redux/Slices/Skillslice';
import { fetchEducation } from '../../../Redux/Slices/Educationslice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { fetchEmployersnameList } from '../../../Redux/Slices/Employerslice';
import usePermissionCheck from '../../../Utils/HasPermission';
import SkeltonLoader from '../../../Components/SkeltonLoader';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const AddJob = ({ route }) => {
  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [minPayment, setMinPayment] = useState('');
  const [maxPayment, setMaxPayment] = useState('');
  const [openings, setOpenings] = useState('');
  const [JobType, setJobType] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [enddate, setEndDate] = useState(new Date());
  const [endshow, setEndShow] = useState(false);
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [startdate, setStartDate] = useState(new Date());
  const [startshow, setStartShow] = useState(false);
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [open, setOpen] = useState(false);
  const [Location, setLocation] = useState('');
  const [openskill, setOpenskill] = useState(false);
  const [selectedskill, setSelectedskill] = useState([]);
  const [openqualification, setOpenqualification] = useState(false);
  const [selectedqualification, setSelectedqualification] = useState([]);
  const [opencategory, setOpencategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [errors, setErrors] = useState({});
  const JobTypedata = useSelector(state => state.JobType.JobType).map(item => ({ label: item.job_type_name, value: item.id.toString() }));
  const skills = useSelector(state => state.skills.categorySkills).map(item => ({ label: item.name, value: item.id.toString() }));
  const jobCategories = useSelector(state => state.jobCategory.JobCategory).map(item => ({ label: item.category_name, value: item.id.toString() }));
  const qualification = useSelector(state => state.Education.Education).map(item => ({ label: item.name, value: item.id.toString() }));
  const [user, setUser] = useState(null);
  const [liveValidating, setLiveValidating] = useState(false);
  const [employer, setEmployer] = useState('');
  const [openemployer, setOpenEmployer] = useState(false);
  const employers = useSelector(state => state.employers.employersNameList).map(item => ({ label: item.name, value: item.id.toString() }))
  const { item: passeditem, updatejob } = route.params;
  const item = useSelector(state => state.jobs.JobDetails)
  const hasPermission = usePermissionCheck()
  const dispatch = useDispatch();
  const loading = useSelector(state => state.jobs.modifyloading);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false)
  const richText = useRef();

  useLayoutEffect(() => {
    if (updatejob && item) {
      setLiveValidating(false)
      if (item && item.skills) {
        const skillIds = item.skills.map(skill => skill.id.toString());
        setSelectedskill(skillIds);
      }
      if (item) {
        const QulIds = item.education.map(item => item.id.toString());
        setSelectedqualification(QulIds);
      }
      setErrors({})
      setJobTitle(item.title);
      setMinExperience(item.min_experience);
      setMaxExperience(item.max_experience);
      setMinPayment(item.min_salary);
      setMaxPayment(item.max_salary);
      setJobDescription(item.description);
      setOpenings(item.opening);
      setEmployer(item.employee_id);
      setFormattedEndDate(item.end_date);
      setFormattedStartDate(item.start_date);
      setJobType(item.job_type?.id.toString());
      setSelectedCategory(item.job_category?.id.toString());
      setLocation(item.location)
    } else {
      setErrors({})
      setLiveValidating(false)
      clearform()
    }
  }, [item, updatejob]);
  const insets = useSafeAreaInsets();


  const onChangeenddate = (event, selectedDate) => {
    setEndShow(false);
    const currentDate = selectedDate || enddate;
    setEndDate(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;
    setFormattedEndDate(formattedDateString);
  };

  const showDatepicker = () => {
    setEndShow(true);
  };

  const stripTime = (date) => {
    const strippedDate = new Date(date);
    strippedDate.setHours(0, 0, 0, 0);
    return strippedDate;
  };


  const onChangestartdate = (event, selectedDate) => {
    setStartShow(false);
    if (stripTime(new Date()) > stripTime(selectedDate)) {
      Alert.alert('Invalid Date', 'Start date cannot be earlier than today.');
      return;
    }
    setStartShow(false);
    const currentDate = selectedDate || startdate;
    setStartDate(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;
    setFormattedStartDate(formattedDateString);
  };

  const showstartDatepicker = () => {
    setStartShow(true);
  };

  const validateFields = useCallback(async() => {
    const newErrors = {};

    if (!jobTitle) newErrors.jobTitle = 'Job Title is required';
    if (!openings) newErrors.openings = 'Openings is required';
    if (!Location) newErrors.location = 'location is required';
    if (!selectedqualification.length) newErrors.qualification = 'Qualification is required';
    if (!formattedStartDate) newErrors.startDate = 'Start Date is required';
    if (!formattedEndDate) newErrors.endDate = 'End Date is required';
    const startDate = new Date(formattedStartDate);
    const endDate = new Date(formattedEndDate);
    if (endDate <= startDate) {
      newErrors.endDate = 'End Date should be greater than Start Date';
    } if (!JobType) newErrors.JobType = 'Job Type is required';
    if (!minExperience)
      newErrors.Experience = 'Min - Max Experience is required';
    if (!maxExperience)
      newErrors.Experience = 'Min - Max Experience is required';
    if (parseInt(minExperience) > parseInt(maxExperience)) newErrors.Experience = 'Max Experience should be greater than min Experience';

    if (!minPayment) newErrors.Payment = 'Min - Max Payment is required';
    if (!maxPayment) newErrors.Payment = 'Min - Max Payment is required';
    if (parseInt(minPayment) > parseInt(maxPayment)) newErrors.Payment = 'Max Payment should be greater than min Payment';
    if (!await richText.current?.getContentHtml())
      newErrors.jobDescription = 'Job Description is required';
    if (!selectedCategory) newErrors.category = 'Category is required';
    // if (!selectedskill.length) newErrors.skills = 'Skills are required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [jobTitle, openings, Location, selectedqualification, formattedStartDate, formattedEndDate, JobType, minExperience, maxExperience, minPayment, maxPayment, jobDescription, selectedCategory, selectedskill]);

  useEffect(() => {
    if (liveValidating) {
      validateFields();
    }
  }, [validateFields, liveValidating]);

  const clearform = useCallback(() => {
    setSelectedskill([]);
    setSelectedqualification([]);
    setJobTitle('');
    setMinExperience('');
    setMaxExperience('');
    setMinPayment('');
    setMaxPayment('');
    setJobDescription('');
    setOpenings('');
    setFormattedEndDate('');
    setFormattedStartDate('');
    setJobType('');
    setSelectedCategory('');
    setLocation('');
    setEmployer('');
    if (richText.current) {
      richText.current?.setContentHTML(''); 
    }
    setErrors({})
    setLiveValidating(false)
  }, []);

  const createJob = async() => {
 
    setLiveValidating(true)
     if (!await validateFields()) {
      return;
    }
    const jobData =
    {
      "title": jobTitle,
      "description": await richText.current?.getContentHtml(),
      "opening": openings,
      "min_experience": minExperience,
      "max_experience": maxExperience,
      "min_salary": minPayment,
      "max_salary": maxPayment,
      "start_date": formattedStartDate,
      "end_date": formattedEndDate,
      "job_category_id": selectedCategory,
      "job_type_id": JobType,
      "employee_id": employer ? employer : user?.id,
      "location": Location,
      "created_by": user?.id,
      "skills": selectedskill,
      "qualification": selectedqualification
    }

    if (updatejob) {
      dispatch(updateJobData({ id: item.id, jobData }))
        .then(action => {
          const { payload } = action
          if (payload.id) {
            navigation.navigate('JobListMnt', { jobUpdated: true });
            clearform();
          }
        })
    } else {
      dispatch(postJobData(jobData))
        .then(action => {
          const { payload } = action
          if (payload.id) {
            navigation.navigate('JobListMnt', { jobSaved: true });
            clearform();
          }
        })
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchcategoryskills(selectedCategory))
    }
  }, [selectedCategory])


  useEffect(() => {
    dispatch(fetchJobCategories());
    dispatch(fetchJobType());
    dispatch(fetchEducation());
    fetchuser();
  }, [dispatch]);

  const onRefresh = () => {
    setRefresh(true)
    dispatch(fetchJobCategories());
    dispatch(fetchJobType());
    dispatch(fetchEducation());
    fetchuser();
    if (passeditem?.id) {
      dispatch(fetchJobDetails(passeditem?.id))
    }
    if (updatejob && item) {
      setLiveValidating(false)
      if (item && item.skills) {
        const skillIds = item.skills.map(skill => skill.id.toString());
        setSelectedskill(skillIds);
      }
      if (item) {
        const QulIds = item.education.map(item => item.id.toString());
        setSelectedqualification(QulIds);
      }
      setErrors({})
      setJobTitle(item.title);
      setMinExperience(item.min_experience);
      setMaxExperience(item.max_experience);
      setMinPayment(item.min_salary);
      setMaxPayment(item.max_salary);
      setJobDescription(item.description);
      setOpenings(item.opening);
      setEmployer(item.employee_id);
      setFormattedEndDate(item.end_date);
      setFormattedStartDate(item.start_date);
      setJobType(item.job_type?.id.toString());
      setSelectedCategory(item.job_category?.id.toString());
      setLocation(item.location)
    } else {
      setErrors({})
      setLiveValidating(false)
      clearform()
    }
    setRefresh(false);
  }

  const fetchuser = useCallback(async () => {
    const userJson = await AsyncStorage.getItem('user');
    const userData = userJson != null ? JSON.parse(userJson) : null;
    if (userData?.id == '1') {
      dispatch(fetchEmployersnameList());
    }
    setUser(userData);
  }, []);

  useLayoutEffect(() => {
    if (passeditem?.id) {
      dispatch(fetchJobDetails(passeditem.id));
    }
  }, [dispatch, passeditem]);


  return (
    <View style={{ flex: 1, backgroundColor: globalColors.backgroundshade,paddingBottom:Math.max(insets.bottom, h(2)), }}>
      <AppBar navtitle={updatejob ? t('Update Job') : t('Create Job')} showBack={true} backto={'JobListMnt'} />
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

            {updatejob ? t('Update Job Details') : t('Add Job Details')}
          </Text>
          <Text style={styles.inputHeder}>{t("Job Title")}</Text>
          <TextInput
            placeholder={t("Job Title")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={jobTitle}
            onChangeText={setJobTitle}
          />
          {errors.jobTitle && (
            <Text style={styles.errorText}>{errors.jobTitle}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Openings")}</Text>
          <TextInput
            placeholder={t("Openings")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={openings}
            onChangeText={text => {
              if (/^\d*\.?\d*$/.test(text)) {
                setOpenings(text);
              }
            }}
            keyboardType="numeric"
            maxLength={5}
          />
          {errors.openings && (
            <Text style={styles.errorText}>{errors.openings}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Location")}</Text>
          <TextInput
            placeholder={t("Location")}
            placeholderTextColor={globalColors.mauve}
            style={styles.miniplaceholder}
            value={Location}
            onChangeText={setLocation}
          />
          {errors.location && (
            <Text style={styles.errorText}>{errors.location}</Text>
          )}
          <TouchableOpacity onPress={showstartDatepicker}>
            <Text style={styles.inputHeder}>{t("Start Date : yyyy-mm-dd")}</Text>
            <TextInput
              placeholder={t("Start Date : yyyy-mm-dd")}
              placeholderTextColor={globalColors.mauve}
              style={styles.miniplaceholder}
              value={formattedStartDate}
              editable={false}
            />
            {errors.startDate && (
              <Text style={styles.errorText}>{errors.startDate}</Text>
            )}
          </TouchableOpacity>
          {startshow && (
            <DateTimePicker
              value={startdate}
              mode="date"
              onChange={onChangestartdate}
            />
          )}
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={styles.inputHeder}>{t("End Date : yyyy-mm-dd")}</Text>
            <TextInput
              placeholder={t("End Date : yyyy-mm-dd")}
              placeholderTextColor={globalColors.mauve}
              style={styles.miniplaceholder}
              value={formattedEndDate}
              editable={false}
            />
            {errors.endDate && (
              <Text style={styles.errorText}>{errors.endDate}</Text>
            )}
          </TouchableOpacity>
          {endshow && (
            <DateTimePicker
              value={enddate}
              mode="date"
              onChange={onChangeenddate}
            />
          )}
          <Text style={styles.inputHeder}>{t("Job Type")}</Text>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={JobType}
            items={JobTypedata}
            setValue={setJobType}
            placeholder={t('Job Type')}
            dropDownContainerStyle={{
              borderWidth: 0,
              borderTopWidth: w(0.1),
              elevation: 5,
            }}
            // listItemLabelStyle={{color:globalColors.darkblack}}
            textStyle={{
              color: JobType ? globalColors.darkblack : globalColors.mauve,
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
          {errors.JobType && (
            <Text style={styles.errorText}>{errors.JobType}</Text>
          )}
          {hasPermission('Select Job Employer') && (
            <>
              <Text style={styles.inputHeder}>{t("Select Employer")}</Text>
              <DropDownPicker
                open={openemployer}
                listMode="MODAL"
                searchable={true}
                setOpen={setOpenEmployer}
                items={employers}
                value={employer}
                setValue={setEmployer}
                placeholder={t('Select Employer')}
                textStyle={{
                  color: employer
                    ? globalColors.darkblack
                    : globalColors.mauve,
                  fontSize: f(1.8),
                  fontFamily: 'BaiJamjuree-Medium',
                  paddingStart: w(2.5),
                }}
                placeholderTextColor={globalColors.mauve}
                style={{ borderWidth: 0, elevation: 3 }}
                searchPlaceholder={t("Search Employer")}
                searchPlaceholderTextColor={globalColors.mauve}
                arrowIconStyle={{ tintColor: globalColors.mauve }}
                containerStyle={{
                  zIndex: 1,
                  width: '90%',
                  marginHorizontal: '5%',
                }}
              /></>
          )}
          <Text style={styles.inputHeder}>{t("Job Category")}</Text>
          <DropDownPicker
            open={opencategory}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpencategory}
            items={jobCategories}
            value={selectedCategory}
            setValue={setSelectedCategory}
            placeholder={t('Job Category')}
            textStyle={{
              color: selectedCategory
                ? globalColors.darkblack
                : globalColors.mauve,
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
          />
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
          <Text style={styles.inputHeder}>{t("skill")}</Text>
          <DropDownPicker
            open={openskill}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenskill}
            items={skills}
            value={selectedskill}
            setValue={setSelectedskill}
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
          {errors.skills && (
            <Text style={styles.errorText}>{errors.skills}</Text>
          )}
          <Text style={styles.inputHeder}>{t("qualification")}</Text>
          <DropDownPicker
            open={openqualification}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenqualification}
            items={qualification}
            value={selectedqualification}
            setValue={setSelectedqualification}
            placeholder={t('qualification')}
            textStyle={{
              color: globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            multiple={true}
            searchPlaceholder={t("Search qualification")}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{
              marginTop: h(2),
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
          {errors.qualification && (
            <Text style={styles.errorText}>{errors.qualification}</Text>
          )}
          <View style={styles.minmaxcontainer}>
            <Text
              style={{
                color: globalColors.mauve,
                fontSize: f(1.8),
                paddingTop: h(1),
                fontFamily: 'BaiJamjuree-Medium',
              }}>
              {t('Experience')}
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
                placeholder={t("min years")}
                value={minExperience}
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
                placeholder={t("max years")}
                value={maxExperience}
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
          {errors.Experience && (
            <Text style={styles.errorText}>{errors.Experience}</Text>
          )}
          <View style={[styles.minmaxcontainer, { marginTop: h(2) }]}>
            <Text
              style={{
                color: globalColors.mauve,
                fontSize: f(1.8),
                paddingTop: h(1),
                fontFamily: 'BaiJamjuree-Medium',
              }}>
              {t("Payment")}
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
                placeholder={t("min")}
                value={minPayment}
                onChangeText={text => {
                  const formattedText = text.replace(/^0+(?!$)/, '');
                  if (formattedText === '') {
                    setMinPayment('');
                    return;
                  }
                  if (/^(0|\d*[1-9]\d*)(\.\d*)?$/.test(formattedText)) {
                    setMinPayment(formattedText);
                  }
                }}
                keyboardType="numeric"
                maxLength={7}

              />
              <TextInput
                style={styles.minmaxinput}
                placeholderTextColor={globalColors.mauve}
                placeholder={t("max")}
                value={maxPayment}
                onChangeText={text => {
                  const formattedText = text.replace(/^0+(?!$)/, '');
                  if (formattedText === '') {
                    setMaxPayment('');
                    return;
                  }
                  if (/^(0|\d*[1-9]\d*)(\.\d*)?$/.test(formattedText)) {
                    setMaxPayment(formattedText);
                  }
                }}
                maxLength={7}
                keyboardType="numeric"
              />
            </View>
          </View>
          {errors.Payment && (
            <Text style={styles.errorText}>{errors.Payment}</Text>
          )}
          <Text style={styles.inputHeder}>{t("Job Description")}</Text>
          {/* <TextInput
            placeholder={t("Job Description")}
            placeholderTextColor={globalColors.mauve}
            style={styles.multiplaceholder}
            multiline={true}
            value={jobDescription}
            onChangeText={setJobDescription}
          /> */}
           <View style={{ elevation:10, flex: 1, paddingHorizontal: w(5), paddingVertical:w(2) }}>
           <RichToolbar
            editor={richText}
            actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.insertBulletsList]}
          />
          <RichEditor
            ref={richText}
            style={{flex: 1}}
            placeholder={t("Job Description")}
            editorStyle={{
              backgroundColor: 'white', 
              color: 'black', 
            }}
            initialContentHTML={jobDescription}
          />
          </View>
          {errors.jobDescription && (
            <Text style={styles.errorText}>{errors.jobDescription}</Text>
          )}
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
                backgroundColor: globalColors.lightgrey,
                flex: 1,
                paddingVertical: w(2),
                borderRadius: w(3),
              }}
              onPress={() => navigation.navigate('JobListMnt')}>
              <Text
                style={{
                  color: globalColors.white,
                  alignSelf: 'center',
                  fontFamily: 'BaiJamjuree-Medium',
                }}>
                {t('Cancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: globalColors.commonlightpink,
                flex: 1,
                paddingVertical: w(2),
                borderRadius: w(3),
              }}
              onPress={createJob}>
              {loading ? <ActivityIndicator /> :
                (<Text
                  style={{
                    color: globalColors.white,
                    alignSelf: 'center',
                    fontFamily: 'BaiJamjuree-Medium',
                  }}>
                  {updatejob ? t('Update Job') : t('Create Job')}
                </Text>)}
            </TouchableOpacity>
          </View>
        </>}
      </ScrollView>
    </View>
  );
};

export default AddJob;

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
  errorText: {
    color: globalColors.red,
    marginBottom: h(1),
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    marginStart: '5%'
  },
  inputHeder: {
    color: globalColors.darkblack,
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Medium',
    marginStart: '6%',
    marginTop: h(2),
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
  skillcontainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
  },
  skillsContainer: {
    marginTop: w(1),
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: globalColors.mauve,
    borderBottomWidth: 1,
  },
  removeText: {
    color: globalColors.red,
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-Medium',
  },
});
