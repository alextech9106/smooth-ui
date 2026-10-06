import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextareaComponent } from './sui-textarea.component';

describe('SuiTextareaComponent', () => {
  let component: SuiTextareaComponent<string>;
  let fixture: ComponentFixture<SuiTextareaComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent<SuiTextareaComponent<string>>(SuiTextareaComponent);
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

    const control: HTMLElement = fixture.nativeElement.querySelector('textarea');
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

    const control: HTMLElement = fixture.nativeElement.querySelector('textarea');
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
    expect(fixture.nativeElement.querySelector('textarea').hasAttribute('aria-invalid')).toBe(false);
  });
});
