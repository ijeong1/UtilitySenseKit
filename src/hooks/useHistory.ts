import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarcodeHistoryItem } from '@/types/BarcodeHistoryItem';
import { WeatherHistoryItem } from '@/types/WeatherHistoryItem';

type UseWeatherHistoryReturn = {
  weatherHistory: WeatherHistoryItem[];
  addWeatherToHistory: (item: WeatherHistoryItem) => Promise<void>;
};

type UseBarcodeHistoryReturn = {
  barcodeHistory: BarcodeHistoryItem[];
  addBarcodeToHistory: (item: BarcodeHistoryItem) => Promise<void>;
};

export function useHistory(key: 'weatherHistory', limit?: number): UseWeatherHistoryReturn;
export function useHistory(key: 'barcodeHistory', limit?: number): UseBarcodeHistoryReturn;
export function useHistory(key: 'weatherHistory' | 'barcodeHistory', limit: number = 5) {
  
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(key);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (e) {
        console.error(`Failed to load ${key} history:`, e);
      }
    };
    loadHistory();
  }, [key]);

  const addHistoryItem = useCallback(async (item: WeatherHistoryItem | BarcodeHistoryItem) => {
    try {
      setHistory((prevHistory: (WeatherHistoryItem | BarcodeHistoryItem)[]) => {
        let newHistory: (WeatherHistoryItem | BarcodeHistoryItem)[] = [];

        if (key === 'weatherHistory') {
          const weatherItem = item as WeatherHistoryItem;
          newHistory = [weatherItem, ...(prevHistory as WeatherHistoryItem[]).filter(h => h.zip !== weatherItem.zip)];
        } else if (key === 'barcodeHistory') {
          const barcodeItem = item as BarcodeHistoryItem;
          newHistory = [barcodeItem, ...(prevHistory as BarcodeHistoryItem[])];
        }

        const limitedHistory = newHistory.slice(0, limit);
        AsyncStorage.setItem(key, JSON.stringify(limitedHistory));
        return limitedHistory;
      });
    } catch (e) {
      console.error(`Failed to save ${key} history:`, e);
    }
  }, [key, limit]);

  if (key === 'weatherHistory') {
    return {
      weatherHistory: history as WeatherHistoryItem[], // Cast the internal state for external use
      addWeatherToHistory: addHistoryItem as (item: WeatherHistoryItem) => Promise<void>,
    } as UseWeatherHistoryReturn;
  } else {
    return {
      barcodeHistory: history as BarcodeHistoryItem[],
      addBarcodeToHistory: addHistoryItem as (item: BarcodeHistoryItem) => Promise<void>,
    } as UseBarcodeHistoryReturn;
  }
}