import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { SuiButton } from '../../interfaces/sui-button.interface';
import { SUI_BUTTON_SHAPE } from '../../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../../types/sui-button-size.type';
import { SuiButtonComponent } from '../sui-button/sui-button.component';
import { SuiIconButtonComponent } from '../sui-icon-button/sui-icon-button.component';
import { SUI_BUTTON_GROUP_TYPE } from './type/sui-button-group-type.type';
import { SUI_BUTTON_GROUP_VARIANT } from './type/sui-button-group-variant.type';

@Component({
  imports: [SuiButtonComponent, SuiIconButtonComponent],
  selector: 'sui-button-group',
  styleUrl: './sui-button-group.component.scss',
  templateUrl: './sui-button-group.component.html',
})
export class SuiButtonGroupComponent {
  public buttons: InputSignal<SuiButton[]> = input.required<SuiButton[]>();
  public shape: InputSignal<SUI_BUTTON_SHAPE> = input<SUI_BUTTON_SHAPE>('flat');
  public size: InputSignal<SUI_BUTTON_SIZE> = input<SUI_BUTTON_SIZE>('md');
  public type: InputSignal<SUI_BUTTON_GROUP_TYPE> = input<SUI_BUTTON_GROUP_TYPE>('button');
  public variant: InputSignal<SUI_BUTTON_GROUP_VARIANT> = input<SUI_BUTTON_GROUP_VARIANT>('ghost');

  protected readonly classes: Signal<string> = computed(
    () =>
      `sui-button-group sui-button-group-${this.shape()} sui-button-group-${this.size()} sui-button-group-${this.variant()}`,
  );
}
