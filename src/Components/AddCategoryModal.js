import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { globalColors } from '../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';
import CommonButton from './CommonButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const AddCategoryModal = ({
  skills,
  placeholder,
  value,
  visible,
  onClose,
  onAdd,
  modal_title,
  btntitle,
}) => {
  const [field1, setField1] = useState(value);
  const [opencategory, setOpencategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [Items, setItems] = useState([]);

  const Categories = useSelector(state => state.jobCategory.JobCategory);
  const { t } = useTranslation();

  useEffect(() => {
    setItems(
      Categories && Categories.map((category) => ({
        label: category.category_name,
        value: category.id,
        key: category.id,
      }))
    );
  }, [Categories]);

  useEffect(() => {
    setField1(value);
  }, [value]);

  const handleAdd = () => {
    onAdd({ field1, cat_id: selectedCategory });
    setField1('');
    setSelectedCategory('');
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t(modal_title)}</Text>
          {skills && (
            <DropDownPicker
              open={opencategory}
              setOpen={setOpencategory}
              items={Items}
              value={selectedCategory}
              setValue={setSelectedCategory}
              placeholder={t("Job Category")}
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
              arrowIconStyle={{ tintColor: globalColors.mauve }}
              containerStyle={{
                marginTop: h(2),
                zIndex: 1,
                // borderWidth:w(0.2),
                // borderColor:globalColors.darkblack,
                marginBottom: w(3)
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder={t(placeholder)}
            placeholderTextColor={globalColors.mauve}
            value={field1}
            onChangeText={setField1}
          />
          <View style={styles.buttonContainer}>
            <CommonButton btnstyles={{
              backgroundColor: globalColors.suvagrey,
            }} title={t("Cancel")} onpress={onClose} />
            <CommonButton title={t(btntitle)} onpress={handleAdd} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: w(80),
    padding: w(5),
    backgroundColor: globalColors.white,
    borderRadius: w(3),
  },
  modalTitle: {
    fontSize: f(2.5),
    fontFamily: 'BaiJamjuree-SemiBold',
    marginBottom: w(2),
    color: globalColors.darkblack,
  },
  input: {
    borderColor: 'gray',
    borderWidth: w(0.2),
    marginBottom: w(5),
    paddingStart: w(5),
    borderWidth: 0,
    elevation: 0.5,
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.8),
    color: globalColors.darkblack
  },

  buttonContainer: {
    height: w(8),
    gap: w(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddCategoryModal;
