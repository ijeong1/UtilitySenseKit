import axios from 'axios';

export const weatherClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
  params: {
    appid: process.env.EXPO_PUBLIC_WEATHER_API_KEY,
    units: 'imperial',
  },
});