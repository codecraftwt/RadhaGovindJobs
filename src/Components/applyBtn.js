import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { h } from 'walstar-rn-responsive'
import { globalColors } from '../Theme/globalColors'

const ApplyBtn = ({onPress, buttonText }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={styles.applyBtnStyles}>
                <Text >{buttonText}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    applyBtnStyles: {
        backgroundColor: globalColors.activepink,
        borderRadius: h(0.5),
        paddingVertical: h(0.8),
        paddingHorizontal: h(1),
        alignItems: 'center',
        marginHorizontal: h(2),
        marginBottom: h(1),
    }
})

export default ApplyBtn 
