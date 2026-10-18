import {
  MenuItem,
  SuiButton,
  SuiButtonComponent,
  SuiButtonGroupComponent,
  SuiButtonSplitComponent,
  SuiIconButtonComponent,
  SuiIconComponent,
  SuiLinkComponent,
  SuiTextareaComponent,
  SuiTextFieldComponent,
  SuiThemeToggleComponent,
  SUI_BUTTON_VARIANT,
  SUI_ICON_BUTTON_VARIANT,
  SUI_ICON_NAME,
  SUI_SIZE,
  SUI_STATE,
} from '@alextech9106/smooth-ui';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { disabled, form, FormField, max, maxLength, min, minLength, pattern, readonly, required } from '@angular/forms/signals';

interface DemoButtonState {
  id: string;
  text: string;
  selected: boolean;
  loading: boolean;
  disabled: boolean;
  state: SUI_STATE;
}

interface DemoIconButtonState {
  id: string;
  action: string;
  icon: SUI_ICON_NAME;
  selected: boolean;
  disabled: boolean;
  state: SUI_STATE;
  badge: number;
}

interface DemoIconButton extends DemoIconButtonState {
  label: string;
}

interface DemoIconButtonRow {
  id: string;
  size: SUI_SIZE;
  buttons: DemoIconButton[];
}

interface DemoIconButtonVariantGroup {
  variant: SUI_ICON_BUTTON_VARIANT;
  rows: DemoIconButtonRow[];
}

interface TextFieldsModel {
  text: string;
  email: string;
  password: string;
  search: string;
  tel: string;
  url: string;
  number: number | null;
  textarea: string;
  filledTextarea: string;
  underlineTextarea: string;
  disabledTextarea: string;
  readonlyTextarea: string;
}

function buildIconButtonMatrix(
  variants: readonly SUI_ICON_BUTTON_VARIANT[],
  sizes: readonly SUI_SIZE[],
  states: readonly DemoIconButtonState[],
): DemoIconButtonVariantGroup[] {
  return variants.map((variant: SUI_ICON_BUTTON_VARIANT): DemoIconButtonVariantGroup => ({
    variant,
    rows: sizes.map((size: SUI_SIZE): DemoIconButtonRow => ({
      id: `${variant}-${size}`,
      size,
      buttons: states.map((state: DemoIconButtonState): DemoIconButton => ({
        ...state,
        id: `${variant}-${size}-${state.id}`,
        label: `${state.action} (${variant}, ${size})`,
      })),
    })),
  }));
}

