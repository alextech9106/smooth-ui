import { booleanAttribute, Component, computed, input, InputSignal, InputSignalWithTransform, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SUI_STATE } from '../../types/sui-state.type';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_LINK_VARIANT } from './type/sui-link-variant.type';

@Component({
  selector: 'sui-link',
  imports: [RouterLink, SuiIconComponent],
  templateUrl: './sui-link.component.html',
  styleUrl: './sui-link.component.scss',
})
export class SuiLinkComponent {
  public url: InputSignal<string> = input.required();
  public title: InputSignal<string> = input.required();
  public state: InputSignal<SUI_STATE> = input<SUI_STATE>('default');
  public variant: InputSignal<SUI_LINK_VARIANT> = input<SUI_LINK_VARIANT>('accent');

  public disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public external: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public underline: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });

  protected readonly classes: Signal<string> = computed(
    () => `
      sui-link
      sui-link-${this.variant()}
      sui-link-${this.state()}
      ${this.disabled() ? 'sui-link-disabled' : ''}
      ${this.external() ? 'sui-link-external' : ''}
      ${this.underline() ? 'sui-link-underline' : ''}
    `,
  );
}
