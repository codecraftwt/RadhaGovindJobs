// DocumentUpload.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  // Alert,
  Platform,
  PermissionsAndroid,
  useColorScheme,
  Image
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import { f, h, w } from 'walstar-rn-responsive';
import { upload } from '../Theme/globalImages';
import { globalColors } from '../Theme/globalColors';
import RNFetchBlob from 'react-native-blob-util';

export default function DocumentUpload({ type, onUploadComplete, onRemove }) {
  const [file, setFile] = useState(null);
  const isDark = useColorScheme() === 'dark';

  /* ------------ permission ------------ */
  const requestPerm = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      const ok = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        { title: 'Storage permission', message: 'Required to pick a file.', buttonPositive: 'OK' }
      );
      return ok === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  /* ------------ pick ------------ */
  const pickDocument = async () => {
    // const ok = await requestPerm();
    // if (!ok) return Alert.alert('Permission denied');

    try {
      const res = await pick({
        type: ['application/pdf'],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      if (!res || res.length === 0) return;
      const picked = res[0];

      // ➜ fall back to original uri if copy missing
      const usableUri = picked.fileCopyUri || picked.uri;

      setFile({
        name: picked.name ?? 'unknown.pdf',
        size: picked.size ?? 0,
        uri: usableUri,
        type: picked.type ?? 'application/pdf',
      });
    } catch (e) {
      // Alert.alert('Error', 'Failed to select document');
    }
  };

  /* ------------ upload ------------ */
  const uploadFunction = async () => {
    if (!file) return;
    const base64 = await RNFetchBlob.fs.readFile(file.uri, 'base64');
    onUploadComplete?.(base64,file);
  };

  useEffect(() => {
    uploadFunction();
  }, [file]);

  const remove = () => {
    setFile(null);
    onRemove?.();
  };

  /* ------------ UI ------------ */
  return (
    <View style={[file ? styles.container : styles.noFileContainer]}>
      {!file ? (
        <TouchableOpacity style={styles.pickBtn} onPress={pickDocument}>
          <Text style={styles.pickBtnTxt}>{type}</Text>
          <Image style={styles.pickBtnIcon} source={upload} />
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={[styles.name, isDark && { color: '#fff' }]} numberOfLines={1}>{file.name}</Text>
          <Text style={[styles.size, isDark && { color: '#aaa' }]}>{(file.size / 1024 / 1024).toFixed(2)} MB</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={remove} style={[styles.btn, styles.btnSecondary]}>
              <Text style={styles.btnTxtSec}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical:w(2),
  },
  noFileContainer: {
    marginVertical: w(2),
  },
  // containerDark: { backgroundColor: '#1c1c1e' },
  pickBtn: {
    marginTop: h(1),
    flexDirection: 'row',
    backgroundColor: globalColors.commonlightpink,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: w(1.5),
    marginHorizontal: w(5),
    paddingHorizontal: w(3),
    borderRadius: w(2),
  },
  pickBtnTxt: {
    fontSize: f(1.7),
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.white,
  },
  pickBtnIcon: {
    width: w(4),
    height: w(4),
  },
  card: { padding: 12 },
  name: { fontSize: 15, fontWeight: '500' },
  size: { fontSize: 13, color: '#666', marginTop: 2 },
  btnRow: { flexDirection: 'row', marginTop: 10 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnSecondary: { backgroundColor: '#eee' },
  btnTxtSec: { color: '#333', fontWeight: '600' },
});