@Component({
  selector: 'app-root',
  imports: [
    SuiButtonComponent,
    SuiIconComponent,
    SuiIconButtonComponent,
    SuiButtonGroupComponent,
    SuiButtonSplitComponent,
    SuiLinkComponent,
    SuiThemeToggleComponent,
    SuiTextFieldComponent,
    ReactiveFormsModule,
    FormField,
    SuiTextareaComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  private _emptyMenuItemsTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

  public icons: SUI_ICON_NAME[] = [
    'check',
    'x',
    'chevron-down',
    'chevron-up',
    'chevron-right',
    'chevron-left',
    'arrow-right',
    'arrow-left',
    'arrow-up',
    'arrow-down',
    'plus',
    'minus',
    'plus-circle',
    'minus-circle',
    'search',
    'info',
    'alert-triangle',
    'alert-circle',
    'check-circle',
    'x-circle',
    'star',
    'heart',
    'thumbs-up',
    'thumbs-down',
    'user',
    'settings',
    'bell',
    'calendar',
    'mail',
    'message-circle',
    'phone',
    'lock',
    'shield',
    'key',
    'eye',
    'eye-off',
    'trash',
    'edit',
    'save',
    'download',
    'upload',
    'undo',
    'redo',
    'refresh',
    'loader',
    'more-horizontal',
    'more-vertical',
    'filter',
    'external-link',
    'link',
    'share',
    'copy',
    'sun',
    'moon',
    'menu',
    'list',
    'home',
    'image',
    'camera',
    'play',
    'pause',
    'file',
    'folder',
    'bookmark',
    'tag',
    'credit-card',
    'shopping-cart',
    'gift',
    'map-pin',
    'globe',
    'grid',
    'circle',
    'square',
    'maximize',
    'minimize',
    'clock',
    'help',
    'log-out',
    'log-in',
  ];

  public buttonsGroup: SuiButton[] = [
    { name: 'Button 1', icon: 'check', selected: true },
    { name: 'Button 2', icon: 'x', selected: false },
    { name: 'Button 3', icon: 'star' },
  ];

  public singleButtonGroup: SuiButton[] = [{ name: 'Single action', icon: 'star' }];

  public menuItems: MenuItem[] = [
    { id: 'item-1', title: 'Item 1', icon: { name: 'check', size: 16 } },
    { id: 'item-2', title: 'Item 2', icon: { name: 'x', size: 16 }, separatorAfter: true },
    { id: 'item-3', title: 'Item 3', icon: { name: 'star', size: 16 } },
  ];

  protected readonly emptiableMenuItems: WritableSignal<MenuItem[]> = signal<MenuItem[]>([...this.menuItems]);

  protected readonly buttonVariants: SUI_BUTTON_VARIANT[] = ['primary', 'secondary', 'tonal', 'outline', 'ghost', 'danger'];

  protected readonly buttonSizes: SUI_SIZE[] = ['sm', 'md', 'lg'];

  protected readonly buttonStates: DemoButtonState[] = [
    { id: 'default', text: 'Default', selected: false, loading: false, disabled: false, state: 'default' },
    { id: 'selected', text: 'Selected', selected: true, loading: false, disabled: false, state: 'default' },
    { id: 'loading', text: 'Loading', selected: false, loading: true, disabled: false, state: 'default' },
    { id: 'disabled', text: 'Disabled', selected: false, loading: false, disabled: true, state: 'default' },
    { id: 'focus', text: 'Focus', selected: false, loading: false, disabled: false, state: 'focus' },
    { id: 'selected-loading', text: 'Selected loading', selected: true, loading: true, disabled: false, state: 'default' },
    { id: 'focus-loading', text: 'Focus loading', selected: false, loading: true, disabled: false, state: 'focus' },
    { id: 'disabled-loading', text: 'Disabled loading', selected: false, loading: true, disabled: true, state: 'default' },
  ];

  protected readonly iconButtonVariants: SUI_ICON_BUTTON_VARIANT[] = ['ghost', 'outline', 'primary'];

  protected readonly iconButtonStates: DemoIconButtonState[] = [
    { id: 'selected', action: 'Add to favourites', icon: 'star', selected: true, disabled: false, state: 'default', badge: 0 },
    { id: 'disabled', action: 'Delete', icon: 'trash', selected: false, disabled: true, state: 'default', badge: 0 },
    { id: 'focus', action: 'Open settings', icon: 'settings', selected: false, disabled: false, state: 'focus', badge: 0 },
    { id: 'badge', action: 'Show notifications', icon: 'bell', selected: false, disabled: false, state: 'default', badge: 3 },
  ];

  protected readonly iconButtonMatrix: DemoIconButtonVariantGroup[] = buildIconButtonMatrix(
    this.iconButtonVariants,
    this.buttonSizes,
    this.iconButtonStates,
  );

  protected readonly formGroup: UntypedFormGroup = new UntypedFormGroup({
    text: new UntypedFormControl({ value: null, disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    email: new UntypedFormControl({ value: null, disabled: false }, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,4}$/),
    ]),
    password: new UntypedFormControl({ value: null, disabled: false }, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])/),
    ]),
    search: new UntypedFormControl({ value: null, disabled: true }, [Validators.max(100)]),
    tel: new UntypedFormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,15}$/)]),
    url: new UntypedFormControl({ value: null, disabled: false }, [Validators.required, Validators.pattern(/^https?:\/\/.+\..+/)]),
    number: new UntypedFormControl({ value: 35, disabled: false }, [Validators.required, Validators.min(0), Validators.max(999)]),

    textarea: new UntypedFormControl({ value: null, disabled: false }, [Validators.required]),
    filledTextarea: new UntypedFormControl({ value: null, disabled: false }, [Validators.required]),
    underlineTextarea: new UntypedFormControl({ value: null, disabled: false }, [Validators.required]),
    disabledTextarea: new UntypedFormControl({ value: null, disabled: true }),
    readonlyTextarea: new UntypedFormControl({ value: 'Readonly textarea', disabled: false }, [Validators.required]),
  });

  protected readonly formGroupErrors = {
    text: [
      { type: 'required', message: 'Required field' },
      { type: 'minlength', message: 'Minimum 2 characters' },
      { type: 'maxlength', message: 'Maximum 10 characters' },
    ],
    email: [
      { type: 'required', message: 'Email address is required' },
      { type: 'pattern', message: 'Please enter a valid email address' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Minimum 8 characters' },
      { type: 'pattern', message: 'Must include uppercase letters, lowercase letters, a number and a special character' },
    ],
    search: [{ type: 'maxlength', message: 'Maximum 100 characters' }],
    tel: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' },
    ],
    url: [
      { type: 'required', message: 'URL is required' },
      { type: 'pattern', message: 'Please enter a valid URL (https://… or http://…)' },
    ],
    number: [
      { type: 'required', message: 'Required field' },
      { type: 'min', message: 'Must be ≥ 0' },
      { type: 'max', message: 'Must be ≤ 999' },
    ],
    textarea: [{ type: 'required', message: 'Textarea is required' }],
    filledTextarea: [{ type: 'required', message: 'Filled textarea is required' }],
    underlineTextarea: [{ type: 'required', message: 'Underline textarea is required' }],
    readonlyTextarea: [{ type: 'required', message: 'Readonly textarea is required' }],
  };

  protected readonly signalFormModel: WritableSignal<TextFieldsModel> = signal<TextFieldsModel>({
    text: '',
    email: '',
    password: '',
    search: '',
    tel: '',
    url: '',
    number: 35,
    textarea: '',
    filledTextarea: '',
    underlineTextarea: '',
    disabledTextarea: '',
    readonlyTextarea: 'Readonly textarea',
  });

  protected readonly textFieldsForm = form(this.signalFormModel, (schemaPath) => {
    required(schemaPath.text, { message: 'Required field' });
    minLength(schemaPath.text, 2, { message: 'Minimum 2 characters' });
    maxLength(schemaPath.text, 10, { message: 'Maximum 10 characters' });

    required(schemaPath.email, { message: 'Email address is required' });
    pattern(schemaPath.email, /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,4}$/, {
      message: 'Please enter a valid email address',
    });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, { message: 'Minimum 8 characters' });
    pattern(schemaPath.password, /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`])/, {
      message: 'Must include uppercase letters, lowercase letters, a number and a special character',
    });

    maxLength(schemaPath.search, 100, { message: 'Maximum 100 characters' });
    disabled(schemaPath.search);

    required(schemaPath.tel, { message: 'Phone number is required' });
    pattern(schemaPath.tel, /^\+?[0-9\s-]{7,15}$/, { message: 'Please enter a valid phone number' });

    required(schemaPath.url, { message: 'URL is required' });
    pattern(schemaPath.url, /^https?:\/\/.+\..+/, { message: 'Please enter a valid URL (https://… or http://…)' });

    required(schemaPath.number, { message: 'Required field' });
    min(schemaPath.number, 0, { message: 'Must be ≥ 0' });
    max(schemaPath.number, 999, { message: 'Must be ≤ 999' });
    readonly(schemaPath.number);

    required(schemaPath.textarea, { message: 'Textarea is required' });

    required(schemaPath.filledTextarea, { message: 'Filled textarea is required' });

    required(schemaPath.underlineTextarea, { message: 'Underline textarea is required' });

    disabled(schemaPath.disabledTextarea);

    readonly(schemaPath.readonlyTextarea);
  });

  constructor() {
    this._destroyRef.onDestroy((): void => this._cancelEmptyMenuItems());
  }

  private _cancelEmptyMenuItems(): void {
    if (this._emptyMenuItemsTimeoutId === undefined) return;
    clearTimeout(this._emptyMenuItemsTimeoutId);
    this._emptyMenuItemsTimeoutId = undefined;
  }

  protected scheduleEmptyMenuItems(): void {
    this._cancelEmptyMenuItems();
    this._emptyMenuItemsTimeoutId = setTimeout((): void => {
      this._emptyMenuItemsTimeoutId = undefined;
      this.emptiableMenuItems.set([]);
    }, 3000);
  }

  protected restoreMenuItems(): void {
    this._cancelEmptyMenuItems();
    this.emptiableMenuItems.set([...this.menuItems]);
  }

  protected onSubmitFormGroup(): void {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
  }

  protected onSubmitSignalForm(event?: SubmitEvent): void {
    event?.preventDefault();
    if (this.textFieldsForm().invalid()) {
      this.textFieldsForm().markAsTouched();
      return;
    }
  }
}
