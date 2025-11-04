import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { cross } from '../Theme/globalImages';
import { globalColors } from '../Theme/globalColors';
import LinearGradient from 'react-native-linear-gradient';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobCategories } from '../Redux/Slices/JobCategoryslice';
import { fetchJobType } from '../Redux/Slices/JobTypeslice';
import { useTranslation } from 'react-i18next';
import { filterJobs } from '../Redux/Slices/Jobslice';
import { fetchLocations } from '../Redux/Slices/Locationslice';
import Toast from 'react-native-toast-message';

const JobFilterModal = forwardRef(({ setApplyFilter, visible, onClose }, ref) => {
  const { t } = useTranslation();
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [openJobType, setOpenJobType] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState('');
  const [sliderValue, setSliderValue] = useState([0, 100000]);
  const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width * 0.85);
  const [openlocation, setOpenlocation] = useState(false);
  const [opencategory, setOpencategory] = useState(false);
  const dispatch = useDispatch()
  const [error , setError] = useState('')

  useEffect(() => {
    dispatch(fetchJobCategories())
    dispatch(fetchJobType())
    dispatch(fetchLocations())
  }, [])

  
   const clearFilters = () => {
      setSelectedCategory('');
      setSelectedOptions('');
      setSelectedLocation('');
      setMinExperience('');
      setMaxExperience('');
      setSliderValue([0, 100000]);
    };

    useImperativeHandle(ref, () => ({
      clearFilters,
    }));
  

  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(Dimensions.get('window').width * 0.85);
    };
    Dimensions.addEventListener('change', updateWidth);
  }, []);

  const onValuesChange = values => {
    setSliderValue(values);
  };

  // const handleOptionPress = option => {
  //   setSelectedOptions(opt =>
  //     opt.includes(option)
  //       ? opt.filter(opt => opt !== option)
  //       : [...opt, option]
  //   );
  // };

  const JobTypedata = useSelector(state => state.JobType.JobType).map(item => ({ label: item.job_type_name, value: item.id.toString() }));
  const jobCategories = useSelector(state => state.jobCategory.JobCategory).map(item => ({ label: item.category_name, value: item.id.toString() }));
  const locations = useSelector(state => state.location.locations).map(item => ({ label: item.location, value: item.location }));

  // const locations = [
  //   { label: 'Mumbai', value: 'Mumbai' },
  //   { label: 'Pune', value: 'Pune' },
  //   { label: 'Nagpur', value: 'Nagpur' },
  //   { label: 'Nashik', value: 'Nashik' },
  //   { label: 'Thane', value: 'Thane' },
  //   { label: 'Aurangabad', value: 'Aurangabad' },
  //   { label: 'Solapur', value: 'Solapur' },
  //   { label: 'Amravati', value: 'Amravati' },
  //   { label: 'Kolhapur', value: 'Kolhapur' },
  //   { label: 'Navi Mumbai', value: 'Navi Mumbai' },

  // ];

  const filterdata = {
    "user_id": "1",
    "job_category": parseInt(selectedCategory),
    "job_type": parseInt(selectedOptions),
    "min_experience": parseInt(minExperience),
    "max_experience": parseInt(maxExperience),
    "min_salary": parseInt(sliderValue[0]),
    "max_salary": parseInt(sliderValue[1]),
    "location": selectedLocation
  }


  const FilterHandler = () => {
    if(minExperience > maxExperience){
      setError('max experience should be greater than min')
      return
    }
    dispatch(filterJobs(filterdata))
    setApplyFilter(true)
    onClose()
  }

  useEffect(()=>{1
    if(minExperience > maxExperience){
      setError('max experience should be greater than min')
    }else{
      setError('')
    }
  },[minExperience,maxExperience])

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <LinearGradient
        colors={[
          globalColors.purplemedium1,
          globalColors.purplemedium2,
          globalColors.purplemedium1,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.modalTitle}>
        <View style={{ width: '85%', alignSelf: 'center' }}>
          <Text
            style={{
              fontSize: f(2.4),
              color: globalColors.white,
              fontFamily: 'BaiJamjuree-Medium',
            }}>
            {t("Set Filter")}
          </Text>
        </View>
        <View>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={cross}
              style={{
                tintColor: globalColors.white,
                height: h(2.3),
                width: h(2.3),
              }}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={{ paddingBottom: h(10) }}
        style={{ flex: 1, backgroundColor: globalColors.backgroundshade }}>
        <View style={{ width: '90%', marginHorizontal: '5%', marginTop: h(2) }}>
          <Text
            style={{
              marginStart: w(0.7),
              fontSize: f(2),
              color: globalColors.black,
              fontFamily: 'BaiJamjuree-SemiBold',
            }}>
            {t("Category")}
          </Text>
          {/* <MultipleSelectList
            setSelected={val=>setSelectedCategory(val)}
            data={jobCategories}
            maxHeight={h(40)}
            save="value"
            fontFamily= 'BaiJamjuree-Medium' 
            label="Category"
            badgeStyles	={{backgroundColor:globalColors.commonpink}}
            labelStyles={{display:'none'}}
            inputStyles={{fontSize:f(1.6),color:globalColors.grey}}
            dropdownTextStyles={{fontSize:f(1.6),color:globalColors.darkblack}}
            searchPlaceholder='Search Category'
            placeholder="Filter Category"
          /> */}
          <DropDownPicker
            open={opencategory}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpencategory}
            items={jobCategories}
            value={selectedCategory}
            setValue={setSelectedCategory}
            placeholder={t('Filter Category')}
            textStyle={{
              color: selectedCategory
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }} placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            // multiple={true}
            searchPlaceholder={t('Search Category')}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{ marginTop: h(2), width: '100%' }}
            // mode='BADGE'
            // badgeColors={[globalColors.commonpink]}
            // badgeDotStyle={{display:'none'}}
            modalAnimationType='slide'
            badgeTextStyle={{ paddingStart: w(-1), color: globalColors.white, fontSize: f(1.8), fontFamily: 'BaiJamjuree-Medium' }}
          // min={1}
          // max={3}
          />
          <Text
            style={{
              marginTop: h(2),
              marginStart: w(0.7),
              fontSize: f(2),
              color: globalColors.black,
              fontFamily: 'BaiJamjuree-SemiBold',
            }}>
            {t("job Type")}
          </Text>
          <DropDownPicker
            open={openJobType}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenJobType}
            items={JobTypedata}
            value={selectedOptions}
            setValue={setSelectedOptions}
            placeholder={t('Filter Job Type')}
            textStyle={{
              color: selectedOptions
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }} 
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            // multiple={true}
            searchPlaceholder={t('Search Job Type')}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{ marginTop: h(2), width: '100%' }}
            // mode='BADGE'
            // badgeColors={[globalColors.commonpink]}
            // badgeDotStyle={{display:'none'}}
            modalAnimationType='slide'
            badgeTextStyle={{ paddingStart: w(-1), color: globalColors.white, fontSize: f(1.8), fontFamily: 'BaiJamjuree-Medium' }}
          // min={1}
          // max={3}
          />
        </View>
        <View style={{ marginTop: h(2), width: '90%', marginHorizontal: '5%' }}>
          <Text
            style={{
              marginStart: w(0.7),
              fontSize: f(2),
              color: globalColors.black,
              fontFamily: 'BaiJamjuree-SemiBold',
            }}>
            {t("Location")}
          </Text>
          {/* <MultipleSelectList
            maxHeight={h(40)}
            setSelected={val => setSelectedLocation(val)}
            data={locations}
            searchPlaceholder='Search Location'
            save="value"
            label="Location"
            badgeStyles	={{backgroundColor:globalColors.commonpink}}
            labelStyles={{display:'none'}}
            inputStyles={{fontSize:f(1.6),color:globalColors.grey}}
            dropdownTextStyles={{fontSize:f(1.6),color:globalColors.darkblack}}
            placeholder="Filter Location"
            fontFamily= 'BaiJamjuree-Medium' 
          /> */}
          <DropDownPicker
            open={openlocation}
            listMode="MODAL"
            searchable={true}
            setOpen={setOpenlocation}
            items={locations}
            value={selectedLocation}
            setValue={setSelectedLocation}
            placeholder={t('Filter Location')}
            textStyle={{
              color: selectedLocation
                ? globalColors.darkblack
                : globalColors.mauve,
              fontSize: f(1.8),
              fontFamily: 'BaiJamjuree-Medium',
              paddingStart: w(2.5),
            }}            
            placeholderTextColor={globalColors.mauve}
            style={{ borderWidth: 0, elevation: 3 }}
            searchPlaceholder={t('Search Location')}
            searchPlaceholderTextColor={globalColors.mauve}
            arrowIconStyle={{ tintColor: globalColors.mauve }}
            containerStyle={{ marginTop: h(2), width: '100%' }}
            modalAnimationType='slide'
          />
        </View>
        <View style={{ marginTop: h(4), width: '90%', marginHorizontal: '5%' }}>
          <Text
            style={{
              marginStart: w(0.7),
              fontSize: f(2),
              color: globalColors.black,
              fontFamily: 'BaiJamjuree-SemiBold',
            }}>
            {t("Salary")}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: w(1) }}>
            <Text style={styles.salaryText}>{t("Min")} : {sliderValue[0]}</Text>
            <Text style={styles.salaryText}>{t("Max")} : {sliderValue[1]}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MultiSlider
              values={sliderValue}
              min={0}
              max={100000}
              step={100}
              sliderLength={containerWidth}
              onValuesChange={onValuesChange}
              allowOverlap={false}
              minMarkerOverlapDistance={10}
              selectedStyle={{
                backgroundColor: globalColors.activepink,
              }}
              unselectedStyle={{
                backgroundColor: globalColors.grey,
              }}
              markerStyle={{
                height: h(2),
                width: h(2),
                borderRadius: h(4),
                backgroundColor: globalColors.activepink,
              }}
              pressedMarkerStyle={{
                height: h(2.3),
                width: h(2.3),
                borderRadius: h(4),
                backgroundColor: globalColors.activepink,
              }}
            />
          </View>
        </View>
        <View style={styles.minmaxcontainer}>
          <Text
            style={{
              color: globalColors.darkblack,
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
              keyboardType="numeric"
            />
          </View>
          {error && (
            <Text style={{
              color: globalColors.red,
              marginBottom: h(1),
              fontSize: f(1.6),
              fontFamily: 'BaiJamjuree-Medium',
              marginStart: '5%'}
            }>{error}</Text>
          )}
        </View>

        {/* <View style={{marginTop: h(4), width: '90%', marginHorizontal: '5%'}}>
          <View>
            <Text
              style={{
                marginStart: w(0.7),
                fontSize: f(2),
                color: globalColors.black,
                fontFamily: 'BaiJamjuree-SemiBold',
              }}>
              Job Type
            </Text>
          </View>
          <View style={styles.jobs}>
            {JobTypedata.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  selectedOptions.includes(option) && styles.highlightedOption,
                ]}
                onPress={() => handleOptionPress(option)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedOptions.includes(option) && styles.highlightedOptionText,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}
      </ScrollView>
      <View style={styles.applyBtn}>
        <TouchableOpacity style={styles.applyFilterBtn} onPress={FilterHandler}>
          <Text
            style={{
              fontSize: f(1.9),
              color: globalColors.white,
              fontFamily: 'BaiJamjuree-Bold',
              textAlign: 'center',
            }}>
              {t('Apply Filter')}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
});

export default JobFilterModal;

const styles = StyleSheet.create({
  modalTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: h(2),
  },
  jobs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: h(1),
  },
  option: {
    paddingVertical: h(0.7),
    paddingHorizontal: w(5),
  },
  highlightedOption: {
    backgroundColor: globalColors.activepink,
    color: globalColors.white,
    borderRadius: h(1),
  },
  optionText: {
    fontSize: f(1.5),
    color: globalColors.black,
    fontFamily: 'BaiJamjuree-SemiBold',
  },
  highlightedOptionText: {
    color: globalColors.white,
  },
  applyFilterBtn: {
    backgroundColor: globalColors.activepink,
    borderRadius: h(1),
    flex: 1,
    paddingVertical: h(1.2),
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
  applyBtn: {
    position: 'absolute',
    bottom: '0.5%',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: w(2),
    flex: 1,
  },
  salaryText: {
    fontSize: f(1.5),
    color: globalColors.black,
    fontFamily: 'BaiJamjuree-SemiBold',
  }
});
