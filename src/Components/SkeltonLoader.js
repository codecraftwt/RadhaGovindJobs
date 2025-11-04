import { StyleSheet, View } from 'react-native';
import React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { w } from 'walstar-rn-responsive';

const SkeltonLoader = ({skeltonstyles}) => {
  return (
    <View style={[{flex:1},skeltonstyles]}>
      <ContentLoader
        width={w(100)}
        height={w(160)}
        backgroundColor="#f5f5f5"
        foregroundColor="#dbdbdb">
        <Rect x="102" y="28" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="92" y="6" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="48" cy="22" r={w(6)} />
        <Rect x="95" y="54" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Rect x="105" y="128" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="95" y="106" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="51" cy="122" r={w(6)} />
        <Rect x="98" y="154" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Rect x="107" y="224" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="97" y="202" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="53" cy="218" r={w(6)} />
        <Rect x="100" y="250" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Rect x="108" y="324" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="98" y="302" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="54" cy="318" r={w(6)} />
        <Rect x="101" y="350" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Rect x="110" y="417" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="100" y="395" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="56" cy="411" r={w(6)} />
        <Rect x="103" y="443" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Rect x="110" y="517" rx="3" ry="3" width={w(40)} height={w(4)} />
        <Rect x="100" y="495" rx="3" ry="3" width={w(60)} height={w(3.5)} />
        <Circle cx="56" cy="511" r={w(6)} />
        <Rect x="103" y="543" rx="3" ry="3" width={w(60)} height={w(3.5)} />
      </ContentLoader>
    </View>
  );
};

export default SkeltonLoader;

const styles = StyleSheet.create({});
