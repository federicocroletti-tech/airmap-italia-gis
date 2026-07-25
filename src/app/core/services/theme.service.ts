import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';
import { AppTheme } from '../config/app.config';

const THEME_STORAGE_KEY = 'airmap-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly currentThemeSignal = signal<AppTheme>(this.loadThemePreference());

  readonly currentTheme = this.currentThemeSignal.asReadonly();
  readonly isDarkTheme = computed(() => this.currentThemeSignal() === 'dark');

  constructor() {
    this.applyTheme(this.currentThemeSignal());
  }

  setTheme(theme: AppTheme): void {
    this.currentThemeSignal.set(theme);
    this.applyTheme(theme);
    this.saveThemePreference(theme);
  }

  toggleTheme(): void {
    this.setTheme(this.currentThemeSignal() === 'dark' ? 'light' : 'dark');
  }

  getCurrentTheme(): AppTheme {
    return this.currentThemeSignal();
  }

  saveThemePreference(theme = this.currentThemeSignal()): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  loadThemePreference(): AppTheme {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
  }

  private applyTheme(theme: AppTheme): void {
    const root = this.document.documentElement;
    root.classList.toggle('dark-theme', theme === 'dark');
    root.classList.toggle('light-theme', theme === 'light');
    root.setAttribute('data-theme', theme);
  }
}
