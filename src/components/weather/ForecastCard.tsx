import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ForecastItem } from '@/types/ForecastItem';

const ForecastCard = ({ item }: { item: ForecastItem }) => {
  const date = new Date(item.dt * 1000);
  const day = date.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View style={styles.card}>
      <Text>{day}</Text>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }} style={styles.icon} />
      <Text>{Math.round(item.main.temp_max)}° / {Math.round(item.main.temp_min)}°F</Text>
      <Text>{item.weather[0].main}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { alignItems: 'center', marginRight: 16, width: 80 },
  icon: { width: 50, height: 50 },
});

export default ForecastCard;