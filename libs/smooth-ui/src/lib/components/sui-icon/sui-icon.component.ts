import { Component, inject, input, InputSignal } from '@angular/core';
import { SuiIconService } from './sui-icon.service';
import { SUI_ICON_NAME } from './type/sui-icon-name.type';

@Component({
  imports: [],
  selector: 'sui-icon',
  styleUrl: './sui-icon.component.scss',
  templateUrl: './sui-icon.component.html',
})
export class SuiIconComponent {
  private readonly _suiIconService: SuiIconService = inject(SuiIconService);
  public name: InputSignal<SUI_ICON_NAME> = input.required<SUI_ICON_NAME>();
  public size: InputSignal<number> = input<number>(20);

  constructor() {
    this._suiIconService.ensureSpriteInjected();
  }
}
