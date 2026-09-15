import { NgClass } from '@angular/common';
import { booleanAttribute, Component, computed, input, InputSignal, InputSignalWithTransform, output, OutputEmitterRef, Signal } from '@angular/core';
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
  public iconSize: InputSignal<number> = input<number>(20);
  public icon: InputSignal<string> = input<string>('');
  public shape: InputSignal<SUI_SHAPE> = input<SUI_SHAPE>('rounded');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public state: InputSignal<SUI_STATE> = input<SUI_STATE>('default');
  public type: InputSignal<SUI_BUTTON_TYPE> = input<SUI_BUTTON_TYPE>('button');
  public variant: InputSignal<SUI_BUTTON_VARIANT> = input<SUI_BUTTON_VARIANT>('primary');

  public disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public fullWidth: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public iconEnd: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public loading: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public selected: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });

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
    () => `
      sui-button
      sui-button-${this.shape()} ${this.fullWidth() ? 'sui-button-full-width' : ''}
      sui-button-${this.size()}
      sui-button-${this.variant()}
      ${this.disabled() ? 'sui-button-disabled' : ''}
      ${this.state() !== 'default' ? 'sui-button-' + this.state() : ''}
      ${this.selected() ? 'sui-button-selected' : ''}
    `,
  );
}
