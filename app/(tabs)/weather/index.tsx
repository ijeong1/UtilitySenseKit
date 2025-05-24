import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ForecastCard from '@/components/weather/ForecastCard';
import { getWeatherByZip } from '@/services/weatherService';
import { ForecastItem } from '@/types/ForecastItem';
import { WeatherData } from '@/types/WeatherData';
import { SearchHistoryItem } from '@/types/SearchHistoryItem'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  StatusBar,
  Button,
} from 'react-native';

const WeatherScreen = () => {
  const router = useRouter();

  const [zipCode, setZipCode] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    loadSearchHistory();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('weatherSearchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (e) {
      console.error('Failed to load search history:', e);
    }
  };

  const saveToSearchHistory = async (zip: string, locationName: string, temp: number) => {
    const newItem: SearchHistoryItem = { zip, locationName, temperature: temp, timestamp: Date.now() };

    let updatedHistory = searchHistory.filter(item => item.zip !== zip);
    updatedHistory.unshift(newItem);
    updatedHistory = updatedHistory.slice(0, 5);

    try {
      await AsyncStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory));
      setSearchHistory(updatedHistory);
    } catch (e) {
      console.error('Failed to save search history:', e);
    }
  };

  const fetchWeather = useCallback(async () => {
    Keyboard.dismiss();

    if (!/^\d{5}$/.test(zipCode)) {
      Alert.alert('Invalid ZIP Code', 'Please enter a valid 5-digit U.S. ZIP code.');
      return;
    }

    setLoading(true);
    try {
      const { weather, forecast: forecastData } = await getWeatherByZip(zipCode);
      setWeatherData(weather);
      setForecast(forecastData);

      if (weather) {
        saveToSearchHistory(zipCode, weather.name, Math.round(weather.main.temp));
      }

    } catch (err: any) {
      console.error('Error fetching weather:', err);
      Alert.alert('Error', err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [zipCode, saveToSearchHistory]);

  const handleHistoryItemPress = useCallback((item: SearchHistoryItem) => {
    setZipCode(item.zip);
  }, []);

  const navigateToHistory = useCallback(() => {
    router.push('/weather/history');
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Current Weather</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter U.S. ZIP Code"
            keyboardType="numeric"
            maxLength={5}
            value={zipCode}
            onChangeText={setZipCode}
            onSubmitEditing={fetchWeather}
          />
          <TouchableOpacity onPress={fetchWeather} style={styles.searchButton} disabled={loading}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : weatherData ? (
          <View style={styles.weatherContainer}>
            <Text style={styles.locationName}>
              {weatherData.name}, {weatherData.sys.country}
            </Text>
            {weatherData.weather[0]?.icon && (
              <Image
                source={{ uri: `<span class="math-inline">\{OPEN\_WEATHER\_ICON\_BASE\_URL\}</span>{weatherData.weather[0].icon}@2x.png` }}
                style={styles.weatherIcon}
              />
            )}
            <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°F</Text>
            {weatherData.weather[0] && <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>}

            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            <FlatList
              data={forecast}
              renderItem={({ item }) => <ForecastCard item={item} />}
              keyExtractor={(item) => item.dt.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forecastListContainer}
            />
          </View>
        ) : (
          <Text style={styles.infoText}>Search for a ZIP code to see weather.</Text>
        )}

        {/* --- Search History Section --- */}
        <Text style={styles.sectionTitle}>Weather History (Last 5)</Text>
        <View style={styles.historyContainer}>
          {Array.isArray(searchHistory) && searchHistory.length > 0 ? (
            searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => handleHistoryItemPress(item)}
              >
                <Text style={styles.historyText}>
                  {item.locationName} ({item.zip}): {item.temperature}°F
                </Text>
                <Text style={styles.historyTimestamp}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.infoTextSmall}>No recent searches.</Text>
          )}

          {/* View Full History Button */}
          <Button // <--- ADD THIS BUTTON
            title="View Full History"
            onPress={navigateToHistory}
            color="#007AFF"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: 'white',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  infoTextSmall: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#333',
    alignSelf: 'flex-start',
    width: '100%',
  },
  weatherContainer: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  locationName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    alignSelf: 'flex-start',
    width: '100%',
  },
  forecastListContainer: {
    paddingVertical: 10,
  },
  historyContainer: {
    width: '100%',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 16,
    color: '#555',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
export default WeatherScreen;