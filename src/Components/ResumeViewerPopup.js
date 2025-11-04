import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { f, h, w } from 'walstar-rn-responsive';
import DocumentUpload from './DocumentUpload';
import { globalColors } from '../Theme/globalColors';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const ResumePreviewPopup = ({ 
  visible, 
  onClose, 
  resumeUrl ,
  getResumeUrl
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [url,setUrl]=useState()
  const [open,setOpen]=useState(false)
  const [local,setLocal]=useState()
  const [info,setInfo]=useState()

  console.log("printing information",resumeUrl,visible,onClose)

  useEffect(() => {
    if (resumeUrl && resumeUrl.toLowerCase().endsWith('.pdf')) {
      setIsPdf(true);
    } else {
      setIsPdf(false);
    }
    setLoading(true);
    setError(null);
  }, [resumeUrl]);

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    setLoading(false);
    setError('Failed to load resume');
    console.log('WebView error:', nativeEvent);
  };
    const onComplete =async  file => {
      if (!file) {
          console.log('✅ removed successfully ', file,);
          return
      };
      console.log('✅ after blob', file);
    };

    function passDataToAdd(urls,infos) {
        console.log("printng all info",infos)
        setInfo(infos)
        setUrl(urls)
        setOpen(true)
    }

    function UploadSuccessfully() {
        getResumeUrl(url,info)
        onClose()
    }

    const handleBase64Pdf = async (base64Data) => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Data?.replace(/^data:.*?;base64,/, '');

    
console.log("printing test variable",cleanBase64)
    
    // Create file name
    const fileName = `resume_${Date.now()}.pdf`;
    let filePath;
    
    if (Platform.OS === 'android') {
      filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    } else {
      filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }
    
    // Write the file
    await RNFS.writeFile(filePath, cleanBase64, 'base64');
    
    // Generate local URL
    const localUrl = Platform.OS === 'android' ? `file://${filePath}` : filePath;
    console.log("printing localurl",localUrl,"name",fileName,"path",filePath)
    setLocal(localUrl)
    return localUrl
    
  } catch (error) {
    console.log('Error handling base64 PDF:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

useEffect(()=>{
const test =handleBase64Pdf(url)
console.log("printing test variable",test)
},[url])


  const renderPdfViewer = () => {
    const pdfUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resumeUrl)}`;
    
    return (
      <WebView
        source={{ uri: pdfUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
      />
    );
  };

  const renderWebView = () => {
    return (
      <WebView
        source={{ uri: resumeUrl }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading document...</Text>
          </View>
        )}
      />
    );
  };

  if (!resumeUrl) {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Resume Preview</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>
              <MaterialIcons name="description" size={48} color="#999" />
              <Text style={styles.errorText}>No resume available</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {isPdf ? 'PDF Preview' : 'Resume Preview'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>
                {isPdf ? 'Loading PDF...' : 'Loading document...'}
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  setLoading(true);
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* WebView Content */}
          <View style={styles.webviewContainer}>
            {isPdf ? renderPdfViewer() : renderWebView()}
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Text style={styles.footerText} numberOfLines={1}>
              {resumeUrl.split('/').pop()}
            </Text>
            <Text style={styles.footerText}>
              {isPdf ? 'PDF Document' : 'Document'}
            </Text>
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
                <DocumentUpload type="Update Resume" onUploadComplete={passDataToAdd} />
            {open && (<TouchableOpacity style={styles.pickBtn} onPress={UploadSuccessfully}>
                <Text style={styles.pickBtnTxt}>Conform</Text>
            </TouchableOpacity>)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: w(5),
  },
  modalContainer: {
    width: '90%', 
    height: '90%', 
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: w(4),
    paddingVertical: h(2),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: w(4),
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: w(2),
  },
  closeButton: {
    padding: w(1),
  },
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: h(1),
    fontSize: w(3.5),
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: w(5),
  },
  errorText: {
    fontSize: w(4),
    color: '#666',
    textAlign: 'center',
    marginTop: h(2),
    marginBottom: h(3),
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: w(6),
    paddingVertical: h(1.5),
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: w(3.5),
    fontWeight: '600',
  },
  footer: {
    padding: w(3),
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: w(3),
    color: '#666',
    textAlign: 'center',
  },
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
});

export default ResumePreviewPopup;