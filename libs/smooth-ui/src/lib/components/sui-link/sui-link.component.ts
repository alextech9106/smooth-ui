import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SUI_BUTTON_STATE } from '../../types/sui-button-state.type';
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
  public external: InputSignal<boolean> = input(false);
  public underline: InputSignal<boolean> = input(false);
  public state: InputSignal<SUI_BUTTON_STATE> = input<SUI_BUTTON_STATE>('default');
  public variant: InputSignal<SUI_LINK_VARIANT> = input<SUI_LINK_VARIANT>('accent');

  protected readonly classes: Signal<string> = computed(
    () => `sui-link sui-link-external sui-link-${this.variant()} sui-link-${this.state()} ${this.underline() ? 'sui-link-underline' : ''}`,
  );
}
