import {
  booleanAttribute,
  Component,
  computed,
  input,
  InputSignal,
  InputSignalWithTransform,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormValueControl, ParseResult, transformedValue, TransformedValueSignal, ValidationError } from '@angular/forms/signals';
import { CustomError } from '../../interfaces/custom-error.interface';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SUI_STATE } from '../../types/sui-state.type';
import { SuiErrorComponent } from '../sui-error/sui-error.component';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_TEXT_FIELD_TYPE } from './type/sui-text-field-type.type';
import { SUI_TEXT_FIELD_VARIANT } from './type/sui-text-field-variant.type';

@Component({
  selector: 'sui-text-field',
  imports: [SuiIconComponent, SuiErrorComponent],
  templateUrl: './sui-text-field.component.html',
  styleUrl: './sui-text-field.component.scss',
})
export class SuiTextFieldComponent<TValue extends string | number | null = string> implements FormValueControl<TValue> {
  private static _nextId: number = 0;

  public inputId: WritableSignal<string> = signal<string>(`sui-text-field-${SuiTextFieldComponent._nextId++}`);
  public isPasswordHide: WritableSignal<boolean> = signal<boolean>(true);

  public value: ModelSignal<TValue> = model<TValue>('' as TValue);

  public label: InputSignal<string> = input.required<string>();
  public hint: InputSignal<string> = input<string>('');
  public iconEnd: InputSignal<string> = input<string>('');
  public iconStart: InputSignal<string> = input<string>('');
  public optionalText: InputSignal<string> = input<string>('(optional)');
  public placeholder: InputSignal<string> = input<string>('');
  public prefix: InputSignal<string> = input<string>('');
  public suffix: InputSignal<string> = input<string>('');
  public customErrors: InputSignal<CustomError[]> = input<CustomError[]>([]);
  public state: InputSignal<SUI_STATE> = input<SUI_STATE>('default');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public type: InputSignal<SUI_TEXT_FIELD_TYPE> = input<SUI_TEXT_FIELD_TYPE>('text');
  public variant: InputSignal<SUI_TEXT_FIELD_VARIANT> = input<SUI_TEXT_FIELD_VARIANT>('outlined');

  public disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public required: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public touched: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public errors: InputSignal<readonly ValidationError.WithOptionalFieldTree[]> = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly touch: OutputEmitterRef<void> = output<void>();

  protected readonly rawValue: TransformedValueSignal<string> = transformedValue(this.value, {
    parse: (raw: string): ParseResult<TValue> => {
      if (this.type() !== 'number') return { value: raw as TValue };
      if (raw === '') return { value: null as TValue };

      const parsed: number = Number(raw);

      return Number.isNaN(parsed) ? { error: { kind: 'parse', message: `"${raw}" is not a valid number` } } : { value: parsed as TValue };
    },
    format: (value: TValue): string => (value == null ? '' : String(value)),
  });
  protected readonly classes: Signal<string> = computed(
    () =>
      `
        sui-input-affix-${this.size()}
        sui-input-${this.size()}
        ${this.disabled() ? 'sui-input-disabled' : ''}
        ${this.readonly() ? 'sui-input-readonly' : ''}
        ${this.state() !== 'default' ? 'sui-input-' + this.state() : ''}
        ${this.touched() && this.errors().length ? 'sui-input-error' : ''}
        ${this.variant() !== 'outlined' ? 'sui-input-' + this.variant() : ''}
      `,
  );
  protected readonly showError: Signal<boolean> = computed(() => this.touched() && this.errors().length > 0);
  protected readonly showCustomError: Signal<boolean> = computed(() => this.touched() && this.errors().length > 0 && this.customErrors().length > 0);

  public showPassword() {
    this.isPasswordHide.set(!this.isPasswordHide());
  }

  public clearSearch() {
    this.rawValue.set('');
  }

  public getCustomMessage(errorType: string): string {
    return this.customErrors().find((error: CustomError) => error.type === errorType)?.message ?? '';
  }
}
