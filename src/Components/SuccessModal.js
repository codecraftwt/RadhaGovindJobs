// components/ConfirmDeleteModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { globalColors } from "../Theme/globalColors"; // adjust path

const ConfirmDeleteModal = ({ visible, role, onCancel, onConfirm, loading }) => {
  if (!role) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Delete {role.charAt(0).toUpperCase() + role.slice(1)} Account
          </Text>
          <Text style={styles.message}>
            Are you sure you want to delete your {role} account?{"\n"}
            This action cannot be undone.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteBtn]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Text style={styles.deleteText}>
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: globalColors.white,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "BaiJamjuree-Bold",
    marginBottom: 10,
    color: globalColors.darkblack,
  },
  message: {
    fontSize: 14,
    fontFamily: "BaiJamjuree-Medium",
    color: globalColors.grey,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelBtn: {
    backgroundColor: globalColors.grey,
  },
  deleteBtn: {
    backgroundColor: globalColors.red || "crimson",
  },
  cancelText: {
    color: globalColors.white,
    fontFamily: "BaiJamjuree-Bold",
  },
  deleteText: {
    color: globalColors.white,
    fontFamily: "BaiJamjuree-Bold",
  },
});
