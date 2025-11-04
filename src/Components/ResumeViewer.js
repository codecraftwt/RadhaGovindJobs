import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { h, w } from 'walstar-rn-responsive'
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';



const { width, height } = Dimensions.get('window');

const ResumeViewer = ({ route, navigation }) => {
  const { resumeUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPdf, setIsPdf] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check if the file is a PDF
    if (resumeUrl && resumeUrl.toLowerCase().endsWith('.pdf')) {
      setIsPdf(true);
    }
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

  const renderPdfViewer = () => {
    // For PDF files, use Google Docs viewer or direct PDF rendering
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
    // For other file types (images, docs, etc.)
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

//  const handleDownload = async () => {
//   try {
//     // Check if component is mounted and app is active
//     if (!navigation.isFocused()) {
//       return;
//     }

//         Toast.show({
//               text1:"Failed to download resume",
//               position: 'bottom',
//               type: 'error'
//              });
//   } catch (error) {
//     console.error('Download error:', error);
//     if (navigation.isFocused()) {
//                 Toast.show({
//               text1:"Failed to download resume",
//               position: 'bottom',
//               type: 'error'
//             });
//     }
//   }
// };

//  const handleDownload = async () => {
    
//     if (isDownloading) {
//       Alert.alert('Info', 'Download already in progress');
//       return;
//     }

//     try {
//       // Check if component is mounted and app is active
//       if (!navigation.isFocused()) {
//         return;
//       }

//       if (!resumeUrl) {
//         Alert.alert('Error', 'No resume available for download');
//         return;
//       }

//       // Request storage permission for Android
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'Storage Permission Required',
//               message: 'App needs access to your storage to download resumes',
//               buttonPositive: 'OK',
//             }
//           );

//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             Alert.alert('Permission Denied', 'Storage permission is required to download files');
//             return;
//           }
//         } catch (permissionError) {
//           console.error('Permission error:', permissionError);
//           Alert.alert('Error', 'Failed to request storage permission');
//           return;
//         }
//       }

//       setIsDownloading(true);

//       // Show downloading alert
//       Alert.alert('Downloading', 'Your resume is being downloaded...');

//       // Get file extension from URL
//       const fileExtension = resumeUrl.split('.').pop() || 'pdf';
//       const fileName = `resume_${Date.now()}.${fileExtension}`;

//       // Define download path
//       let downloadPath;
      
//       if (Platform.OS === 'android') {
//         downloadPath = RNFetchBlob.fs.dirs.DownloadDir + '/' + fileName;
//       } else {
//         // For iOS, use DocumentDirectory
//         downloadPath = RNFetchBlob.fs.dirs.DocumentDir + '/' + fileName;
//       }


//       // Download the file
//       const result = await RNFetchBlob.config({
//         fileCache: true,
//         path: downloadPath,
//         addAndroidDownloads: {
//           useDownloadManager: true,
//           notification: true,
//           path: downloadPath,
//           description: 'Resume Download',
//           mime: 'application/pdf'
//         }
//       }).fetch('GET', resumeUrl);

//       // Check if download was successful
//       if (result.info().status === 200) {
        
//         // For Android, scan the file to make it visible in gallery/downloads
//         if (Platform.OS === 'android') {
//           RNFetchBlob.fs.scanFile([{ path: result.path(), mime: 'application/pdf' }]);
//         }

//         Alert.alert(
//           'Success', 
//           `Resume downloaded successfully!\n\nSaved to: ${Platform.OS === 'android' ? 'Downloads folder' : 'Documents folder'}`,
//           [
//             { 
//               text: 'Open File', 
//               onPress: () => {
//                 // Open the file
//                 if (Platform.OS === 'android') {
//                   RNFetchBlob.android.actionViewIntent(result.path(), 'application/pdf');
//                 } else {
//                   // For iOS, you might need to use a different method
//                 }
//               }
//             },
//             { text: 'OK', style: 'cancel' }
//           ]
//         );

//       } else {
//         throw new Error(`Download failed with status: ${result.info().status}`);
//       }

//     } catch (error) {
//       console.error('Download error:', error);
      
//       let errorMessage = "Failed to download resume";
      
//       if (error.message.includes('Network request failed')) {
//         errorMessage = "Network error. Please check your internet connection";
//       } else if (error.message.includes('permission')) {
//         errorMessage = "Storage permission denied";
//       } else if (error.message.includes('404')) {
//         errorMessage = "Resume file not found on server";
//       }

//       Alert.alert('Download Failed', errorMessage);
//     } finally {
//       setIsDownloading(false);
//     }
//     };

const handleDownload = async () => {
  if (isDownloading) {
    Alert.alert('Info', 'Download already in progress');
    return;
  }

  try {
    // Check if component is mounted and app is active
    if (!navigation.isFocused()) {
      return;
    }

    if (!resumeUrl) {
      Alert.alert('Error', 'No resume available for download');
      return;
    }

    // Request storage permission for Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download resumes',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
            buttonNeutral: 'Ask Me Later',
          }
        );

        // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        //   console.log("printing granted",granted,"and result",PermissionsAndroid.RESULTS.GRANTED);
        //   Alert.alert('Permission Denied', 'Storage permission is required to download files');
        //   return;
        // }
      } catch (permissionError) {
        console.log('Permission error:', permissionError);
        Alert.alert('Error', 'Failed to request storage permission');
        return;
      }
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    // Extract filename from URL or create a default one
    const extractFilename = (url) => {
      try {
        const urlParts = url.split('/');
        const filename = urlParts[urlParts.length - 1];
        console.log("printing filename param",urlParts, " and filename",filename);

        
        // Check if filename has extension
        if (filename && filename.includes('.')) {
          return filename;
        }
        
        // Check URL parameters for filename
        const urlObj = new URL(url);
        const filenameParam = urlObj.searchParams.get('filename');
        if (filenameParam) {
          return filenameParam;
        }
        
        // Default filename based on file type
        const fileExtension = isPdf ? 'pdf' : 'jpg';
        return `resume_${Date.now()}.${fileExtension}`;
      } catch (error) {
        return `resume_${Date.now()}.pdf`;
      }
    };

    const fileName = extractFilename("https://gramjob.walstarmedia.com/resume/JohnMichaelDoe2025-09-24_.1_.pdf");
    
    // Define download path
    let downloadPath;
    if (Platform.OS === 'android') {
      // Use DownloadDir for Android to make file visible in Downloads folder
      downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    } else {
      // Use DocumentDir for iOS
      downloadPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    }

    // Check if file already exists and create unique name if needed
    let finalPath = downloadPath;
    let counter = 1;
    while (await RNFS.exists(finalPath)) {
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
      const extension = fileName.substring(fileName.lastIndexOf('.'));
      const newFileName = `${nameWithoutExt}_${counter}${extension}`;
      
      if (Platform.OS === 'android') {
        finalPath = `${RNFS.DownloadDirectoryPath}/${newFileName}`;
      } else {
        finalPath = `${RNFS.DocumentDirectoryPath}/${newFileName}`;
      }
      counter++;
    }

    // Show downloading toast
    Toast.show({
      text1: 'Download Started',
      text2: 'Your resume is being downloaded...',
      position: 'bottom',
      type: 'info'
    });

    // Configure download options
    const downloadOptions = {
      fromUrl: resumeUrl,
      toFile: finalPath,
      background: true, // Enable background download (iOS)
      discretionary: true, // Allow OS to control timing (iOS)
      progress: (res) => {
        // Calculate download progress
        const progressPercent = (res.bytesWritten / res.contentLength) * 100;
        const roundedProgress = Math.round(progressPercent);
        
        setDownloadProgress(roundedProgress);
        
        console.log(`Download Progress: ${roundedProgress}%`);
        console.log(`Downloaded: ${(res.bytesWritten / 1024 / 1024).toFixed(2)} MB of ${(res.contentLength / 1024 / 1024).toFixed(2)} MB`);
      },
      begin: (res) => {
        console.log('Download started');
        console.log('Content-Length:', res.contentLength);
        console.log('Response headers:', res.headers);
        
        // Check if we have enough storage space (optional)
        const fileSizeMB = res.contentLength / 1024 / 1024;
        console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
      }
    };

    // Start download using RNFS
    const downloadResult = await RNFS.downloadFile(downloadOptions).promise;

    console.log("printing filename param",downloadResult," and fileoptions",downloadOptions);

    // Check download status
    if (downloadResult.statusCode === 200) {
      console.log('File downloaded successfully:', finalPath);
      
      // Verify file exists and get file stats
      const fileExists = await RNFS.exists(finalPath);
      if (fileExists) {
        const fileStat = await RNFS.stat(finalPath);
        console.log('Downloaded file size:', fileStat.size);
        
        // Show success message with options
        Alert.alert(
          'Download Complete', 
          `Resume downloaded successfully!\n\nFile: ${fileName}\nSize: ${(fileStat.size / 1024 / 1024).toFixed(2)} MB\nLocation: ${Platform.OS === 'android' ? 'Downloads folder' : 'Documents folder'}`,
          [
            { 
              text: 'Open File', 
              onPress: async () => {
                try {
                  if (Platform.OS === 'android') {
                    // For Android, try to open with system default app
                    const mimeType = isPdf ? 'application/pdf' : 'image/jpeg';
                    await RNFS.scanFile(finalPath); // Make file visible in gallery/downloads
                    // Note: RNFS doesn't have actionViewIntent, you might need react-native-file-viewer
                    // or react-native-share for opening files
                    Toast.show({
                      text1: 'File Ready',
                      text2: 'Check your Downloads folder',
                      position: 'bottom',
                      type: 'success'
                    });
                  } else {
                    // For iOS, you might need a different approach
                    // You can use react-native-share or react-native-file-viewer
                    Toast.show({
                      text1: 'File Ready',
                      text2: 'Check your Files app',
                      position: 'bottom',
                      type: 'success'
                    });
                  }
                } catch (openError) {
                  console.log('Error opening file:', openError);
                  Toast.show({
                    text1: 'File downloaded',
                    text2: 'Cannot open file automatically',
                    position: 'bottom',
                    type: 'info'
                  });
                }
              }
            },
            { 
              text: 'Share', 
              onPress: () => {
                // Copy file path to clipboard for sharing
                Clipboard.setString(finalPath);
                Toast.show({
                  text1: 'File path copied',
                  text2: 'You can share this path',
                  position: 'bottom',
                  type: 'success'
                });
              }
            },
            { text: 'OK', style: 'cancel' }
          ]
        );

        // Show success toast
        Toast.show({
          text1: 'Download Complete',
          text2: `${fileName} saved successfully`,
          position: 'bottom',
          type: 'success'
        });

      } else {
        throw new Error('Downloaded file not found');
      }
      
    } else {
      throw new Error(`Download failed with status: ${downloadResult.statusCode}`);
    }

  } catch (error) {
    console.log('Download error:', error);
    
    // Determine specific error message
    let errorMessage = "Failed to download resume";
    
    if (error.message.includes('Network request failed') || error.message.includes('network')) {
      errorMessage = "Network error. Please check your internet connection";
    } else if (error.message.includes('permission') || error.message.includes('Permission')) {
      errorMessage = "Storage permission denied";
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      errorMessage = "Resume file not found on server";
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      errorMessage = "Access denied to download this file";
    } else if (error.message.includes('timeout')) {
      errorMessage = "Download timeout. Please try again";
    } else if (error.message.includes('space') || error.message.includes('storage')) {
      errorMessage = "Insufficient storage space";
    }

    // Show error alert
    Alert.alert('Download Failed', errorMessage, [
      { text: 'Retry', onPress: () => handleDownload() },
      { text: 'Cancel', style: 'cancel' }
    ]);

    // Show error toast
    Toast.show({
      text1: 'Download Failed',
      text2: errorMessage,
      position: 'bottom',
      type: 'error'
    });

  } finally {
    setIsDownloading(false);
    setDownloadProgress(0);
  }
};


  const handleShare = () => {

      if (!resumeUrl) {
          Toast.show({
              text1:"No file selected to copy.",
              position: 'bottom',
              type: 'error'
            });
    return;
  }

  Clipboard.setString(resumeUrl);
  Toast.show({
              text1:"copied to clipboard",
              position: 'bottom',
              type: 'success'
            });
  };

  if (!resumeUrl) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Resume Viewer</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="description" size={64} color="#999" />
          <Text style={styles.errorText}>No resume URL provided</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>
          {isPdf ? 'PDF Resume' : 'Resume Viewer'}
        </Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <MaterialIcons name="share" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload} style={styles.actionButton}>
            <MaterialIcons name="file-download" size={22} color="#333" />
          </TouchableOpacity>
        </View>
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
          <MaterialIcons name="error-outline" size={64} color="#FF3B30" />
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
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: h(3),
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
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
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ResumeViewer;