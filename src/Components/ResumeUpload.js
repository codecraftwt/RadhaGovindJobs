// ResumeUpload.js       creted for testing
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import DocumentUpload from './DocumentUpload';



export default function ResumeUpload() {
  const isDark =  useColorScheme() === 'dark';

  const onComplete =async  file => {
    if (!file) {
        console.log('✅ removed successfully ', file,);
        return
    };
    console.log('✅ after blob', file);
    Alert.alert('Success', 'Document uploaded successfully',file);
  };

  return (
    <ScrollView
      style={[styles.container, isDark && styles.containerDark]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, isDark && { color: '#fff' }]}>
        Upload Resume
      </Text>
      <Text style={[styles.sub, isDark && { color: '#aaa' }]}>
        Pick your latest résumé/CV
      </Text>

      {/* reusable picker */}
      <DocumentUpload type="Resume" onUploadComplete={onComplete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sub: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
