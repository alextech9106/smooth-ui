import { inject, PLATFORM_ID, Service } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SUI_ICON } from './sui-icon';

@Service()
export class SuiIconService {
  private readonly _platformId = inject(PLATFORM_ID);
  private _spriteInjected: boolean = false;

  public ensureSpriteInjected(): void {
    if (this._spriteInjected || !isPlatformBrowser(this._platformId)) return;

    this._spriteInjected = true;
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = SUI_ICON;
    document.body.prepend(container.firstElementChild!);
  }
}
