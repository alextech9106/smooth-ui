import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'sui-error',
  imports: [],
  templateUrl: './sui-error.component.html',
  styleUrl: './sui-error.component.scss',
})
export class SuiErrorComponent {
  public error: InputSignal<string | undefined> = input<string | undefined>('');
  public inputId: InputSignal<string> = input<string>('');
}
