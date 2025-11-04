import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native';
import {
  f,
  h,
  w
} from 'walstar-rn-responsive';
import { useTranslation } from 'react-i18next';
import { globalColors } from '../Theme/globalColors';
import { lens } from '../Theme/globalImages';

export default SearchBarNoFilter = ({placeholder, handleSearch}) => {
  
    const { t } = useTranslation();
  const handleChangeText = (text) => {
    handleSearch(text);
  };

  
  return (
    <View style={{flexDirection:'row',alignItems:'center'}}>
    <View style={styles.searchbarcontainer}>
      <TextInput
        style={{flex:1,paddingVertical:h(1),fontSize:f(1.8),fontFamily: 'BaiJamjuree-Medium',color:globalColors.black}}
        placeholder={placeholder}
        placeholderTextColor={globalColors.Wisteria}
        onChangeText={handleChangeText}
      />
      <TouchableOpacity
          style={{
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
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  searchbarcontainer: {
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingHorizontal:w(4),
    height:w(11),
    alignItems: 'center',
    width: '90%',
    backgroundColor: globalColors.white,
    marginStart: '5%',
    marginTop: h(3),
    marginBottom:h(1.5),
    borderColor: globalColors.lightgrey,
    borderWidth: 1,
    borderRadius: h(1.5),
  },

});
