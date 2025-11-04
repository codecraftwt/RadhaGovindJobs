import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  f,
  h,
  w
} from 'walstar-rn-responsive';
import { useTranslation } from 'react-i18next';
import { globalColors } from '../Theme/globalColors';
import { lens } from '../Theme/globalImages';

export default SearchBarAdd = ({showadd ,addbtnPress,placeholder, handleSearch}) => {
  const { t } = useTranslation();
  const handleChangeText = (text) => {
    handleSearch(text);
  };

  
  return (
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <View style={[styles.searchbarcontainer,{ width: showadd ? '80%' : '90%'}]}>
    <TouchableOpacity
          style={{
            width: '12%',
            paddingStart: '3%',
          }}>
          <View>
            <Image
              resizeMode="contain"
              style={{ width: w(5), height: w(5) }}
              source={lens}
            />
          </View>
        </TouchableOpacity>
      <TextInput
        style={{width: '75%',paddingVertical:h(1),fontSize:f(1.8),fontFamily: 'BaiJamjuree-Medium',color:globalColors.black}}
        placeholder={placeholder}
        placeholderTextColor={globalColors.Wisteria}
        onChangeText={handleChangeText}
      />
    </View>
    {showadd && (
    <TouchableOpacity onPress={addbtnPress ? addbtnPress : {} }  style={styles.filtercontainer}>
    <View >
      <MaterialCommunityIcons
        name="plus-circle"
        color={globalColors.grey}
        size={f(4)}
      />
    </View>
  </TouchableOpacity>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  searchbarcontainer: {
    flexDirection: 'row',
    height:w(11),
    alignItems: 'center',
    backgroundColor: globalColors.white,
    marginStart: '5%',
    marginVertical: h(3),
    borderColor: globalColors.lightgrey,
    borderWidth: 1,
    borderRadius: h(1.5),
  },
  filtercontainer: {
    height: h(6),
    width: '13%',
    backgroundColor: globalColors.backgroundshade,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
