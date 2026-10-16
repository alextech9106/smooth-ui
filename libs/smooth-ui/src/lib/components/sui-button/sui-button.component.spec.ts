import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SUI_SHAPE } from '../../types/sui-shape.type';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SuiButtonComponent } from './sui-button.component';
import { SUI_BUTTON_TYPE } from './type/sui-button-type.type';
import { SUI_BUTTON_VARIANT } from './type/sui-button-variant.type';

@Component({
  imports: [SuiButtonComponent],
  template: `
    <form (submit)="onSubmit($event)">
      <label for="host-field">Field</label>
      <input id="host-field" value="initial" />
      <sui-button name="Go" [type]="type()" (trigger)="triggers.update((count) => count + 1)" />
    </form>
  `,
})
class HostFormComponent {
  public readonly type: WritableSignal<SUI_BUTTON_TYPE> = signal<SUI_BUTTON_TYPE>('button');
  public readonly triggers: WritableSignal<number> = signal<number>(0);
  public readonly submits: WritableSignal<number> = signal<number>(0);
  public readonly defaultPrevented: WritableSignal<boolean> = signal<boolean>(false);

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.defaultPrevented.set(event.defaultPrevented);
    this.submits.update((count: number) => count + 1);
  }
}

describe('SuiButtonComponent', () => {
  let component: SuiButtonComponent;
  let fixture: ComponentFixture<SuiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonComponent);
    fixture.componentRef.setInput('name', 'Test');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits trigger when clicked', () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(1);
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
  });

  it('keeps its accessible name and blocks clicks while loading', async () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(button.getAttribute('aria-label')).toBe('Test');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(emitted).toBe(0);
  });

  it('prefers the label as accessible name and exposes the expanded state', async () => {
    fixture.componentRef.setInput('label', 'More options');
    fixture.componentRef.setInput('expanded', false);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('More options');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('never uses the icon as accessible name', async () => {
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('icon', 'check');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('');
  });

  it('uses the label as written, untrimmed', async () => {
    fixture.componentRef.setInput('label', ' Save draft ');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe(' Save draft ');
  });

  it('falls back to the name when the label is whitespace-only', async () => {
    fixture.componentRef.setInput('name', 'Save');
    fixture.componentRef.setInput('label', '  ');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Save');
  });

  it('does not fall back to the icon when the label is whitespace-only and there is no name', async () => {
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('icon', 'check');
    fixture.componentRef.setInput('label', '  ');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('');
  });

  it('names an icon button without visible text by its label', async () => {
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('icon', 'check');
    fixture.componentRef.setInput('label', 'Save');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Save');
  });

  it('renders a label that differs from the name without error', async () => {
    fixture.componentRef.setInput('name', 'Save');
    fixture.componentRef.setInput('label', 'Store');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Store');
    expect(button.textContent?.trim()).toBe('Save');
  });

  it('reports a failure when created without a name', () => {
    const unnamed: ComponentFixture<SuiButtonComponent> = TestBed.createComponent(SuiButtonComponent);

    expect(() => unnamed.detectChanges()).toThrow(/NG0950/);
  });

  it('emits one trigger with no data per click', () => {
    const values: unknown[] = [];
    component.trigger.subscribe((value: unknown) => values.push(value));

    fixture.nativeElement.querySelector('button').click();

    expect(values).toEqual([undefined]);
  });

  it('emits nothing on Enter or Space key events alone', () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    for (const key of ['Enter', ' ']) {
      button.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      button.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
    }

    expect(emitted).toBe(0);
  });

  it('announces neither a menu nor an expanded state when expanded is unset', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.hasAttribute('aria-expanded')).toBe(false);
    expect(button.hasAttribute('aria-haspopup')).toBe(false);
  });

  it('announces a menu that is expanded when expanded is true', async () => {
    fixture.componentRef.setInput('expanded', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
  });

  describe('while disabled or loading', () => {
    const unavailableCases: { title: string; loading: boolean }[] = [
      { title: 'disabled alone', loading: false },
      { title: 'disabled with loading', loading: true },
    ];

    for (const unavailable of unavailableCases) {
      it(`is natively disabled, emits nothing, looks disabled and cannot be focused when ${unavailable.title}`, async () => {
        let emitted: number = 0;
        component.trigger.subscribe(() => emitted++);
        fixture.componentRef.setInput('disabled', true);
        fixture.componentRef.setInput('loading', unavailable.loading);
        await fixture.whenStable();

        const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        button.click();
        button.focus();

        expect(button.disabled).toBe(true);
        expect(emitted).toBe(0);
        expect(button.classList.contains('sui-button-disabled')).toBe(true);
        expect(document.activeElement).not.toBe(button);
      });
    }

    it('shows only the hidden loading indicator, with no icon or text, while loading', async () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('loading', true);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const spinner: HTMLElement | null = button.querySelector('.sui-button-spinner');
      expect(spinner?.getAttribute('aria-hidden')).toBe('true');
      expect(button.querySelector('sui-icon')).toBeNull();
      expect(button.textContent?.trim()).toBe('');
    });

    it('is natively disabled, emits nothing and is announced busy while loading', async () => {
      let emitted: number = 0;
      component.trigger.subscribe(() => emitted++);
      fixture.componentRef.setInput('loading', true);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      button.click();

      expect(button.disabled).toBe(true);
      expect(emitted).toBe(0);
      expect(button.getAttribute('aria-busy')).toBe('true');
    });

    it('keeps the label as accessible name while loading', async () => {
      fixture.componentRef.setInput('label', 'Save draft');
      fixture.componentRef.setInput('loading', true);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Save draft');
    });

    it('keeps the variant, selected and focus classes and has no disabled class while loading', async () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.componentRef.setInput('selected', true);
      fixture.componentRef.setInput('state', 'focus');
      fixture.componentRef.setInput('loading', true);
      await fixture.whenStable();

      const classList: DOMTokenList = fixture.nativeElement.querySelector('button').classList;
      expect(classList.contains('sui-button-danger')).toBe(true);
      expect(classList.contains('sui-button-selected')).toBe(true);
      expect(classList.contains('sui-button-focus')).toBe(true);
      expect(classList.contains('sui-button-disabled')).toBe(false);
    });

    it('never moves focus to another element when loading starts', async () => {
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      button.focus();
      expect(document.activeElement).toBe(button);

      fixture.componentRef.setInput('loading', true);
      await fixture.whenStable();

      expect([button, document.body]).toContain(document.activeElement);
    });
  });

  describe('looks, sizes, icons and focus state', () => {
    const queryButton: () => HTMLButtonElement = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

    it('uses the primary variant, md size and rounded shape by default', () => {
      const classList: DOMTokenList = queryButton().classList;

      expect(classList.contains('sui-button-primary')).toBe(true);
      expect(classList.contains('sui-button-md')).toBe(true);
      expect(classList.contains('sui-button-rounded')).toBe(true);
      expect(classList.contains('sui-button-full-width')).toBe(false);
      expect(classList.contains('sui-button-selected')).toBe(false);
      expect(classList.contains('sui-button-focus')).toBe(false);
    });

    const variants: SUI_BUTTON_VARIANT[] = ['primary', 'secondary', 'tonal', 'outline', 'ghost', 'danger'];

    for (const variant of variants) {
      it(`shows only the ${variant} variant class`, async () => {
        fixture.componentRef.setInput('variant', variant);
        await fixture.whenStable();

        const classList: DOMTokenList = queryButton().classList;
        for (const other of variants) {
          expect(classList.contains(`sui-button-${other}`)).toBe(other === variant);
        }
      });
    }

    it('shows the selected class without announcing a pressed state', async () => {
      fixture.componentRef.setInput('selected', true);
      await fixture.whenStable();

      const button: HTMLButtonElement = queryButton();
      expect(button.classList.contains('sui-button-selected')).toBe(true);
      expect(button.hasAttribute('aria-pressed')).toBe(false);
    });

    const sizes: SUI_SIZE[] = ['sm', 'md', 'lg'];
    const shapes: SUI_SHAPE[] = ['flat', 'rounded', 'pill'];

    for (const size of sizes) {
      for (const shape of shapes) {
        it(`shows only the ${size} size and ${shape} shape classes`, async () => {
          fixture.componentRef.setInput('size', size);
          fixture.componentRef.setInput('shape', shape);
          await fixture.whenStable();

          const classList: DOMTokenList = queryButton().classList;
          for (const other of sizes) {
            expect(classList.contains(`sui-button-${other}`)).toBe(other === size);
          }
          for (const other of shapes) {
            expect(classList.contains(`sui-button-${other}`)).toBe(other === shape);
          }
        });
      }
    }

    it('fills its container while fullWidth is set', async () => {
      fixture.componentRef.setInput('fullWidth', true);
      await fixture.whenStable();

      expect(queryButton().classList.contains('sui-button-full-width')).toBe(true);
    });

    it('shows the icon, hidden from assistive technology, before the text by default', async () => {
      fixture.componentRef.setInput('icon', 'check');
      await fixture.whenStable();

      const children: string[] = Array.from(queryButton().children).map((child: Element) => child.tagName.toLowerCase());
      expect(children).toEqual(['sui-icon', 'span']);
      expect(queryButton().querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('shows the icon after the text while iconEnd is set', async () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('iconEnd', true);
      await fixture.whenStable();

      const children: string[] = Array.from(queryButton().children).map((child: Element) => child.tagName.toLowerCase());
      expect(children).toEqual(['span', 'sui-icon']);
    });

    const iconWidths: { size: SUI_SIZE; width: string }[] = [
      { size: 'sm', width: '16' },
      { size: 'md', width: '20' },
      { size: 'lg', width: '24' },
    ];

    for (const iconWidth of iconWidths) {
      it(`draws a ${iconWidth.width} px icon at size ${iconWidth.size}`, async () => {
        fixture.componentRef.setInput('icon', 'check');
        fixture.componentRef.setInput('size', iconWidth.size);
        await fixture.whenStable();

        const svg: SVGElement | null = queryButton().querySelector('sui-icon svg');
        expect(svg?.getAttribute('width')).toBe(iconWidth.width);
        expect(svg?.getAttribute('height')).toBe(iconWidth.width);
      });
    }

    it('narrows the padding and shows no text when name is empty', async () => {
      fixture.componentRef.setInput('name', '');
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('label', 'Save');
      await fixture.whenStable();

      const button: HTMLButtonElement = queryButton();
      expect(button.classList.contains('sui-spacing-8')).toBe(true);
      expect(button.querySelector('span')).toBeNull();
      expect(button.textContent?.trim()).toBe('');
    });

    it('keeps the text span and the normal padding when name is whitespace-only', async () => {
      fixture.componentRef.setInput('name', '  ');
      fixture.componentRef.setInput('label', 'Save');
      await fixture.whenStable();

      const button: HTMLButtonElement = queryButton();
      expect(button.classList.contains('sui-spacing-8')).toBe(false);
      expect(button.querySelector('span')?.textContent).toBe('  ');
    });

    it('does not narrow the padding when name has text', () => {
      expect(queryButton().classList.contains('sui-spacing-8')).toBe(false);
    });

    it('shows the focus class while state is focus', async () => {
      fixture.componentRef.setInput('state', 'focus');
      await fixture.whenStable();

      expect(queryButton().classList.contains('sui-button-focus')).toBe(true);
    });
  });

  describe('inside a form', () => {
    let host: ComponentFixture<HostFormComponent>;

    beforeEach(async () => {
      host = TestBed.createComponent(HostFormComponent);
      await host.whenStable();
    });

    it('does not submit the form with the default type', () => {
      const button: HTMLButtonElement = host.nativeElement.querySelector('button');

      button.click();

      expect(button.type).toBe('button');
      expect(host.componentInstance.submits()).toBe(0);
      expect(host.componentInstance.triggers()).toBe(1);
    });

    it('submits the form once and emits one trigger with type submit', async () => {
      host.componentInstance.type.set('submit');
      await host.whenStable();

      host.nativeElement.querySelector('button').click();

      expect(host.componentInstance.submits()).toBe(1);
      expect(host.componentInstance.defaultPrevented()).toBe(true);
      expect(host.componentInstance.triggers()).toBe(1);
    });

    it('resets the form and emits one trigger with type reset', async () => {
      host.componentInstance.type.set('reset');
      await host.whenStable();
      const field: HTMLInputElement = host.nativeElement.querySelector('input');
      field.value = 'changed';

      host.nativeElement.querySelector('button').click();

      expect(field.value).toBe('initial');
      expect(host.componentInstance.triggers()).toBe(1);
    });
  });
});
