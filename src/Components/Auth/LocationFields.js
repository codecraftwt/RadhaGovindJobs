import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import { h, w, f } from 'walstar-rn-responsive';
import {useTranslation} from 'react-i18next';

const LocationFields = ({
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
}) => {

  const {t} = useTranslation();
  
  const renderDropdownModal = (type, visible, data, onSelect, selectedId) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => onToggleDropdown(type, false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => onToggleDropdown(type, false)}
        >
          <View style={styles.centeredModalContainer}>
            <View style={styles.centeredModalContent}>
              <ScrollView
                style={styles.modalScrollView}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {data.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalDropdownItem,
                      selectedId === item.id.toString() && styles.selectedDropdownItem,
                    ]}
                    onPress={() => {
                      onSelect(item.id.toString());
                      onToggleDropdown(type, false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalDropdownItemText,
                        selectedId === item.id.toString() && styles.selectedDropdownItemText,
                      ]}
                    >
                      {type === 'state'
                        ? item.state
                        : type === 'district'
                        ? item.district
                        : type === 'taluka'
                        ? item.taluka
                        : type === 'village'
                        ? item.village
                        : item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const renderLocationField = (type, label, value, data, showList, loading, parentValue) => {
    const fieldMap = {
      state: {
        nextField: 'district_id',
        fetchFunction: onFetchDistricts,
      },
      district: {
        nextField: 'taluka_id',
        fetchFunction: onFetchTalukas,
      },
      taluka: {
        nextField: 'village_id',
        fetchFunction: onFetchVillages,
      },
      village: {
        nextField: 'zipcode',
        fetchFunction: onFetchZipcode,
      },
    };

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label} *</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            parentValue && styles.disabledButton
          ]}
          onPress={() => {
            if (!parentValue) {
              onToggleDropdown(type, !showList);
            }
          }}
          onLayout={(event) => onMeasureDropdown(type, event)}
          disabled={!!parentValue}
        >
          <Text style={
            value ? styles.selectedText : styles.placeholderText
          }>
            {value ? getSelectedName(type, value) : ` ${label}`}
          </Text>
          <View style={styles.dropdownRight}>
            {loading ? (
              <ActivityIndicator size="small" color={globalColors.mauve} />
            ) : (
              <Text style={styles.dropdownArrow}>
                {showList ? '▲' : '▼'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {renderDropdownModal(
          type,
          showList,
          data,
          (selectedValue) => {
            onInputChange(`${type}_id`, selectedValue);
            if (fieldMap[type]?.fetchFunction) {
              fieldMap[type].fetchFunction(selectedValue);
            }
          },
          value
        )}
      </View>
    );
  };

  return (
    <>
      {/* State Selection */}
      {renderLocationField(
        'state',
        t("Select State"),
        formData.state_id,
        states,
        showStateList,
        loadingStates.states,
        null
      )}

      {/* District Selection */}
      {renderLocationField(
        'district',
        t("Select district"),
        formData.district_id,
        districts,
        showDistrictList,
        loadingStates.districts,
        !formData.state_id
      )}

      {/* Taluka Selection */}
      {renderLocationField(
        'taluka',
        t("Search Taluka"),
        formData.taluka_id,
        talukas,
        showTalukaList,
        loadingStates.talukas,
        !formData.district_id
      )}

      {/* Village Selection */}
      {renderLocationField(
        'village',
       t("Select village"),
        formData.village_id,
        villages,
        showVillageList,
        loadingStates.villages,
        !formData.taluka_id
      )}

      {/* Zipcode - Auto-filled */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("Zipcode")} *</Text>
        <View style={styles.zipcodeContainer}>
          <TextInput
            style={[styles.input, styles.zipcodeInput]}
            placeholderTextColor={globalColors.mauve}
            placeholder={t("Zipcode")}
            keyboardType="numeric"
            value={formData.zipcode}
            onChangeText={(text) => onInputChange('zipcode', text)}
            editable={true}
          />
          {loadingStates.zipcode && (
            <ActivityIndicator 
              size="small" 
              color={globalColors.mauve} 
              style={styles.zipcodeLoader} 
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: h(1.5),
    position: 'relative'
  },
  label: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.7),
    color: globalColors.black,
    marginBottom: h(0.5),
    marginLeft: w(1),
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
  dropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: globalColors.lightpink,
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
  },
  input: {
    backgroundColor: globalColors.lavender,
    padding: h(1.5),
    borderRadius: h(0.8),
    marginBottom: h(1.5),
    borderWidth: 2,
    borderColor: globalColors.lightpink,
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.9),
    color: globalColors.black,
  },
  zipcodeContainer: {
    position: 'relative',
  },
  zipcodeInput: {
    paddingRight: w(10),
  },
  zipcodeLoader: {
    position: 'absolute',
    right: w(3),
    top: h(1.8),
  },
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

export default LocationFields;