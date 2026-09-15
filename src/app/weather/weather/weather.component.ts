import { Component } from '@angular/core';
import { WeatherServiceService } from '../weather-service.service';
import { GeoLocation, WeatherResult } from '../weather.model';

const WEATHER_CODES: { [key: number]: { label: string; icon: string } } = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mostly clear', icon: '🌤️' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Fog', icon: '🌫️' },
  51: { label: 'Light drizzle', icon: '🌦️' },
  53: { label: 'Drizzle', icon: '🌦️' },
  55: { label: 'Dense drizzle', icon: '🌧️' },
  61: { label: 'Light rain', icon: '🌦️' },
  63: { label: 'Rain', icon: '🌧️' },
  65: { label: 'Heavy rain', icon: '🌧️' },
  71: { label: 'Light snow', icon: '🌨️' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦️' },
  81: { label: 'Rain showers', icon: '🌧️' },
  82: { label: 'Violent showers', icon: '⛈️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm w/ hail', icon: '⛈️' },
  99: { label: 'Thunderstorm w/ hail', icon: '⛈️' }
};

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  matches: GeoLocation[] = [];
  error: any;
  city = '';
  result: WeatherResult | null = null;
  loading = false;

  constructor(private weatherService: WeatherServiceService) { }

  search() {
    const query = this.city.trim();
    if (!query) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.result = null;
    this.matches = [];

    this.weatherService.searchLocations(query).subscribe({
      next: (locations) => {
        this.matches = locations;
        this.loading = false;
        if (locations.length === 0) {
          this.error = `No matches for "${query}".`;
        }
      },
      error: () => {
        this.error = 'Unable to fetch locations. Please try again.';
        this.loading = false;
      }
    });
  }

  selectLoction(location: GeoLocation): void {
    this.matches = [];
    this.loading = true;
    this.error = null;

    this.weatherService.getForecast(location).subscribe({
      next: (result) => {
        this.result = result;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to fetch the forecast for that location.';
        this.loading = false;
      }
    });
  }

  weatherIcon(code: number): string {
    return WEATHER_CODES[code]?.icon || '🌡️';
  }

  weatherLabel(code: number): string {
    return WEATHER_CODES[code]?.label || 'Unknown';
  }

  dayLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  }
}
