import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { SuiButton } from '../sui-button/interface/sui-button.interface';
import { SuiButtonComponent } from '../sui-button/sui-button.component';
import { SUI_BUTTON_GROUP_SHAPE } from './type/sui-button-group-shape.type';
import { SUI_BUTTON_GROUP_VARIANT } from './type/sui-button-group-variant.type';

@Component({
  imports: [SuiButtonComponent],
  selector: 'sui-button-group',
  styleUrl: './sui-button-group.component.scss',
  templateUrl: './sui-button-group.component.html',
})
export class SuiButtonGroupComponent {
  public buttons: InputSignal<SuiButton[]> = input.required();

  public shape: InputSignal<SUI_BUTTON_GROUP_SHAPE> = input<SUI_BUTTON_GROUP_SHAPE>('flat');
  public variant: InputSignal<SUI_BUTTON_GROUP_VARIANT> = input<SUI_BUTTON_GROUP_VARIANT>('ghost');

  protected readonly classes: Signal<string> = computed(
    () => `sui-button-group sui-button-group--${this.shape()} sui-button-group--${this.variant()}`,
  );
}
