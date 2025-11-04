import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '../Theme/globalColors'
import { f, w } from 'walstar-rn-responsive'

const CommonButton = ({title,btnstyles,onpress}) => {

  return (
    <TouchableOpacity style={[styles.maincontainer,btnstyles]} onPress={onpress}>
      <Text   style={{
        fontSize: f(1.7),
        color: globalColors.white,
        fontFamily: 'BaiJamjuree-Regular',
      }}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CommonButton

const styles = StyleSheet.create({

    maincontainer:{
        flex:1,
        backgroundColor:globalColors.commonpink,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:w(1),
        paddingVertical:w(0.6)
    }

})