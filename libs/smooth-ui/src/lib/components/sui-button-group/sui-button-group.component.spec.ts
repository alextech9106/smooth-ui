import { reflectComponentType } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock, MockInstance } from 'vitest';
import { SuiButton } from '../../interfaces/sui-button.interface';
import { SuiButtonGroupComponent } from './sui-button-group.component';

describe('SuiButtonGroupComponent', () => {
  let component: SuiButtonGroupComponent;
  let fixture: ComponentFixture<SuiButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonGroupComponent);
    fixture.componentRef.setInput('buttons', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('names icon buttons after the button name', async () => {
    fixture.componentRef.setInput('type', 'icon');
    fixture.componentRef.setInput('buttons', [
      { name: 'Bold', icon: 'check' },
      { name: 'Italic', icon: 'x' },
    ]);
    await fixture.whenStable();

    const labels: (string | null)[] = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Bold', 'Italic']);
  });

  describe('group role and label', () => {
    it('exposes the host with the group role', () => {
      expect(fixture.nativeElement.getAttribute('role')).toBe('group');
    });

    it('names the group after its label as given', async () => {
      fixture.componentRef.setInput('label', ' Tools ');
      await fixture.whenStable();

      expect(fixture.nativeElement.getAttribute('aria-label')).toBe(' Tools ');
    });

    it('has no group name when the label is not given', () => {
      expect(fixture.nativeElement.hasAttribute('aria-label')).toBe(false);
    });

    it.each(['', '  '])('has no group name when the label is blank (%j)', async (label: string) => {
      fixture.componentRef.setInput('label', 'Tools');
      await fixture.whenStable();
      fixture.componentRef.setInput('label', label);
      await fixture.whenStable();

      expect(fixture.nativeElement.hasAttribute('aria-label')).toBe(false);
    });

    it('keeps every segment its own Tab stop, in list order, without key handling', async () => {
      fixture.componentRef.setInput('buttons', [{ name: 'One' }, { name: 'Two' }, { name: 'Three' }]);
      await fixture.whenStable();

      const segments: HTMLButtonElement[] = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));
      expect(segments.map((segment) => segment.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
      segments.forEach((segment) => {
        expect(segment.hasAttribute('tabindex')).toBe(false);
        expect(segment.tabIndex).toBe(0);
      });

      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await fixture.whenStable();

      expect(document.activeElement).toBe(segments[0]);
    });
  });

  describe('text entries', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('names an entry after a label that does not contain its name, reporting nothing', async () => {
      const error: MockInstance<typeof console.error> = vi.spyOn(console, 'error');
      const warn: MockInstance<typeof console.warn> = vi.spyOn(console, 'warn');

      fixture.componentRef.setInput('buttons', [{ name: 'Bold', label: 'Italic' }]);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Italic');
      expect(button.textContent?.trim()).toBe('Bold');
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });

    it('names an icon entry with a blank name after its label', async () => {
      fixture.componentRef.setInput('buttons', [{ name: '', icon: 'check', label: 'Bold' }]);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Bold');
    });
  });
  describe('pressed state (FR-7)', () => {
    const segmentsOf = (): HTMLButtonElement[] => Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

    describe.each([
      ['button', 'sui-button-selected'],
      ['icon', 'sui-icon-button-selected'],
    ])('in %s type', (type: string, selectedClass: string) => {
      beforeEach(async () => {
        fixture.componentRef.setInput('type', type);
        await fixture.whenStable();
      });

      it('announces pressed and shows the selected look when selected is true', async () => {
        fixture.componentRef.setInput('buttons', [{ name: 'Bold', icon: 'check', selected: true }]);
        await fixture.whenStable();

        const [segment] = segmentsOf();
        expect(segment.getAttribute('aria-pressed')).toBe('true');
        expect(segment.classList.contains(selectedClass)).toBe(true);
      });

      it('announces not pressed without the selected look when selected is false', async () => {
        fixture.componentRef.setInput('buttons', [{ name: 'Bold', icon: 'check', selected: false }]);
        await fixture.whenStable();

        const [segment] = segmentsOf();
        expect(segment.getAttribute('aria-pressed')).toBe('false');
        expect(segment.classList.contains(selectedClass)).toBe(false);
      });

      it('announces no pressed state when selected is absent or undefined', async () => {
        fixture.componentRef.setInput('buttons', [
          { name: 'Bold', icon: 'check' },
          { name: 'Italic', icon: 'x', selected: undefined },
        ]);
        await fixture.whenStable();

        segmentsOf().forEach((segment) => {
          expect(segment.hasAttribute('aria-pressed')).toBe(false);
          expect(segment.classList.contains(selectedClass)).toBe(false);
        });
      });

      it('mixes pressed, not pressed and no pressed state in one group', async () => {
        fixture.componentRef.setInput('buttons', [
          { name: 'Bold', icon: 'check', selected: true },
          { name: 'Italic', icon: 'x', selected: false },
          { name: 'Underline', icon: 'check' },
        ]);
        await fixture.whenStable();

        const segments: HTMLButtonElement[] = segmentsOf();
        expect(segments.map((segment) => segment.getAttribute('aria-pressed'))).toEqual(['true', 'false', null]);
        expect(segments.map((segment) => segment.classList.contains(selectedClass))).toEqual([true, false, false]);
      });
    });

    it.each([
      [{ selected: true }, 'true'],
      [{}, null],
    ])('announces the menu state in button type with expanded and %j', async (extra: { selected?: boolean }, pressed: string | null) => {
      fixture.componentRef.setInput('buttons', [{ name: 'More', expanded: false, ...extra }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.getAttribute('aria-expanded')).toBe('false');
      expect(segment.getAttribute('aria-haspopup')).toBe('menu');
      expect(segment.getAttribute('aria-pressed')).toBe(pressed);
    });

    it('does not announce expanded in icon type', async () => {
      fixture.componentRef.setInput('type', 'icon');
      fixture.componentRef.setInput('buttons', [{ name: 'More', icon: 'check', expanded: true, selected: true }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.hasAttribute('aria-expanded')).toBe(false);
      expect(segment.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('segment names (FR-5)', () => {
    let error: MockInstance<typeof console.error>;
    let warn: MockInstance<typeof console.warn>;

    beforeEach(() => {
      error = vi.spyOn(console, 'error');
      warn = vi.spyOn(console, 'warn');
    });

    afterEach(() => {
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
      vi.restoreAllMocks();
    });

    const render = async (type: string, entry: { name: string; label?: string }): Promise<HTMLButtonElement> => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('buttons', [{ icon: 'check', ...entry }]);
      await fixture.whenStable();
      return fixture.nativeElement.querySelector('button');
    };

    describe('in button type', () => {
      it('names the segment after a non-blank label as given', async () => {
        const segment: HTMLButtonElement = await render('button', { name: 'Bold', label: ' Bold ' });
        expect(segment.getAttribute('aria-label')).toBe(' Bold ');
      });

      it('names the segment through its trimmed visible text when the label is empty', async () => {
        const segment: HTMLButtonElement = await render('button', { name: ' Bold ', label: '' });
        expect(segment.hasAttribute('aria-label')).toBe(false);
        expect(segment.textContent?.trim()).toBe('Bold');
      });

      it('names the segment after its name as given when the label is whitespace', async () => {
        const segment: HTMLButtonElement = await render('button', { name: ' Bold ', label: '  ' });
        expect(segment.getAttribute('aria-label')).toBe(' Bold ');
      });

      it('gives an empty aria-label when name and label are empty', async () => {
        const segment: HTMLButtonElement = await render('button', { name: '', label: '' });
        expect(segment.getAttribute('aria-label')).toBe('');
      });

      it('gives whitespace content and no aria-label for a whitespace name and an empty label', async () => {
        const segment: HTMLButtonElement = await render('button', { name: '  ', label: '' });
        expect(segment.hasAttribute('aria-label')).toBe(false);
        expect(segment.textContent?.trim()).toBe('');
        expect(segment.querySelector('span')?.textContent).toBe('  ');
      });

      it('gives a whitespace-only aria-label for a whitespace name and a whitespace label', async () => {
        const segment: HTMLButtonElement = await render('button', { name: '  ', label: ' ' });
        expect(segment.getAttribute('aria-label')?.trim()).toBe('');
        expect(segment.getAttribute('aria-label')?.length).toBeGreaterThan(0);
      });
    });

    describe('in icon type', () => {
      it('names the segment after a non-blank label as given', async () => {
        const segment: HTMLButtonElement = await render('icon', { name: 'Bold', label: ' Bold ' });
        expect(segment.getAttribute('aria-label')).toBe(' Bold ');
      });

      it.each([['  '], [''], [undefined]])('falls back to the name as given when the label is %j', async (label: string | undefined) => {
        const segment: HTMLButtonElement = await render('icon', label === undefined ? { name: ' Bold ' } : { name: ' Bold ', label });
        expect(segment.getAttribute('aria-label')).toBe(' Bold ');
      });

      it.each([
        ['', ''],
        ['  ', ' '],
        ['  ', undefined],
      ])('has no aria-label when name %j and label %j are blank', async (name: string, label: string | undefined) => {
        const segment: HTMLButtonElement = await render('icon', label === undefined ? { name } : { name, label });
        expect(segment.hasAttribute('aria-label')).toBe(false);
      });
    });
  });

  describe('required buttons and empty list (FR-1)', () => {
    it('reports a failure when created without buttons', () => {
      const unset: ComponentFixture<SuiButtonGroupComponent> = TestBed.createComponent(SuiButtonGroupComponent);

      expect(() => unset.detectChanges()).toThrow(/NG0950/);
    });

    it.each(['button', 'icon'])('renders no segment for an empty list in %s type', async (type: string) => {
      fixture.componentRef.setInput('type', type);
      await fixture.whenStable();

      expect(fixture.nativeElement.querySelectorAll('button')).toHaveLength(0);
      expect(fixture.nativeElement.querySelectorAll('sui-button, sui-icon-button')).toHaveLength(0);
    });
  });

  describe('segments (FR-2)', () => {
    const entries: SuiButton[] = [
      { name: 'One', icon: 'check' },
      { name: 'Two', icon: 'x' },
      { name: 'Three', icon: 'file' },
    ];

    it.each([
      ['button', 'sui-button'],
      ['icon', 'sui-icon-button'],
    ])('renders one segment per entry, in list order, in one row in %s type', async (type: string, tag: string) => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('buttons', entries);
      await fixture.whenStable();

      const rows: HTMLElement[] = Array.from<HTMLElement>(fixture.nativeElement.children);
      expect(rows).toHaveLength(1);
      const segments: Element[] = Array.from(rows[0].children);
      expect(segments.map((segment) => segment.tagName.toLowerCase())).toEqual([tag, tag, tag]);
      expect(segments.map((segment) => segment.querySelector('use')?.getAttribute('href'))).toEqual(['#check', '#x', '#file']);
    });

    it('shows the name as text after the icon in button type', async () => {
      fixture.componentRef.setInput('buttons', entries);
      await fixture.whenStable();

      const buttons: HTMLButtonElement[] = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));
      expect(buttons.map((button) => button.textContent?.trim())).toEqual(['One', 'Two', 'Three']);
      buttons.forEach((button) => {
        const children: string[] = Array.from(button.children).map((child) => child.tagName.toLowerCase());
        expect(children).toEqual(['sui-icon', 'span']);
      });
    });

    it('shows only the name in button type for an entry without icon', async () => {
      fixture.componentRef.setInput('buttons', [{ name: 'One' }]);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.querySelector('svg')).toBeNull();
      expect(button.textContent?.trim()).toBe('One');
    });

    it('shows one icon and no text per segment in icon type, also for an entry without icon', async () => {
      fixture.componentRef.setInput('type', 'icon');
      fixture.componentRef.setInput('buttons', [{ name: 'One', icon: 'check' }, { name: 'Two' }]);
      await fixture.whenStable();

      const buttons: HTMLButtonElement[] = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));
      expect(buttons).toHaveLength(2);
      buttons.forEach((button) => {
        expect(button.querySelectorAll('svg')).toHaveLength(1);
        expect(button.textContent?.trim()).toBe('');
      });
      expect(buttons[1].querySelector('use')?.getAttribute('href')).toBe('#');
    });
  });

  describe('activation (FR-3)', () => {
    describe.each(['button', 'icon'])('in %s type', (type: string) => {
      beforeEach(async () => {
        fixture.componentRef.setInput('type', type);
        await fixture.whenStable();
      });

      it('calls the callback once, with no arguments, as a method of the entry', async () => {
        const callback: Mock<() => void> = vi.fn<() => void>();
        const entry: SuiButton = { name: 'Bold', icon: 'check', callback };
        fixture.componentRef.setInput('buttons', [entry, { name: 'Italic', icon: 'x', callback: vi.fn<() => void>() }]);
        await fixture.whenStable();

        fixture.nativeElement.querySelector('button').click();
        await fixture.whenStable();

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback.mock.calls[0]).toEqual([]);
        expect(callback.mock.contexts[0]).toBe(entry);
      });

      it('does nothing for an entry without a callback', async () => {
        fixture.componentRef.setInput('buttons', [{ name: 'Bold', icon: 'check' }]);
        await fixture.whenStable();

        expect(() => fixture.nativeElement.querySelector('button').click()).not.toThrow();
      });

      it.each([[true], [false], [undefined]])('leaves the entry unchanged when selected is %j', async (selected: boolean | undefined) => {
        const entry: SuiButton = { name: 'Bold', icon: 'check', selected, callback: vi.fn<() => void>() };
        const copy: SuiButton = { ...entry };
        fixture.componentRef.setInput('buttons', [entry]);
        await fixture.whenStable();

        const segment: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        const pressed: string | null = segment.getAttribute('aria-pressed');
        segment.click();
        await fixture.whenStable();

        expect(entry).toEqual(copy);
        expect(Object.keys(entry)).toEqual(Object.keys(copy));
        expect(segment.getAttribute('aria-pressed')).toBe(pressed);
      });

      it('never submits a surrounding form', async () => {
        const form: HTMLFormElement = document.createElement('form');
        const submit: Mock<(event: Event) => void> = vi.fn<(event: Event) => void>((event: Event) => event.preventDefault());
        form.addEventListener('submit', submit);
        document.body.appendChild(form);
        form.appendChild(fixture.nativeElement);
        fixture.componentRef.setInput('buttons', [{ name: 'Bold', icon: 'check' }]);
        await fixture.whenStable();

        const segment: HTMLButtonElement = fixture.nativeElement.querySelector('button');
        expect(segment.type).toBe('button');
        segment.click();
        await fixture.whenStable();

        expect(submit).not.toHaveBeenCalled();
        form.remove();
      });
    });

    it('declares no output', () => {
      expect(reflectComponentType(SuiButtonGroupComponent)?.outputs).toEqual([]);
    });
  });

  describe('group settings and entry fields (FR-4)', () => {
    const segmentsOf = (): HTMLButtonElement[] => Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button'));

    it.each([
      ['button', 'sui-button'],
      ['icon', 'sui-icon-button'],
    ])('gives every segment md, ghost and flat by default in %s type', async (type: string, prefix: string) => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('buttons', [
        { name: 'One', icon: 'check' },
        { name: 'Two', icon: 'x' },
      ]);
      await fixture.whenStable();

      segmentsOf().forEach((segment) => {
        expect(segment.classList).toContain(`${prefix}-md`);
        expect(segment.classList).toContain(`${prefix}-ghost`);
        expect(segment.classList).toContain(`${prefix}-flat`);
      });
    });

    it.each([
      ['button', 'sui-button'],
      ['icon', 'sui-icon-button'],
    ])('gives every segment the group size and variant in %s type', async (type: string, prefix: string) => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('buttons', [
        { name: 'One', icon: 'check' },
        { name: 'Two', icon: 'x' },
      ]);
      await fixture.whenStable();

      segmentsOf().forEach((segment) => {
        expect(segment.classList).toContain(`${prefix}-lg`);
        expect(segment.classList).toContain(`${prefix}-primary`);
        expect(segment.classList).not.toContain(`${prefix}-md`);
        expect(segment.classList).not.toContain(`${prefix}-ghost`);
      });
    });

    it.each([
      ['button', 'sui-button'],
      ['icon', 'sui-icon-button'],
    ])('keeps the group values over the entry size, variant, shape and state in %s type', async (type: string, prefix: string) => {
      fixture.componentRef.setInput('type', type);
      fixture.componentRef.setInput('buttons', [{ name: 'One', icon: 'check', size: 'sm', variant: 'danger', shape: 'pill', state: 'focus' }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.classList).toContain(`${prefix}-md`);
      expect(segment.classList).toContain(`${prefix}-ghost`);
      expect(segment.classList).toContain(`${prefix}-flat`);
      expect(segment.classList).not.toContain(`${prefix}-sm`);
      expect(segment.classList).not.toContain(`${prefix}-danger`);
      expect(segment.classList).not.toContain(`${prefix}-pill`);
      expect(segment.classList).not.toContain(`${prefix}-focus`);
    });

    it('keeps the group look for an entry with fullWidth, iconEnd and loading in button type', async () => {
      fixture.componentRef.setInput('buttons', [{ name: 'One', icon: 'check', fullWidth: true, iconEnd: true, loading: true }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.classList).not.toContain('sui-button-full-width');
      expect(segment.hasAttribute('aria-busy')).toBe(false);
      expect(segment.disabled).toBe(false);
      expect(Array.from(segment.children).map((child) => child.tagName.toLowerCase())).toEqual(['sui-icon', 'span']);
    });

    it('applies the entry name, label and icon in button type', async () => {
      fixture.componentRef.setInput('buttons', [{ name: 'Bold', label: 'Bold text', icon: 'check' }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.textContent?.trim()).toBe('Bold');
      expect(segment.getAttribute('aria-label')).toBe('Bold text');
      expect(segment.querySelector('use')?.getAttribute('href')).toBe('#check');
    });

    it('applies the entry label and icon in icon type', async () => {
      fixture.componentRef.setInput('type', 'icon');
      fixture.componentRef.setInput('buttons', [{ name: 'Bold', label: 'Bold text', icon: 'check' }]);
      await fixture.whenStable();

      const [segment] = segmentsOf();
      expect(segment.getAttribute('aria-label')).toBe('Bold text');
      expect(segment.querySelector('use')?.getAttribute('href')).toBe('#check');
    });

    it('leaves the entry description as it is', async () => {
      const entry: SuiButton = { name: 'Bold', label: ' Bold ', icon: 'check', expanded: false };
      const copy: SuiButton = { ...entry };
      fixture.componentRef.setInput('buttons', [entry]);
      await fixture.whenStable();
      fixture.componentRef.setInput('type', 'icon');
      await fixture.whenStable();

      expect(entry).toEqual(copy);
      expect(Object.keys(entry)).toEqual(Object.keys(copy));
    });
  });

  describe('shape and variant classes (FR-8, FR-9)', () => {
    const row = (): HTMLElement => fixture.nativeElement.querySelector('.sui-button-group');

    it('is flat and ghost by default', () => {
      expect(row().classList).toContain('sui-button-group-flat');
      expect(row().classList).toContain('sui-button-group-ghost');
    });

    it.each(['flat', 'rounded', 'pill'])('sets the %s shape class and keeps flat segments', async (shape: string) => {
      fixture.componentRef.setInput('shape', shape);
      fixture.componentRef.setInput('buttons', [{ name: 'One' }, { name: 'Two' }]);
      await fixture.whenStable();

      expect(row().classList).toContain(`sui-button-group-${shape}`);
      Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button')).forEach((segment) => {
        expect(segment.classList).toContain('sui-button-flat');
      });
    });

    it.each(['ghost', 'primary'])('sets the %s variant class', async (variant: string) => {
      fixture.componentRef.setInput('variant', variant);
      await fixture.whenStable();

      expect(row().classList).toContain(`sui-button-group-${variant}`);
      expect(row().classList).toHaveLength(4);
    });
  });

  describe('own text (NFR-2)', () => {
    it('adds no text and no name of its own', () => {
      expect(fixture.nativeElement.textContent).toBe('');
      expect(fixture.nativeElement.hasAttribute('aria-label')).toBe(false);
    });
  });
});
