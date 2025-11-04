import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import { f, h } from 'walstar-rn-responsive';
import { globalColors } from '../../../Theme/globalColors';
import NotificationCard from '../../../Components/NotificationCard';
import AppBar from '../../../Components/AppBar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../../Redux/Slices/authslice';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';


const NotificationScreenAdmin = () => {
  const notificationData = useSelector(state => state.auth.notifications)

  const dispatch = useDispatch()
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
    }, []) 
  );

  // const notificationData = [
  //   {
  //     companyName: 'XYZ Corporation',
  //     notificationTitle: 'Maintenance Reminder',
  //     notificationDescription:
  //       'Scheduled maintenance will be conducted on our systems tomorrow from 10:00 PM to 11:00 PM EST. During this time, access to certain services may be temporarily unavailable. We apologize for any inconvenience.',
  //   },
  //   {
  //     companyName: 'ABC Industries',
  //     notificationTitle: 'Product Launch Announcement',
  //     notificationDescription:
  //       'We are excited to announce the launch of our new product line! Visit our website to explore our latest offerings and take advantage of special launch discounts for a limited time.',
  //   },
  //   {
  //     companyName: 'Acme Corporation',
  //     notificationTitle: 'Service Outage Alert',
  //     notificationDescription:
  //       'We are currently experiencing technical difficulties with our online services. Our team is actively working to resolve the issue. We apologize for the inconvenience and appreciate your patience.',
  //   },
  //   {
  //     companyName: 'Global Solutions Ltd.',
  //     notificationTitle: 'Important Security Update',
  //     notificationDescription:
  //       'A critical security update is available for our software. Please ensure that all users install the update immediately to protect against potential vulnerabilities. Failure to update may expose your system to security risks.',
  //   },
  //   {
  //     companyName: 'Tech Innovations Inc.',
  //     notificationTitle: 'Webinar Invitation',
  //     notificationDescription:
  //       "Join us for an exclusive webinar on the latest trends in technology. Our experts will discuss innovative solutions and strategies to stay ahead in today's dynamic digital landscape. Reserve your spot now!",
  //   },
  //   {
  //     companyName: 'Summit Enterprises',
  //     notificationTitle: 'Employee Training Session',
  //     notificationDescription:
  //       'Reminder: Mandatory training session for all employees will be held this Friday at 9:00 AM in the conference room. Topics include workplace safety protocols and new company policies.',
  //   },
  //   {
  //     companyName: 'Bright Ideas Agency',
  //     notificationTitle: 'Client Meeting Reminder',
  //     notificationDescription:
  //       'Just a friendly reminder about our upcoming client meeting scheduled for tomorrow at 2:00 PM. Please ensure that all necessary preparations are completed beforehand.',
  //   },
  //   {
  //     companyName: 'Quantum Technologies',
  //     notificationTitle: 'System Upgrade Notice',
  //     notificationDescription:
  //       'We will be conducting a system upgrade over the weekend to enhance performance and add new features. Expect intermittent service disruptions during the maintenance window. Thank you for your understanding.',
  //   },
  //   {
  //     companyName: 'Stellar Solutions',
  //     notificationTitle: 'Holiday Office Closure',
  //     notificationDescription: 'Our office will be closed on Monday',
  //   },
  // ];

  const reversedNotificationData = [...notificationData]?.reverse();

  return (
    <View style={{ flex: 1, backgroundColor: globalColors.backgroundshade }}>
      <AppBar />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t("Notifications")}</Text>
        <FlatList
          data={reversedNotificationData.slice(0,15)}
          renderItem={({ item }) => <NotificationCard data={item} />}
        />
      </ScrollView>
    </View>
  );
};

export default NotificationScreenAdmin;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'BaiJamjuree-SemiBold',
    color: globalColors.black,
    fontSize: f(2),
    marginStart: '5%',
    paddingTop: h(1.5),
    paddingBottom: h(0.5)
  },
});
