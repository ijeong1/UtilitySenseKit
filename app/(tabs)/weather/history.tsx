import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SearchHistoryItem } from '@/src/types/SearchHistoryItem';

const WeatherHistoryScreen = () => {
  const router = useRouter();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFullHistory();
  }, []);

  const loadFullHistory = async () => {
    setLoading(true);
    try {
      const storedHistory = await AsyncStorage.getItem('weatherSearchHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load full history:', e);
      setError('Failed to load search history.');
    } finally {
      setLoading(false);
    }
  };

  const goBackToWeatherScreen = () => {
    router.back();
  };

  const renderHistoryItem = ({ item }: { item: SearchHistoryItem }) => (
    <View style={styles.historyItem}>
      <Text style={styles.itemLocation}>
        {item.locationName} ({item.zip})
      </Text>
      <Text style={styles.itemTemperature}>
        {item.temperature}°F
      </Text>
      <Text style={styles.itemTimestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Full Search History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : history.length === 0 ? (
        <Text style={styles.infoText}>No search history found.</Text>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => `${item.zip}-${item.timestamp}-${index}`}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemTemperature: {
    fontSize: 16,
    color: '#555',
  },
  itemTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default WeatherHistoryScreen;