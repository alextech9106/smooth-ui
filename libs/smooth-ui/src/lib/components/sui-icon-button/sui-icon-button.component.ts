import { NgClass } from '@angular/common';
import { booleanAttribute, Component, computed, input, InputSignal, InputSignalWithTransform, output, OutputEmitterRef, Signal } from '@angular/core';
import { SUI_SHAPE } from '../../types/sui-shape.type';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SUI_STATE } from '../../types/sui-state.type';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_ICON_BUTTON_VARIANT } from './type/sui-icon-button-variant.type';

@Component({
  imports: [SuiIconComponent, NgClass],
  selector: 'sui-icon-button',
  styleUrl: './sui-icon-button.component.scss',
  templateUrl: './sui-icon-button.component.html',
})
export class SuiIconButtonComponent {
  public icon: InputSignal<string> = input.required<string>();
  public badge: InputSignal<number> = input<number>(0);
  public iconSize: InputSignal<number> = input<number>(20);
  public shape: InputSignal<SUI_SHAPE> = input<SUI_SHAPE>('rounded');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public state: InputSignal<SUI_STATE> = input<SUI_STATE>('default');
  public variant: InputSignal<SUI_ICON_BUTTON_VARIANT> = input<SUI_ICON_BUTTON_VARIANT>('ghost');

  public disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public selected: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });

  public trigger: OutputEmitterRef<void> = output<void>();

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
      `sui-icon-button
      sui-icon-button-${this.variant()}
      sui-icon-button-${this.size()}
      sui-icon-button-${this.state()}
      sui-icon-button-${this.shape()}
      ${this.disabled() ? 'sui-icon-button-disabled' : ''},
      ${this.selected() ? 'sui-icon-button-selected' : ''}
    `,
  );
}
