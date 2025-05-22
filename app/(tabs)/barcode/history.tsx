import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useHistory } from '@/hooks/useHistory';

const BarcodeHistoryScreen = () => {
    const { barcodeHistory } = useHistory('barcodeHistory');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Barcode Scan History</Text>
            <FlatList
                data={barcodeHistory}
                keyExtractor={(item, idx) => item.code + idx}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.codeText}>{item.code}</Text>
                        <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                            {item.timestamp
                                ? new Date(item.timestamp).toLocaleString()
                                : ''}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.empty}>No history yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    item: {
        padding: 12,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    codeText: {
        fontSize: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999',
        fontSize: 16,
    },
});
export default BarcodeHistoryScreen;