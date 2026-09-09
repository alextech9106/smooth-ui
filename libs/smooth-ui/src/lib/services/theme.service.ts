import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { STORAGE_KEY } from '../constants/locastorage';
import { Theme } from '../types/sui-theme.type';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly _stored: Theme | null = localStorage.getItem(STORAGE_KEY) as Theme | null;
  readonly _prefersDark: boolean = window.matchMedia('(prefers-color-scheme: dark)').matches;

  readonly theme: WritableSignal<Theme> = signal<Theme>(this._stored ?? (this._prefersDark ? 'dark' : 'light'));

  constructor() {
    effect(() => {
      const theme: Theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  set(theme: Theme): void {
    this.theme.set(theme);
  }
}
