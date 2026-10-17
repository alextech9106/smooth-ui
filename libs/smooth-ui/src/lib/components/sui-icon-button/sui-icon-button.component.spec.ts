import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiIconButtonComponent } from './sui-icon-button.component';

@Component({
  imports: [SuiIconButtonComponent],
  template: `
    <form (submit)="onSubmit($event)">
      <label for="host-field">Field</label>
      <input id="host-field" value="initial" />
      <sui-icon-button icon="check" label="Confirm" (trigger)="triggers.update((count) => count + 1)" />
    </form>
  `,
})
class HostFormComponent {
  public readonly triggers: WritableSignal<number> = signal<number>(0);
  public readonly submits: WritableSignal<number> = signal<number>(0);

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.submits.update((count: number) => count + 1);
  }
}

describe('SuiIconButtonComponent', () => {
  let component: SuiIconButtonComponent;
  let fixture: ComponentFixture<SuiIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiIconButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiIconButtonComponent);
    fixture.componentRef.setInput('icon', 'check');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the label as accessible name', async () => {
    fixture.componentRef.setInput('label', 'Toggle theme');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Toggle theme');
  });

  it('never uses the icon name as accessible name', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.hasAttribute('aria-label')).toBe(false);

    fixture.componentRef.setInput('label', '   ');
    await fixture.whenStable();
    expect(button.hasAttribute('aria-label')).toBe(false);

    fixture.componentRef.setInput('label', ' Close ');
    await fixture.whenStable();
    expect(button.getAttribute('aria-label')).toBe(' Close ');

    const svg: SVGElement = button.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(button.textContent?.trim()).toBe('');
  });

  it('has no iconSize input: the icon size follows size only', () => {
    expect(() => fixture.componentRef.setInput('iconSize', 32)).toThrow(/NG0303/);
  });

  it('fails when created without an icon', () => {
    const iconless: ComponentFixture<SuiIconButtonComponent> = TestBed.createComponent(SuiIconButtonComponent);

    expect(() => iconless.detectChanges()).toThrow(/NG0950/);
  });

  it('renders the svg for an empty icon name', async () => {
    fixture.componentRef.setInput('icon', '');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button svg')).not.toBeNull();
  });

  it('emits one trigger with no data per click', () => {
    const values: unknown[] = [];
    component.trigger.subscribe((value: unknown) => values.push(value));

    fixture.nativeElement.querySelector('button').click();

    expect(values).toEqual([undefined]);
  });

  it('emits nothing on dispatched Enter or Space key events alone', () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    for (const key of ['Enter', ' ']) {
      button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      button.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
    }

    expect(emitted).toBe(0);
  });

  it('renders a native button of type button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.type).toBe('button');
  });

  describe('inside a form', () => {
    let host: ComponentFixture<HostFormComponent>;

    beforeEach(async () => {
      host = TestBed.createComponent(HostFormComponent);
      await host.whenStable();
    });

    it('neither submits nor resets the form when clicked', () => {
      let submitEvents: number = 0;
      const form: HTMLFormElement = host.nativeElement.querySelector('form');
      form.addEventListener('submit', () => submitEvents++);
      const field: HTMLInputElement = host.nativeElement.querySelector('input');
      field.value = 'changed';

      host.nativeElement.querySelector('button').click();

      expect(submitEvents).toBe(0);
      expect(host.componentInstance.submits()).toBe(0);
      expect(field.value).toBe('changed');
      expect(host.componentInstance.triggers()).toBe(1);
    });
  });

  it('disables the native button and stops emitting trigger', async () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(button.disabled).toBe(true);
    expect(emitted).toBe(0);
    expect(button.classList).toContain('sui-icon-button-disabled');

    button.focus();
    expect(document.activeElement).not.toBe(button);
  });

  it('keeps both the disabled and the selected classes together', async () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.componentRef.setInput('selected', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain('sui-icon-button-disabled');
    expect(button.classList).toContain('sui-icon-button-selected');
  });

  it('defaults to the ghost variant, md size and rounded shape', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.classList).toContain('sui-icon-button-ghost');
    expect(button.classList).toContain('sui-icon-button-md');
    expect(button.classList).toContain('sui-icon-button-rounded');
    expect(button.classList).not.toContain('sui-icon-button-disabled');
    expect(button.classList).not.toContain('sui-icon-button-selected');
  });

  it.each(['outline', 'primary'] as const)('applies the %s variant class', async (variant: 'outline' | 'primary') => {
    fixture.componentRef.setInput('variant', variant);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain(`sui-icon-button-${variant}`);
    expect(button.classList).not.toContain('sui-icon-button-ghost');
  });

  it.each(['sm', 'lg'] as const)('applies the %s size class', async (size: 'sm' | 'lg') => {
    fixture.componentRef.setInput('size', size);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain(`sui-icon-button-${size}`);
    expect(button.classList).not.toContain('sui-icon-button-md');
  });

  it.each(['flat', 'pill'] as const)('applies the %s shape class', async (shape: 'flat' | 'pill') => {
    fixture.componentRef.setInput('shape', shape);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain(`sui-icon-button-${shape}`);
    expect(button.classList).not.toContain('sui-icon-button-rounded');
  });

  it.each([
    ['sm', '16'],
    ['md', '20'],
    ['lg', '24'],
  ] as const)('sizes the icon for %s to %s px', async (size: 'sm' | 'md' | 'lg', width: string) => {
    fixture.componentRef.setInput('size', size);
    await fixture.whenStable();

    const svg: SVGElement = fixture.nativeElement.querySelector('button svg');
    expect(svg.getAttribute('width')).toBe(width);
    expect(svg.getAttribute('height')).toBe(width);
  });

  it('marks selected with a class and no aria-pressed', async () => {
    fixture.componentRef.setInput('selected', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain('sui-icon-button-selected');
    expect(button.hasAttribute('aria-pressed')).toBe(false);
  });

  it('applies the focus state class, also while disabled', async () => {
    fixture.componentRef.setInput('state', 'focus');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList).toContain('sui-icon-button-focus');

    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(button.classList).toContain('sui-icon-button-focus');
    expect(button.classList).toContain('sui-icon-button-disabled');
  });

  it.each([
    [5, '5'],
    [-1, '-1'],
    [1.5, '1.5'],
  ] as const)('shows badge %s as given', async (badge: number, text: string) => {
    fixture.componentRef.setInput('badge', badge);
    await fixture.whenStable();

    const mark: HTMLElement | null = fixture.nativeElement.querySelector('.badge');
    expect(mark?.textContent?.trim()).toBe(text);
  });

  it.each([0, NaN])('shows no badge for %s', async (badge: number) => {
    fixture.componentRef.setInput('badge', badge);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.badge')).toBeNull();
  });

  it('shows no badge when badge is not given', () => {
    expect(fixture.nativeElement.querySelector('.badge')).toBeNull();
  });

  it('keeps the badge outside the button, its name and its trigger', async () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    fixture.componentRef.setInput('badge', 3);
    fixture.componentRef.setInput('label', 'Show notifications');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    const mark: HTMLElement = fixture.nativeElement.querySelector('.badge');
    expect(mark).not.toBeNull();
    expect(button.contains(mark)).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Show notifications');

    mark.click();
    expect(emitted).toBe(0);
  });
});
