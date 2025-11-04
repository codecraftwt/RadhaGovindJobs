import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RecentJobList from '../Screens/Admin/Home/RecentJobList';
import RecentCompany from '../Screens/Admin/Home/RecentCompany';
import Saved from '../Screens/Admin/Home/Saved';
import { f } from 'walstar-rn-responsive';
import { useTranslation } from 'react-i18next';
import { globalColors } from '../Theme/globalColors';
import usePermissionCheck from '../Utils/HasPermission';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigation = () => {
  const { t } = useTranslation();
  const hasPermission = usePermissionCheck()

  return (
 
    <Tab.Navigator   screenOptions={{
        tabBarItemStyle: {},
        tabBarActiveTintColor: globalColors.activepink,
        tabBarInactiveTintColor: globalColors.darkblack,
        tabBarIndicatorStyle: {borderBottomColor: globalColors.activepink, borderBottomWidth: 2.2 ,width:hasPermission('Save Job Mobile')?'25%':'44%', marginLeft:'3%' },
      }}>
      <Tab.Screen 
        name="RecentJobList" 
        component={RecentJobList}
        options={{ 
          tabBarLabel: ({ focused }) => (
            <Text style={{fontFamily: 'BaiJamjuree-Medium', color: focused ? globalColors.commonpink : globalColors.darkblack, fontSize: f(1.54) }} numberOfLines={1}>
              {t('Recent Job List')}
            </Text>
          ),
        }} 
      />
      <Tab.Screen 
        name="RecentCompany" 
        component={RecentCompany} 
        options={{ 
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: focused ? globalColors.commonpink : globalColors.darkblack, fontSize: f(1.54) }} numberOfLines={1}>
              {t('Recent Company')}
            </Text>
          ), 
        }} 
      />
      {hasPermission('Save Job Mobile') && (
        <Tab.Screen 
        name="Saved" 
        component={Saved} 
        options={{ 
          tabBarLabel: ({ focused }) => (
            <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: focused ? globalColors.commonpink : globalColors.darkblack, fontSize: f(1.54) }} numberOfLines={1}>
              {t('Saved')}
            </Text>
          ), 
        }} 
      />
      )}
      
    </Tab.Navigator>

  );
};

const styles = StyleSheet.create({});

export default TopTabNavigation;