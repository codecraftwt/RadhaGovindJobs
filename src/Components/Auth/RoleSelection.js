import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalColors } from '../../Theme/globalColors';
import { h, w, f } from 'walstar-rn-responsive';
import {useTranslation} from 'react-i18next';

const RoleSelection = ({ onRoleSelect }) => {
  const {t} = useTranslation();
  const roles = [
    { label: 'candidate', value: 'candidate', description: 'looking_for_job' },
    { label: 'consultant', value: 'consultant', description: 'provide_consulting' },
    { label: 'employee', value: 'employer', description: 'hire_talented' },
    { label: 'Institute', value: 'institute', description: 'educational_institution' },
    { label: 'GramPanchayat', value: 'gram_panchayat', description: 'local_government' },
    { label: "HaveAccount", value: 'Login', description: 'access_account' },
  ];

  return (
    <View style={styles.roleSelectionContainer}>
      <Text style={styles.title}>{t('join_platform')}</Text>
      <Text style={styles.subtitle}>{t('select_role')}</Text>
      
      <View style={styles.rolesGrid}>
        {roles.map((role, index) => (
          <TouchableOpacity
            key={role.value}
            style={[
              styles.roleCard,
              role.value === "Login" ? styles.loginCard : styles.regularCard
            ]}
            onPress={() => onRoleSelect(role.value)}
          >
            <Text style={styles.roleLabel}>{t(`${role.label}`)}</Text>
            {role.description && (
              <Text style={styles.roleDescription}>{t(`${role.description}`)}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  roleSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: h(4),
  },
  title: {
    fontSize: f(4),
    fontFamily: 'BaiJamjuree-Bold',
    textAlign: 'center',
    marginBottom: h(1),
    color: globalColors.black,
  },
  subtitle: {
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-Regular',
    textAlign: 'center',
    marginBottom: h(6),
    color: globalColors.mauve,
  },
  rolesGrid: {
    flexDirection: 'column',
  },
  roleCard: {
    padding: h(1),
    borderRadius: h(1.2),
    marginVertical: h(1),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  regularCard: {
    backgroundColor: globalColors.purplemedium1,
  },
  loginCard: {
    backgroundColor: globalColors.purplegradient1,
    marginTop: h(3),
    borderWidth: 2,
    borderColor: globalColors.purplegradient2,
  },
  roleLabel: {
    color: globalColors.white,
    fontSize: f(2.2),
    fontFamily: 'BaiJamjuree-SemiBold',
    textAlign: 'center',
  },
  roleDescription: {
    color: globalColors.white,
    fontSize: f(1.6),
    fontFamily: 'BaiJamjuree-Regular',
    textAlign: 'center',
    marginTop: h(0.5),
    opacity: 0.9,
  },
});

export default RoleSelection;