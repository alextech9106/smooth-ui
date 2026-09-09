import { NgClass } from '@angular/common';
import { Component, computed, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { SUI_BUTTON_SHAPE } from '../../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../../types/sui-button-size.type';
import { SUI_BUTTON_STATE } from '../../types/sui-button-state.type';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
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
  public shape: InputSignal<SUI_BUTTON_SHAPE> = input<SUI_BUTTON_SHAPE>('rounded');
  public size: InputSignal<SUI_BUTTON_SIZE> = input<SUI_BUTTON_SIZE>('md');
  public state: InputSignal<SUI_BUTTON_STATE> = input<SUI_BUTTON_STATE>('default');
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
