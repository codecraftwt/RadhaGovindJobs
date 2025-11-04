import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  f,
  h,
  w,
} from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { useNavigation } from '@react-navigation/native';

export default SearchBarHome = ({placeholder}) => {

  const navigation= useNavigation()
  
  return (
    <View style={styles.searchbarcontainer}>
      <View style={{width: '87%',justifyContent:'center',paddingLeft:w(5)}}>
        <Text style={{color:globalColors.Wisteria,fontFamily:'BaiJamjuree-Medium',fontSize:f(1.8)}}>{placeholder}</Text>
      </View>
      <View  style={styles.filtercontainer}>
          <MaterialCommunityIcons
            name="magnify"
            color={globalColors.white}
            size={f(3.6)}
          />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchbarcontainer: {
    flexDirection: 'row',
    height: h(6),
    alignItems: 'center',
    width: '90%',
    backgroundColor: globalColors.white,
    marginHorizontal: '5%',
    marginVertical: h(3),
    borderColor: globalColors.lightgrey,
    borderWidth: 1,
    borderRadius: h(0.7),
  },
  filtercontainer: {
    borderTopRightRadius: h(0.7),
    borderBottomRightRadius: h(0.7),
    height: h(6),
    width: '13%',
    backgroundColor: globalColors.purplegradient1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
