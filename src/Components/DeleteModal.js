import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { globalColors } from '../Theme/globalColors';
import { f, h } from 'walstar-rn-responsive';
import { cross } from '../Theme/globalImages';
import { useTranslation } from 'react-i18next';


const DeleteModal = ({ visible, itemName, onCancel, onDelete }) => {
    const {t} = useTranslation();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.Container}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalTitle}>
                        <View style={{ width: '100%', alignSelf: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: f(2), color: globalColors.black, fontFamily: 'BaiJamjuree-Medium', }}>{t("Confirm Delete")} </Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={onCancel}>
                                <Image source={cross} style={{ height: h(2), width: h(2) }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.horizontalRule} />
                    <Text style={styles.modalText}>
                        {t("Are you sure you want to delete this")} {itemName}?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>{t("Cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                            <Text style={styles.buttonText}>{t('Delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: globalColors.white,
        paddingHorizontal: h(4),
        paddingVertical: h(2.5),
        borderRadius: h(0.5),
        width: '80%',
    },
    modalTitle: {
        flexDirection: "row",
        justifyContent: 'center',

    },
    horizontalRule: {
        borderBottomColor: globalColors.purplegrey,
        borderBottomWidth: h(0.3),
        marginBottom: h(2),
        marginTop: h(0.8),
    },
    modalText: {
        fontSize: f(1.65),
        marginBottom: h(3),
        textAlign: 'center',
        color: globalColors.black,
        fontFamily: 'BaiJamjuree-Medium'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    cancelButton: {
        backgroundColor: globalColors.suvagrey,
        paddingHorizontal: h(1.2),
        borderRadius: h(0.5),
        width: '45%',
        paddingVertical: h(0.2),
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: globalColors.activepink,
        paddingHorizontal: h(1.2),
        paddingVertical: h(0.2),
        borderRadius: h(0.5),
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: globalColors.white,
        fontSize: f(1.65),
        fontFamily: 'BaiJamjuree-Regular'
    },
});

export default DeleteModal;
