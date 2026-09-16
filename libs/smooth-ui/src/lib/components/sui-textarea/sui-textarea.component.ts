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
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { CustomError } from '../../interfaces/custom-error.interface';
import { SUI_INPUT_VARIANT } from '../../types/sui-input-variant.type';
import { SuiErrorComponent } from '../sui-error/sui-error.component';

@Component({
  selector: 'sui-textarea',
  imports: [SuiErrorComponent],
  templateUrl: './sui-textarea.component.html',
  styleUrl: './sui-textarea.component.scss',
})
export class SuiTextareaComponent<TValue> implements FormValueControl<TValue> {
  private static _nextId: number = 0;

  public inputId: WritableSignal<string> = signal<string>(`sui-textarea-${SuiTextareaComponent._nextId++}`);

  public value: ModelSignal<TValue> = model<TValue>('' as TValue);

  public label: InputSignal<string> = input.required<string>();
  public hint: InputSignal<string> = input<string>('');
  public optionalText: InputSignal<string> = input<string>('(optional)');
  public placeholder: InputSignal<string> = input<string>('');
  public customErrors: InputSignal<CustomError[]> = input<CustomError[]>([]);
  public variant: InputSignal<SUI_INPUT_VARIANT> = input<SUI_INPUT_VARIANT>('outlined');

  public disabled: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public readonly: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public required: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public touched: InputSignalWithTransform<boolean, unknown> = input<boolean, unknown>(false, { transform: booleanAttribute });
  public errors: InputSignal<readonly ValidationError.WithOptionalFieldTree[]> = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly touch: OutputEmitterRef<void> = output<void>();

  protected readonly classes: Signal<string> = computed(
    () =>
      `
        ${this.disabled() ? 'sui-textarea-disabled' : ''}
        ${this.readonly() ? 'sui-textarea-readonly' : ''}
        ${this.touched() && this.errors().length ? 'sui-textarea-error' : ''}
        ${this.variant() !== 'outlined' ? 'sui-textarea-' + this.variant() : ''}
      `,
  );
  protected readonly showError: Signal<boolean> = computed(() => this.touched() && this.errors().length > 0);
  protected readonly showCustomError: Signal<boolean> = computed(() => this.touched() && this.errors().length > 0 && this.customErrors().length > 0);

  public getCustomMessage(errorType: string): string {
    return this.customErrors().find((error: CustomError) => error.type === errorType)?.message ?? '';
  }
}
