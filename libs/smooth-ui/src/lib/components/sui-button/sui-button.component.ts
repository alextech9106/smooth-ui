import { NgClass } from '@angular/common';
import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { SUI_SHAPE } from '../../types/sui-shape.type';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SUI_STATE } from '../../types/sui-state.type';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_BUTTON_TYPE } from './type/sui-button-type.type';
import { SUI_BUTTON_VARIANT } from './type/sui-button-variant.type';

@Component({
  imports: [SuiIconComponent, NgClass],
  selector: 'sui-button',
  styleUrl: './sui-button.component.scss',
  templateUrl: './sui-button.component.html',
})
export class SuiButtonComponent {
  public name: InputSignal<string> = input.required<string>();
  public fullWidth: InputSignal<boolean> = input<boolean>(false);
  public iconEnd: InputSignal<boolean> = input<boolean>(false);
  public loading: InputSignal<boolean> = input<boolean>(false);
  public selected: InputSignal<boolean> = input<boolean>(false);
  public iconSize: InputSignal<number> = input<number>(20);
  public icon: InputSignal<string> = input<string>('');
  public shape: InputSignal<SUI_SHAPE> = input<SUI_SHAPE>('rounded');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public state: InputSignal<SUI_STATE> = input<SUI_STATE>('default');
  public type: InputSignal<SUI_BUTTON_TYPE> = input<SUI_BUTTON_TYPE>('button');
  public variant: InputSignal<SUI_BUTTON_VARIANT> = input<SUI_BUTTON_VARIANT>('primary');

  public trigger: OutputEmitterRef<void> = output<void>();

  protected readonly showIconStart: Signal<boolean> = computed(() => this.icon() !== '' && !this.iconEnd());
  protected readonly showIconEnd: Signal<boolean> = computed(() => this.icon() !== '' && this.iconEnd());
  protected readonly computedIconSize: Signal<number> = computed(() => {
    switch (this.size()) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  });
  protected readonly classes: Signal<string> = computed(
    () =>
      `sui-button sui-button-${this.variant()} sui-button-${this.size()} ${this.state() !== 'default' ? 'sui-button-' + this.state() : ''} sui-button-${this.shape()} ${this.fullWidth() ? 'sui-button-full-width' : ''} ${this.selected() ? 'sui-button-selected' : ''}`,
  );
}
