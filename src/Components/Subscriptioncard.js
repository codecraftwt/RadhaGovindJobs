import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalColors } from '../Theme/globalColors'
import { f, h, w } from 'walstar-rn-responsive'


const Subscriptioncard = () => {
        return (
            <View style={styles.container}>
                <View style={styles.subTitleCard}>
                    <View style={styles.subTitleText}>
                        <Text style={{ fontFamily: 'BaiJamjuree-Bold', color: globalColors.black, fontSize: f(1.8), paddingTop: h(1) }}>Subscription name</Text>
                    </View>
                    <View style={styles.subDetailsCard}>
                        <View style={styles.subDetailsText} >
                        <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: globalColors.black, fontSize: f(1.3) }}>It is a long established fact that a reader will be
                            readable content of a page.</Text>
                        <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: globalColors.black, fontSize: f(1.3) }}>Your sucscription will end on Jan 25, 2024</Text>
                        </View>
                        <View style={styles.subBtn}>
                        <TouchableOpacity style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: globalColors.red, fontSize: f(1.5), }}>
                                Canceled
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resubscribebtn}>
                            <Text style={{ fontFamily: 'BaiJamjuree-Medium', color: globalColors.white, fontSize: f(1.5),textAlign:'center' }}>
                                Resubscribe
                            </Text>
                        </TouchableOpacity>
                    </View>

                    </View>
                    
                </View>
            </View>
        )
    }

   



const styles = StyleSheet.create({
    container: {
        backgroundColor: globalColors.white,
        paddingHorizontal: h(2),
        marginBottom: h(2),
        borderRadius:h(2),
        elevation:3,
        flex:1
    },
    subTitleCard: {
        width: '100%',
        marginRight: h(6),
        paddingBottom: h(2),
    }, 
    subDetailsCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
        marginBottom: h(1),
        width:'100%', 
        gap:w(-10)
    },
    subDetailsText:{
        maxWidth:w(66)
    },  
    resubscribebtn: {
        backgroundColor: globalColors.activepink,
        paddingHorizontal: h(1),
        paddingVertical: h(0.5),
        borderRadius:h(0.7),
    },
    subBtn: {
        alignItems: 'flex-end',
        maxWidth:"30%"
    },
});

export default Subscriptioncard


