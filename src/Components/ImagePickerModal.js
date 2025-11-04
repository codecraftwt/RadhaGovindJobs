import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { bin, camera, gallery } from '../Theme/globalImages';

const ImagePickerModal = ({visible, onClose, setProfile,noimg}) => {
  const cameraimg = () => {
    ImagePicker.openCamera({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
      mime:'image/jpeg'
    }).then(image => {
      setProfile(image);
      onClose();
    });
  };

  const imageupdate = () => {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
      mime: 'image/jpeg'
    }).then(image => {
      setProfile(image);
      onClose();
    });
  };

  const deleteprofile =()=>{
    noimg ? setProfile(null)
    : setProfile({path:'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'});
      onClose();
  }

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modalContent}>
            <TouchableOpacity style={[styles.drawerItem,{marginTop:w(1)}]} onPress={cameraimg}>
              <Text style={styles.drawertxt}>Take Photo</Text>
              <Image
                resizeMode="contain"
                style={[styles.logo,{ height:w(4.1), width:w(4.1),}]}
                source={camera}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={imageupdate}>
              
              <Text style={styles.drawertxt}>Choose Photo</Text>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={gallery}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={deleteprofile}>
              
              <Text style={[styles.drawertxt,{color:globalColors.red}]}>Delete Photo</Text>
              <Image
                resizeMode="contain"
                style={[styles.logo,{tintColor:globalColors.red}]}
                source={bin}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ImagePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerItem: {
    justifyContent:'space-between',
    width:'95%',
    paddingVertical: h(1.7),
    marginTop: h(1.7),
    marginHorizontal: w(5),
    backgroundColor:globalColors.white,
    elevation:2,
    flexDirection: 'row',
    alignItems: 'center',
    gap:w(1.5),
    paddingStart:w(5),
    borderRadius:w(2.5)
  },
  logo:{
    height:w(5),
    width:w(5),
    paddingEnd:w(15),
    tintColor:globalColors.black
  },
  drawertxt: {
    fontFamily: 'BaiJamjuree-Medium',
    fontSize: f(1.61),
    color: globalColors.darkblack,
    paddingStart: w(1),
  },
  modalContent: {
    backgroundColor: 'white',
    padding: w(5),
    borderTopLeftRadius: w(5),
    borderTopRightRadius: w(5),
    alignItems: 'center',
  },
});
