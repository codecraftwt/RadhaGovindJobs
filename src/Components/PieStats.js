import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';
import { globalColors } from '../Theme/globalColors';
import {
  f,
  h,
  w,
} from 'walstar-rn-responsive';

const PieStats = () => {
  const pieData = [
    {value: 10,color: '#FFC542',title: 'text1',},
    {value: 4, color: '#FF575F', title: 'text2'},
    {value: 16, color: '#3DD598', title: 'text3'},
    {value: 10, color: '#F0F7FA', title: 'text1'},
  ];

  const renderDot = color => {
    return (
      <View
        style={{
          height: h(1.2),
          width: h(1.6),
          borderRadius: h(1),
          backgroundColor: color,
          marginRight: w(3),
        }}
      />
    );
  };

  return (
    <View
      style={{
        backgroundColor: globalColors.backgroundshade,
      }}>
      <View style={styles.maincontainer}>
        <View>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={w(13.5)}
            innerRadius={w(11)}
            innerCircleColor={globalColors.white}
            centerLabelComponent={() => {
              return (
                <View style={styles.center}>
                  <Text style={styles.march}>March</Text>
                </View>
              );
            }}
          />
        </View>
        <View
          style={{
            flexDirection: 'column',
            gap: h(-1),
          }}>
          <Text
            style={{
              fontFamily: 'BaiJamjuree-Bold',
              fontSize: f(2.1),
              color: globalColors.Charcoal,
              marginBottom: h(0.5),
            }}>
            Daily activity
          </Text>
          <View style={styles.activityRow}>
            {renderDot(pieData[0].color)}
            <Text style={styles.activityText}>{pieData[0].title}</Text>
          </View>
          <View style={styles.activityRow}>
            {renderDot(pieData[1].color)}
            <Text style={styles.activityText}>{pieData[1].title}</Text>
          </View>
          <View style={styles.activityRow}>
            {renderDot(pieData[2].color)}
            <Text style={styles.activityText}>{pieData[2].title}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    marginHorizontal: '5%',
    marginVertical:h(2),
    borderRadius: w(4),
    backgroundColor: globalColors.white,
    paddingEnd: '10%',
    elevation: 7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: h(1.2),
  },
  march: {
    color: globalColors.Charcoal,
    fontSize: f(2.4),
    fontFamily: 'BaiJamjuree-Regular',
  },
  center: {justifyContent: 'center', alignItems: 'center'},
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: h(0.7),
  },
  activityText: {
    fontFamily: 'BaiJamjuree-SemiBold',
    fontSize: f(1.6),
    color: globalColors.bluegrey,
    marginLeft: w(2),
  },
});

export default PieStats;
