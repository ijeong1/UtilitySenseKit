// Update the import path below to the correct location of your api constants
import { GEO_BASE, WEATHER_BASE } from '@/config/api';
import { weatherClient } from '@/config/axios';
import { ForecastItem } from '@/types/ForecastItem';
import { WeatherData } from '@/types/WeatherData';

export const getWeatherByZip = async (zip: string): Promise<{
  weather: WeatherData;
  forecast: ForecastItem[];
}> => {
  const geo = await weatherClient.get(`${GEO_BASE}/zip`, {
    params: {
      zip: `${zip},US`,
    },
  });
  const { lat, lon } = geo.data;

  
  const weatherRes = await weatherClient.get(`${WEATHER_BASE}/weather`, {
    params: {
      lat,
      lon,
    },
  });

  const forecastRes = await weatherClient.get(`${WEATHER_BASE}/forecast`, {
    params: {
      lat,
      lon,
    },
  });

  const list = forecastRes.data.list;
  const daily: { [key: string]: ForecastItem } = {};
  list.forEach((item: ForecastItem) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!daily[date]) daily[date] = item;
  });

  return {
    weather: weatherRes.data,
    forecast: Object.values(daily).slice(0, 5),
  };
};
