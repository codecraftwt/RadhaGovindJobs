import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { f, h, w } from 'walstar-rn-responsive';
import { nodata } from '../../Theme/globalImages';
import { globalColors } from '../../Theme/globalColors';


//No data found or api error screen
export default function NoData({text ,refresh}) {


  return (
    <View style={styles.maincontainer}>
      
      <View style={styles.view1}>
        <Image
          resizeMode='contain'
          style={styles.image}
          source={nodata}
        />
        <Text style={styles.maintext}>{text ? text : 'No Data Found'}</Text>
        {refresh ?<Text style={{color:globalColors.navypurple ,fontSize: f(1.7), fontFamily: 'BaiJamjuree-SemiBold',}}>Check Network Connection</Text>: null}
        {refresh ?
        <TouchableOpacity onPress={refresh}>
        <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity> : null
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor:globalColors.backgroundshade,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view1: {
    alignItems: 'center',
  },
  image: {
    width: w(50),
    height: h(20),
  },
  maintext: {
    color: globalColors.black,
    fontSize: f(2.4),
    fontFamily: 'BaiJamjuree-SemiBold',
     marginTop: w(2),
  },
  refresh:{
    color: globalColors.commonpink,
    fontSize: f(1.8),
    fontFamily: 'BaiJamjuree-SemiBold',
    marginVertical: w(1),
  }
});
