import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_BUTTON_VARIANT } from './type/sui-button-variant.type';
import { SUI_BUTTON_SIZE } from './type/sui-button-size.type';
import { SUI_BUTTON_STATE } from './type/sui-button-state.type';
import { SUI_BUTTON_SHAPE } from './type/sui-button-shape.type';

@Component({
  imports: [SuiIconComponent],
  selector: 'sui-button',
  styleUrl: './sui-button.component.scss',
  templateUrl: './sui-button.component.html',
})
export class SuiButtonComponent {
  public fullWidth: InputSignal<boolean> = input(false);
  public iconEnd: InputSignal<boolean> = input(false);
  public loading: InputSignal<boolean> = input(false);

  public iconSize: InputSignal<number> = input(20);

  public name: InputSignal<string> = input.required<string>();
  public icon: InputSignal<string> = input('');
  public shape: InputSignal<SUI_BUTTON_SHAPE> = input<SUI_BUTTON_SHAPE>('rounded');
  public size: InputSignal<SUI_BUTTON_SIZE> = input<SUI_BUTTON_SIZE>('md');
  public state: InputSignal<SUI_BUTTON_STATE> = input<SUI_BUTTON_STATE>('default');
  public variant: InputSignal<SUI_BUTTON_VARIANT> = input<SUI_BUTTON_VARIANT>('primary');

  protected readonly classes: Signal<string> = computed(
    () =>
      `sui-button sui-button--${this.variant()} sui-button--${this.size()} sui-button--${this.state()} sui-button--${this.shape()} ${this.fullWidth() ? 'sui-button--full-width' : ''}`,
  );
  protected readonly showIconStart: Signal<boolean> = computed(
    () => this.icon() !== '' && !this.iconEnd(),
  );
  protected readonly showIconEnd: Signal<boolean> = computed(
    () => this.icon() !== '' && this.iconEnd(),
  );
}
