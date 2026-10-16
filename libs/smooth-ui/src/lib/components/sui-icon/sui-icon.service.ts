import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { SUI_ICON } from '../../constants/sui-icon';

@Service()
export class SuiIconService {
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _platformId: object = inject(PLATFORM_ID);
  private _spriteInjected: boolean = false;

  public ensureSpriteInjected(): void {
    if (this._spriteInjected || !isPlatformBrowser(this._platformId)) return;

    this._spriteInjected = true;
    const container: HTMLDivElement = this._document.createElement('div');
    container.innerHTML = SUI_ICON;
    const sprite: Element | null = container.firstElementChild;

    if (sprite) this._document.body.prepend(sprite);
  }
}
