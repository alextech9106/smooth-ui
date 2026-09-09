import { Component, inject, input, InputSignal } from '@angular/core';
import { SuiIconService } from './sui-icon.service';

@Component({
  imports: [],
  selector: 'sui-icon',
  styleUrl: './sui-icon.component.scss',
  templateUrl: './sui-icon.component.html',
})
export class SuiIconComponent {
  private readonly _suiIconService: SuiIconService = inject(SuiIconService);
  public name: InputSignal<string> = input.required<string>();
  public size: InputSignal<number> = input<number>(20);

  constructor() {
    this._suiIconService.ensureSpriteInjected();
  }
}
