'use strict';
import { StyleSheet } from 'react-native';
import {
  h,
  f,
  w
} from "walstar-rn-responsive";


module.exports = StyleSheet.create({
  // bottomnav styles
  bottomnavlabel:{
    marginTop: h(-1),
    paddingBottom: h(0.5), 
    fontSize: f(1.2), 
    fontFamily: 'BaiJamjuree-Regular' 
  },
  bottomlogo:{
      height:w(5.5)
  }
  
});
