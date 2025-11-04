import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { f, h, w } from 'walstar-rn-responsive';
import { globalColors } from '../Theme/globalColors';
import { bin, camera, gallery } from '../Theme/globalImages';

const ImagePickerModal = ({visible, onClose, setProfile,noimg, setDefaultImage }) => {
  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true, 
      compressImageQuality: 0.8,
      mediaType: 'photo',
      forceJpg: true,
    });

      const formattedImage = {
        path: image.path,
        data: image.data,
        width: image.width,
        height: image.height,
        mime: image.mime,
        size: image.size,
        filename: image.filename || `camera_${Date.now()}.jpg`,
        cropRect: image.cropRect || {
          width: image.width,
          height: image.height,
          x: 0,
          y: 0
        },
        modificationDate: image.modificationDate || Date.now().toString()
      };
      
      setProfile(formattedImage);
      onClose();
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('Camera Error: ', error);
      }
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
      includeBase64: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
      mediaType: 'photo',
      forceJpg: true,
    });

      const formattedImage = {
        path: image.path,
        data: image.data,
        width: image.width,
        height: image.height,
        mime: image.mime,
        size: image.size,
        filename: image.filename || `gallery_${Date.now()}.jpg`,
        cropRect: image.cropRect || {
          width: image.width,
          height: image.height,
          x: 0,
          y: 0
        },
        modificationDate: image.modificationDate || Date.now().toString()
      };
      
      setProfile(formattedImage);
      onClose();
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('Image Picker Error: ', error);
      }
    }
  };

  const deleteProfile = () => {
    if (setDefaultImage) {
      const defaultImage = {
        "cropRect": {
          "width": 564,
          "y": 0,
          "height": 564,
          "x": 0
        },
        "modificationDate": "1759292281629",
        "size": 5722,
        "mime": "image/jpeg",
        "height": 150,
        "data": "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",
        "width": 150,
        "filename": "df4d8c37-1313-4be1-a469-70dabaa49784.jpg",
        "path": "file:///storage/emulated/0/Android/data/com.gramjobmobile/files/Pictures/df4d8c37-1313-4be1-a469-70dabaa49784.jpg"
      };
      setProfile(defaultImage);
      console.log("printing default image", defaultImage);
      return;
    }
    
    noimg ? setProfile(null) 
      : setProfile({path: 'https://i.pinimg.com/564x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'});
    onClose();
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose} animationType="slide" >
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()} style={styles.modalContent}>
            <TouchableOpacity style={[styles.drawerItem,{marginTop:w(1)}]} onPress={openCamera}>
              <Text style={styles.drawertxt}>Take Photo</Text>
              <Image
                resizeMode="contain"
                style={[styles.logo,{ height:w(4.1), width:w(4.1),}]}
                source={camera}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.drawerItem} onPress={openGallery}>
              <Text style={styles.drawertxt}>Choose Photo</Text>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={gallery}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={deleteProfile}>
              
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
