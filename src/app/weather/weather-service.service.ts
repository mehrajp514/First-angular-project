import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentWeather, DailyForecast, GeoLocation, WeatherResult } from './weather.model';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {

  constructor(private http: HttpClient) { }

  searchLocations(city: string): Observable<GeoLocation[]> {
    const params = `?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    return this.http.get<any>(GEOCODING_URL + params).pipe(
      map(res => res.results || [])
    );
  }

  getForecast(location: GeoLocation): Observable<WeatherResult> {
    const params = `?latitude=${location.latitude}&longitude=${location.longitude}` +
      `&current_weather=true` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto`;

    return this.http.get<any>(FORECAST_URL + params).pipe(
      map(res => {
        const current: CurrentWeather = {
          temperature: res.current_weather.temperature,
          windspeed: res.current_weather.windspeed,
          weathercode: res.current_weather.weathercode,
          time: res.current_weather.time
        };

        const daily: DailyForecast = {
          time: res.daily.time,
          weathercode: res.daily.weathercode,
          temperature_2m_max: res.daily.temperature_2m_max,
          temperature_2m_min: res.daily.temperature_2m_min
        };

        return { location, current, daily } as WeatherResult;
      })
    );
  }
}
