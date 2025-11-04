import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { globalColors } from '../Theme/globalColors';
import { f, h } from 'walstar-rn-responsive';

const TitleDescriptionCard = ({descriptiontitle, description}) => {
  return (
    <View>
      <View>
        <Text style={styles.title}>{descriptiontitle}</Text>
      </View>
      <View>
        <Text style={styles.descriptionText}>
          {description
            ? description
            : 'No  Description Found'}
        </Text>
      </View>
    </View>
  );
};

export default TitleDescriptionCard;

const styles = StyleSheet.create({
  title: {
    fontFamily: 'BaiJamjuree-Bold',
    color: globalColors.black,
    fontSize: f(2),
    paddingVertical: h(0.5),
  },
  descriptionText: {
    fontFamily: 'BaiJamjuree-Medium',
    color: globalColors.suvagrey,
    fontSize: f(1.6),
  },
});
