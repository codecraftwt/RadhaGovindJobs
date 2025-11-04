import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { globalColors } from '../Theme/globalColors';
import { f, h, w } from 'walstar-rn-responsive';

const BulletpointContainer = ({data}) => {

    const renderItem = ({ item }) => (
        <View style={styles.jobRequirment}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.requirementText}>{item.name}</Text>
        </View>
    );

  return (
    <View>
            <FlatList
                data={data}
                renderItem={renderItem}
            />
    </View>
  )
}

export default BulletpointContainer

const styles = StyleSheet.create({
    jobRequirment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:w(0.1),
    },
    bullet: {
        color: globalColors.black,
        paddingRight: h(2),
        fontSize: h(3)
    },
    requirementText: {
        fontFamily: 'BaiJamjuree-Medium',
        color: globalColors.suvagrey,
        fontSize: f(1.6),
    },
})