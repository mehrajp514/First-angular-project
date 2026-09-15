import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved
      ? saved === 'true'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setDarkMode(isDark);
  }

  toggle() {
    this.setDarkMode(!this.darkMode.value);
  }

  setDarkMode(isDark: boolean) {
    this.darkMode.next(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('darkMode', String(isDark));
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}
