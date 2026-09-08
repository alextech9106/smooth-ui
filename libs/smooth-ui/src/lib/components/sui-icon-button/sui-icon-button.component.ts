import { NgClass } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
} from '@angular/core';
import { SUI_BUTTON_SHAPE } from '../../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../../types/sui-button-size.type';
import { SUI_BUTTON_STATE } from '../../types/sui-button-state.type';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_ICON_BUTTON_VARIANT } from './type/sui-icon-button-variant.type';

@Component({
  imports: [SuiIconComponent, NgClass],
  selector: 'sui-icon-button',
  styleUrl: './sui-icon-button.component.scss',
  templateUrl: './sui-icon-button.component.html',
})
export class SuiIconButtonComponent {
  public selected: InputSignal<boolean> = input(false);

  public badge: InputSignal<number> = input(0);
  public iconSize: InputSignal<number> = input(20);

  public icon: InputSignal<string> = input.required();

  public shape: InputSignal<SUI_BUTTON_SHAPE> = input<SUI_BUTTON_SHAPE>('rounded');
  public size: InputSignal<SUI_BUTTON_SIZE> = input<SUI_BUTTON_SIZE>('md');
  public state: InputSignal<SUI_BUTTON_STATE> = input<SUI_BUTTON_STATE>('default');
  public variant: InputSignal<SUI_ICON_BUTTON_VARIANT> = input<SUI_ICON_BUTTON_VARIANT>('ghost');

  public onClick: OutputEmitterRef<void> = output<void>();

  protected readonly classes: Signal<string> = computed(
    () =>
      `sui-icon-button sui-icon-button--${this.variant()} sui-icon-button--${this.size()} sui-icon-button--${this.state()} sui-icon-button--${this.shape()} ${this.selected() ? 'sui-icon-button--selected' : ''}`,
  );
}
