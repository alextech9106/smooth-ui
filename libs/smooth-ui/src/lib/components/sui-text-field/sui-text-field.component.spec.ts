import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextFieldComponent } from './sui-text-field.component';

describe('SuiTextFieldComponent', () => {
  let component: SuiTextFieldComponent<string | number | null>;
  let fixture: ComponentFixture<SuiTextFieldComponent<string | number | null>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiTextFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Label');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('describes the control with its hint while there are no errors', async () => {
    fixture.componentRef.setInput('hint', 'Shown on your profile');
    await fixture.whenStable();

    const control: HTMLElement = fixture.nativeElement.querySelector('input');
    const hint: HTMLElement = fixture.nativeElement.querySelector('.sui-hint');
    expect(control.getAttribute('aria-describedby')).toBe(hint.id);
    expect(control.hasAttribute('aria-invalid')).toBe(false);
  });

  it('marks the control invalid and points it to the announced errors once touched', async () => {
    fixture.componentRef.setInput('errors', [
      { kind: 'required', message: 'Required field' },
      { kind: 'minLength', message: 'Minimum 2 characters' },
    ]);
    fixture.componentRef.setInput('touched', true);
    await fixture.whenStable();

    const control: HTMLElement = fixture.nativeElement.querySelector('input');
    const messages: HTMLElement = fixture.nativeElement.querySelector('[aria-live="polite"]');
    expect(control.getAttribute('aria-invalid')).toBe('true');
    expect(control.getAttribute('aria-describedby')).toBe(messages.id);
    expect(Array.from(messages.querySelectorAll('.sui-error')).map((error) => error.textContent)).toEqual(['Required field', 'Minimum 2 characters']);
    expect(fixture.nativeElement.querySelectorAll('[id]').length).toBe(
      new Set(Array.from(fixture.nativeElement.querySelectorAll('[id]')).map((el) => (el as HTMLElement).id)).size,
    );
  });

  it('falls back to the validation message when no custom error covers the kind', async () => {
    fixture.componentRef.setInput('customErrors', [{ type: 'required', message: 'Custom required' }]);
    fixture.componentRef.setInput('errors', [
      { kind: 'required', message: 'Required field' },
      { kind: 'minLength', message: 'Minimum 2 characters' },
    ]);
    fixture.componentRef.setInput('touched', true);
    await fixture.whenStable();

    const messages: (string | null)[] = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.sui-error')).map(
      (error) => error.textContent,
    );
    expect(messages).toEqual(['Custom required', 'Minimum 2 characters']);
  });

  it('keeps errors hidden until the control is touched', async () => {
    fixture.componentRef.setInput('errors', [{ kind: 'required', message: 'Required field' }]);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sui-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('input').hasAttribute('aria-invalid')).toBe(false);
  });

  it('toggles password visibility from a named button', async () => {
    fixture.componentRef.setInput('type', 'password');
    await fixture.whenStable();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(input.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Show password');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    toggle.click();
    await fixture.whenStable();

    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Hide password');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it('clears the search value from a named button', async () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.componentRef.setInput('value', 'angular');
    await fixture.whenStable();

    const clear: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(clear.getAttribute('aria-label')).toBe('Clear search');

    clear.click();
    await fixture.whenStable();

    expect(component.value()).toBe('');
  });

  it('disables the action button when the field is disabled', async () => {
    fixture.componentRef.setInput('type', 'search');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const clear: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(clear.disabled).toBe(true);
  });
});
