import { isPlatformBrowser } from '@angular/common';
import { computed, DestroyRef, inject, PLATFORM_ID, Service, Signal, signal, WritableSignal } from '@angular/core';
import { SUI_BREAKPOINT } from '../types/sui-breakpoint.type';

const ORDER: readonly SUI_BREAKPOINT[] = ['sm', 'md', 'lg', 'xl', '2xl'];

@Service()
export class BreakpointService {
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  private readonly _matches: WritableSignal<Record<SUI_BREAKPOINT, boolean>> = signal<Record<SUI_BREAKPOINT, boolean>>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  });

  public readonly active: Signal<SUI_BREAKPOINT | null> = computed<SUI_BREAKPOINT | null>(() => {
    const m: Record<SUI_BREAKPOINT, boolean> = this._matches();
    let result: SUI_BREAKPOINT | null = null;
    for (const bp of ORDER) if (m[bp]) result = bp;
    return result;
  });

  constructor() {
    if (!isPlatformBrowser(this._platformId)) return;

    const root: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    for (const bp of ORDER) {
      const value: string = root.getPropertyValue(`--sui-breakpoint-${bp}`).trim();
      if (!value) continue;

      const mql: MediaQueryList = window.matchMedia(`(min-width: ${value})`);
      const update: VoidFunction = (): void => this._matches.update((s: Record<SUI_BREAKPOINT, boolean>) => ({ ...s, [bp]: mql.matches }));

      update();
      mql.addEventListener('change', update);
      this._destroyRef.onDestroy(() => mql.removeEventListener('change', update));
    }
  }

  /** Reactive: true when the viewport width is at least the given breakpoint. */
  matches(bp: SUI_BREAKPOINT): boolean {
    return this._matches()[bp];
  }
}
