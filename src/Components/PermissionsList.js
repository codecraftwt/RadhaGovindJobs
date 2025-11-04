import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

const PermissionsList = ({ HeaderComponent, footerComponent }) => {
    const permissions = useSelector(state => state.Permissions.permissions) || [];
    const isLoading = useSelector(state => state.Permissions.isLoading);

    return (
        <FlatList
            data={permissions}
            renderItem={({ item }) => (
                // Your permission item rendering logic here
                <View style={styles.item}>
                    {/* Permission item content */}
                </View>
            )}
            keyExtractor={(item, index) => `permission-${item.id || index}`}
            ListHeaderComponent={HeaderComponent}
            ListFooterComponent={footerComponent}
            contentContainerStyle={styles.container}
            onError={(error) => {
                console.log('FlatList error:', error);
            }}
            ListEmptyComponent={() => (
                <View style={styles.empty}>
                    {/* Empty state content */}
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});

export default PermissionsList;
