import { Component, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButtonSplitComponent } from './sui-button-split.component';
import { SUI_BUTTON_SPLIT_MODE } from './type/sui-button-split-mode.type';

@Component({
  imports: [SuiButtonSplitComponent],
  template: `
    <form (submit)="onSubmit($event)">
      <sui-button-split [menuItems]="menuItems" name="Save" />
    </form>
  `,
})
class SplitInFormHostComponent {
  public submissions: number = 0;

  protected readonly menuItems: MenuItem[] = [{ id: 'draft', title: 'Save as draft', icon: { name: 'file', size: 16 } }];

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submissions++;
  }
}

describe('SuiButtonSplitComponent', () => {
  let component: SuiButtonSplitComponent;
  let fixture: ComponentFixture<SuiButtonSplitComponent>;
  let host: HTMLElement;

  const menuItems: MenuItem[] = [
    { id: 'draft', title: 'Save as draft', icon: { name: 'file', size: 16 } },
    { id: 'close', title: 'Save and close', icon: { name: 'x', size: 16 } },
  ];

  const trigger = (): HTMLButtonElement => {
    const buttons: NodeListOf<HTMLButtonElement> = host.querySelectorAll<HTMLButtonElement>('sui-button-group button');
    return buttons[buttons.length - 1];
  };

  const menuButtons = (): HTMLButtonElement[] => Array.from(host.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));

  const openMenu = async (): Promise<void> => {
    trigger().click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonSplitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonSplitComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
    fixture.componentRef.setInput('name', 'Save');
    fixture.componentRef.setInput('menuItems', menuItems);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits trigger when the main button is clicked', () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);

    host.querySelector<HTMLButtonElement>('sui-button-group button')?.click();

    expect(emitted).toBe(1);
    expect(host.querySelector('[role="menu"]')).toBeNull();
  });

  it('names the trigger and reflects the menu state', async () => {
    expect(trigger().getAttribute('aria-label')).toBe('More options');
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');

    await openMenu();

    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('[role="menu"]')).not.toBeNull();
  });

  it('renders the options as focusable menu items and focuses the first one', async () => {
    await openMenu();

    const items: HTMLButtonElement[] = menuButtons();
    expect(items.map((item) => item.textContent?.trim())).toEqual(['Save as draft', 'Save and close']);
    expect(document.activeElement).toBe(items[0]);
  });

  it('moves focus between options with the arrow keys', async () => {
    await openMenu();
    const items: HTMLButtonElement[] = menuButtons();

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[0]);
  });

  it('emits the selected item, closes the menu and returns focus to the trigger', async () => {
    const selected: MenuItem[] = [];
    component.itemSelected.subscribe((menuItem) => selected.push(menuItem));
    await openMenu();

    menuButtons()[1].click();
    await fixture.whenStable();

    expect(selected).toEqual([menuItems[1]]);
    expect(host.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('closes the menu with Escape', async () => {
    await openMenu();

    menuButtons()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(host.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('reports a failure when created without a name', () => {
    const unnamed: ComponentFixture<SuiButtonSplitComponent> = TestBed.createComponent(SuiButtonSplitComponent);

    expect(() => unnamed.detectChanges()).toThrow(/NG0950/);
  });

  describe('whitespace-only name', () => {
    const modes: SUI_BUTTON_SPLIT_MODE[] = ['default', 'icon'];

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it.each(modes)('renders in %s mode and reports nothing', async (mode: SUI_BUTTON_SPLIT_MODE) => {
      const error: MockInstance<typeof console.error> = vi.spyOn(console, 'error');
      const warn: MockInstance<typeof console.warn> = vi.spyOn(console, 'warn');

      fixture.componentRef.setInput('name', '  ');
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('mode', mode);
      await fixture.whenStable();

      expect(host.querySelectorAll('sui-button-group button')).toHaveLength(2);
      expect(trigger().getAttribute('aria-label')).toBe('More options');
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });
  });

  describe.each<SUI_BUTTON_SPLIT_MODE>(['default', 'icon'])('inner group in %s mode', (mode: SUI_BUTTON_SPLIT_MODE) => {
    const group = (): HTMLElement | null => host.querySelector('sui-button-group');
    const segments = (): HTMLButtonElement[] => Array.from(host.querySelectorAll<HTMLButtonElement>('sui-button-group button'));

    beforeEach(async () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('mode', mode);
      await fixture.whenStable();
    });

    it('is an unnamed group whose segments announce no pressed state', () => {
      expect(group()?.getAttribute('role')).toBe('group');
      expect(group()?.hasAttribute('aria-label')).toBe(false);
      expect(segments()).toHaveLength(2);
      segments().forEach((segment) => expect(segment.hasAttribute('aria-pressed')).toBe(false));
    });

    it('stays an unnamed group without pressed state after opening the menu', async () => {
      await openMenu();

      expect(host.querySelector('[role="menu"]')).not.toBeNull();
      expect(group()?.getAttribute('role')).toBe('group');
      expect(group()?.hasAttribute('aria-label')).toBe(false);
      segments().forEach((segment) => expect(segment.hasAttribute('aria-pressed')).toBe(false));
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('unchanged behaviour', () => {
    const group = (): HTMLElement | null => host.querySelector<HTMLElement>('sui-button-group > div');
    const segments = (): HTMLButtonElement[] => Array.from(host.querySelectorAll<HTMLButtonElement>('sui-button-group button'));
    const mainSegment = (): HTMLButtonElement => segments()[0];

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('renders both segments with an empty name and reports nothing (FR-1)', async () => {
      const error: MockInstance<typeof console.error> = vi.spyOn(console, 'error');

      fixture.componentRef.setInput('name', '');
      await fixture.whenStable();

      expect(segments()).toHaveLength(2);
      expect(error).not.toHaveBeenCalled();
    });

    it('renders the main segment and the chevron arrow with the default size, variant and shape (FR-2)', () => {
      expect(segments()).toHaveLength(2);
      expect(trigger().querySelector('use')?.getAttribute('href')).toBe('#chevron-down');
      expect(group()?.classList.contains('sui-button-group-flat')).toBe(true);
      expect(group()?.classList.contains('sui-button-group-md')).toBe(true);
      expect(group()?.classList.contains('sui-button-group-ghost')).toBe(true);
      segments().forEach((segment: HTMLButtonElement) => {
        expect(segment.classList.contains('sui-button-md')).toBe(true);
        expect(segment.classList.contains('sui-button-ghost')).toBe(true);
      });
    });

    it('passes size and variant to the group and both segments, and shape only to the group (FR-2)', async () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'primary');
      fixture.componentRef.setInput('shape', 'pill');
      await fixture.whenStable();

      expect(group()?.classList.contains('sui-button-group-lg')).toBe(true);
      expect(group()?.classList.contains('sui-button-group-primary')).toBe(true);
      expect(group()?.classList.contains('sui-button-group-pill')).toBe(true);
      expect(segments()).toHaveLength(2);
      segments().forEach((segment: HTMLButtonElement) => {
        expect(segment.classList.contains('sui-button-lg')).toBe(true);
        expect(segment.classList.contains('sui-button-primary')).toBe(true);
        expect(segment.classList.contains('sui-button-flat')).toBe(true);
        expect(segment.classList.contains('sui-button-pill')).toBe(false);
      });
    });

    it('keeps each segment as its own tab stop (FR-3)', () => {
      expect(segments().map((segment: HTMLButtonElement) => segment.tabIndex)).toEqual([0, 0]);
    });

    it('shows the name as text without aria-label in default mode (FR-4)', () => {
      expect(mainSegment().textContent?.trim()).toBe('Save');
      expect(mainSegment().hasAttribute('aria-label')).toBe(false);
    });

    it('shows only the icon and names the main segment with the name in icon mode (FR-4)', async () => {
      fixture.componentRef.setInput('mode', 'icon');
      fixture.componentRef.setInput('icon', 'check');
      await fixture.whenStable();

      expect(mainSegment().querySelector('use')?.getAttribute('href')).toBe('#check');
      expect(mainSegment().textContent?.trim()).toBe('');
      expect(mainSegment().getAttribute('aria-label')).toBe('Save');
    });

    it('leaves the main segment empty in icon mode without an icon (FR-4)', async () => {
      fixture.componentRef.setInput('mode', 'icon');
      fixture.componentRef.setInput('icon', '');
      await fixture.whenStable();

      expect(mainSegment().querySelector('svg')).toBeNull();
      expect(mainSegment().textContent?.trim()).toBe('');
    });

    it('emits trigger once without data and keeps a closed menu closed (FR-5)', async () => {
      const emitted: unknown[] = [];
      component.trigger.subscribe((value: unknown) => emitted.push(value));

      mainSegment().click();
      await fixture.whenStable();

      expect(emitted).toEqual([undefined]);
      expect(host.querySelector('[role="menu"]')).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('emits trigger and keeps an open menu open (FR-5)', async () => {
      const emitted: unknown[] = [];
      component.trigger.subscribe((value: unknown) => emitted.push(value));
      await openMenu();

      mainSegment().click();
      await fixture.whenStable();

      expect(emitted).toEqual([undefined]);
      expect(host.querySelector('[role="menu"]')).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
    });

    it('never submits the surrounding form when either segment is clicked (FR-5)', async () => {
      const formFixture: ComponentFixture<SplitInFormHostComponent> = TestBed.createComponent(SplitInFormHostComponent);
      await formFixture.whenStable();
      const formSegments: HTMLButtonElement[] = Array.from(
        (formFixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('sui-button-group button'),
      );

      expect(formSegments).toHaveLength(2);
      formSegments.forEach((segment: HTMLButtonElement) => segment.click());
      await formFixture.whenStable();

      expect(formFixture.componentInstance.submissions).toBe(0);
    });
  });

  describe('unchanged menu behaviour', () => {
    const separatedItems: MenuItem[] = [
      { id: 'draft', title: 'Save as draft', icon: { name: 'file', size: 16 }, separatorAfter: true },
      { id: 'copy', title: 'Save a copy', icon: { name: 'copy', size: 16 } },
      { id: 'delete', title: 'Delete', icon: { name: 'trash', size: 16 }, separatorAfter: true },
    ];

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');
    const mainSegment = (): HTMLButtonElement => host.querySelectorAll<HTMLButtonElement>('sui-button-group button')[0];
    const pressEscape = (target: HTMLElement): void => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    };

    it('exposes a menu named by the name with one menu item per option in order (FR-8)', async () => {
      fixture.componentRef.setInput('menuItems', separatedItems);
      await fixture.whenStable();
      await openMenu();

      expect(menu()?.getAttribute('aria-label')).toBe('Save');
      expect(menuButtons().map((item: HTMLButtonElement) => item.textContent?.trim())).toEqual(['Save as draft', 'Save a copy', 'Delete']);
      expect(menuButtons().map((item: HTMLButtonElement) => item.querySelector('use')?.getAttribute('href'))).toEqual(['#file', '#copy', '#trash']);
    });

    it('adds a separator after each option with separatorAfter, including the last one (FR-8)', async () => {
      fixture.componentRef.setInput('menuItems', separatedItems);
      await fixture.whenStable();
      await openMenu();

      const roles: (string | null)[] = Array.from(menu()?.children ?? []).map((child: Element) => child.getAttribute('role'));
      expect(roles).toEqual(['menuitem', 'separator', 'menuitem', 'menuitem', 'separator']);
    });

    it('emits the same item reference, closes the menu and focuses the arrow when an option is clicked (FR-9)', async () => {
      const selected: MenuItem[] = [];
      component.itemSelected.subscribe((menuItem: MenuItem) => selected.push(menuItem));
      await openMenu();

      menuButtons()[0].click();
      await fixture.whenStable();

      expect(selected).toHaveLength(1);
      expect(selected[0]).toBe(menuItems[0]);
      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('renders every option as a native button of type button (FR-9)', async () => {
      await openMenu();

      expect(menuButtons()).toHaveLength(2);
      menuButtons().forEach((item: HTMLButtonElement) => {
        expect(item.tagName).toBe('BUTTON');
        expect(item.type).toBe('button');
      });
    });

    it('styles the menu and its options with the split-menu classes (FR-10)', async () => {
      await openMenu();

      expect(menu()?.classList.contains('split-menu')).toBe(true);
      menuButtons().forEach((item: HTMLButtonElement) => expect(item.classList.contains('split-menu-item')).toBe(true));
    });

    it('closes with Escape from an option and focuses the arrow (FR-13)', async () => {
      await openMenu();

      pressEscape(menuButtons()[1]);
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('closes with Escape from the main segment and focuses the arrow (FR-13)', async () => {
      await openMenu();
      mainSegment().focus();

      pressEscape(mainSegment());
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('does not move the focus with Escape while the menu is closed (FR-13)', async () => {
      mainSegment().focus();

      pressEscape(mainSegment());
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(document.activeElement).toBe(mainSegment());
    });

    it('closes without focusing the arrow when the pointer goes down outside (FR-13)', async () => {
      await openMenu();

      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).not.toBe(trigger());
    });

    it('stays open when the pointer goes down inside the menu (FR-13)', async () => {
      await openMenu();

      menuButtons()[0].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      await fixture.whenStable();

      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('consumer labels', () => {
    const modes: SUI_BUTTON_SPLIT_MODE[] = ['default', 'icon'];

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    it.each(modes)('names the arrow "More options" by default in %s mode (FR-6)', async (mode: SUI_BUTTON_SPLIT_MODE) => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('mode', mode);
      await fixture.whenStable();

      expect(trigger().getAttribute('aria-label')).toBe('More options');
    });

    it.each(modes)('names the arrow with arrowLabel in %s mode (FR-6)', async (mode: SUI_BUTTON_SPLIT_MODE) => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('mode', mode);
      fixture.componentRef.setInput('arrowLabel', 'More save options');
      await fixture.whenStable();

      expect(trigger().getAttribute('aria-label')).toBe('More save options');
    });

    it('names the menu "Options" when the name is empty (FR-8)', async () => {
      fixture.componentRef.setInput('name', '');
      await fixture.whenStable();
      await openMenu();

      expect(menu()?.getAttribute('aria-label')).toBe('Options');
    });

    it('names the menu with menuFallbackLabel when the name is empty (FR-8)', async () => {
      fixture.componentRef.setInput('name', '');
      fixture.componentRef.setInput('menuFallbackLabel', 'Choices');
      await fixture.whenStable();
      await openMenu();

      expect(menu()?.getAttribute('aria-label')).toBe('Choices');
    });

    it('names the menu with a whitespace-only name as given (FR-8)', async () => {
      fixture.componentRef.setInput('name', '  ');
      fixture.componentRef.setInput('menuFallbackLabel', 'Choices');
      await fixture.whenStable();
      await openMenu();

      expect(menu()?.getAttribute('aria-label')).toBe('  ');
    });

    it.each(modes)('uses no built-in text once both labels are replaced in %s mode (NFR-2)', async (mode: SUI_BUTTON_SPLIT_MODE) => {
      fixture.componentRef.setInput('name', '');
      fixture.componentRef.setInput('icon', 'check');
      fixture.componentRef.setInput('mode', mode);
      fixture.componentRef.setInput('arrowLabel', 'More save options');
      fixture.componentRef.setInput('menuFallbackLabel', 'Choices');
      await fixture.whenStable();
      await openMenu();

      expect(menu()).not.toBeNull();
      const labels: string[] = Array.from(host.querySelectorAll<HTMLElement>('[aria-label]')).map(
        (element: HTMLElement) => element.getAttribute('aria-label') ?? '',
      );
      [...labels, host.textContent ?? ''].forEach((text: string) => {
        expect(text).not.toContain('More options');
        expect(text).not.toContain('Options');
      });
    });
  });

  describe('arrow activation', () => {
    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    it('opens the menu when the arrow is clicked (FR-6)', async () => {
      await openMenu();

      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(menu()).not.toBeNull();
    });

    it('closes the menu with a second click on the focused arrow and keeps the focus on it (FR-6)', async () => {
      await openMenu();
      trigger().focus();

      trigger().click();
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('does not open the menu when the arrow is clicked without options (FR-7)', async () => {
      fixture.componentRef.setInput('menuItems', []);
      await fixture.whenStable();

      trigger().click();
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    });
  });

  describe('menu placement', () => {
    const originalInnerHeight: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(window, 'innerHeight');

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    const setViewport = (innerHeight: number): void => {
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight });
    };

    const measure = (hostTop: number, hostBottom: number, menuHeight: number): void => {
      vi.spyOn(host, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, hostTop, 200, hostBottom - hostTop));
      vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(menuHeight);
    };

    afterEach(() => {
      vi.restoreAllMocks();
      if (originalInnerHeight) {
        Object.defineProperty(window, 'innerHeight', originalInnerHeight);
      }
    });

    it('opens below when there is enough space below (FR-8)', async () => {
      setViewport(800);
      measure(100, 140, 100);

      await openMenu();

      expect(menu()?.classList.contains('split-menu')).toBe(true);
      expect(menu()?.classList.contains('split-menu-top')).toBe(false);
    });

    it('opens above when the space below is too small and the space above is larger (FR-8)', async () => {
      setViewport(800);
      measure(700, 740, 100);

      await openMenu();

      expect(menu()?.classList.contains('split-menu')).toBe(true);
      expect(menu()?.classList.contains('split-menu-top')).toBe(true);
    });

    it('stays below when the space below is too small but the space above is smaller (FR-8)', async () => {
      setViewport(800);
      measure(100, 340, 500);

      await openMenu();

      expect(menu()?.classList.contains('split-menu')).toBe(true);
      expect(menu()?.classList.contains('split-menu-top')).toBe(false);
    });

    it('stays below when the space below equals the menu height (FR-8)', async () => {
      setViewport(800);
      measure(660, 700, 100);

      await openMenu();

      expect(menu()?.classList.contains('split-menu')).toBe(true);
      expect(menu()?.classList.contains('split-menu-top')).toBe(false);
    });

    it('reads the viewport height from the injected document (FR-8)', async () => {
      const injectedDocument: Document = TestBed.inject(DOCUMENT);
      setViewport(800);
      vi.spyOn(injectedDocument, 'defaultView', 'get').mockReturnValue({ innerHeight: 2000 } as Window & typeof globalThis);
      measure(700, 740, 100);

      await openMenu();

      expect(menu()?.classList.contains('split-menu-top')).toBe(false);
    });
  });

  describe('arrow keys on the arrow', () => {
    const threeItems: MenuItem[] = [
      { id: 'draft', title: 'Save as draft', icon: { name: 'file', size: 16 } },
      { id: 'copy', title: 'Save a copy', icon: { name: 'file', size: 16 } },
      { id: 'close', title: 'Save and close', icon: { name: 'x', size: 16 } },
    ];

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    const mainSegment = (): HTMLButtonElement | null => host.querySelector<HTMLButtonElement>('sui-button-group button');

    const pressKey = (target: HTMLElement, key: string): KeyboardEvent => {
      const event: KeyboardEvent = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      return event;
    };

    beforeEach(async () => {
      fixture.componentRef.setInput('menuItems', threeItems);
      await fixture.whenStable();
    });

    it('opens the closed menu and focuses the first option with ArrowDown on the arrow (FR-11)', async () => {
      trigger().focus();

      const event: KeyboardEvent = pressKey(trigger(), 'ArrowDown');
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(menuButtons()[0]);
    });

    it('opens the closed menu and focuses the last option with ArrowUp on the arrow (FR-11)', async () => {
      trigger().focus();

      const event: KeyboardEvent = pressKey(trigger(), 'ArrowUp');
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(menuButtons()[2]);
    });

    it('keeps the open menu open and focuses the first option with ArrowDown on the arrow (FR-11)', async () => {
      await openMenu();
      trigger().focus();

      const event: KeyboardEvent = pressKey(trigger(), 'ArrowDown');
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(menuButtons()[0]);
    });

    it('keeps the open menu open and focuses the last option with ArrowUp on the arrow (FR-11)', async () => {
      await openMenu();
      trigger().focus();

      const event: KeyboardEvent = pressKey(trigger(), 'ArrowUp');
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(menuButtons()[2]);
    });

    it.each(['ArrowDown', 'ArrowUp'])('does not open the menu without options but cancels %s on the arrow (FR-7)', async (key: string) => {
      fixture.componentRef.setInput('menuItems', []);
      await fixture.whenStable();
      trigger().focus();

      const event: KeyboardEvent = pressKey(trigger(), key);
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('ignores ArrowDown dispatched on the main segment (FR-11)', async () => {
      const main: HTMLButtonElement | null = mainSegment();
      expect(main).not.toBe(trigger());
      main?.focus();

      const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      main?.dispatchEvent(event);
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(false);
      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(main);
    });
  });

  describe('keyboard inside the menu', () => {
    const threeItems: MenuItem[] = [
      { id: 'draft', title: 'Save as draft', icon: { name: 'file', size: 16 } },
      { id: 'copy', title: 'Save a copy', icon: { name: 'file', size: 16 } },
      { id: 'close', title: 'Save and close', icon: { name: 'x', size: 16 } },
    ];

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    const pressKey = (target: HTMLElement, key: string, shiftKey: boolean = false): KeyboardEvent => {
      const event: KeyboardEvent = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
      target.dispatchEvent(event);
      return event;
    };

    beforeEach(async () => {
      fixture.componentRef.setInput('menuItems', threeItems);
      await fixture.whenStable();
      await openMenu();
    });

    it('keeps every option and the menu container out of the tab sequence (FR-12)', () => {
      expect(menuButtons().map((item) => item.tabIndex)).toEqual([-1, -1, -1]);
      expect(menu()?.tabIndex).toBe(-1);
    });

    it('wraps ArrowDown from the last option to the first one (FR-12)', () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[2].focus();

      const event: KeyboardEvent = pressKey(items[2], 'ArrowDown');

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(items[0]);
    });

    it('wraps ArrowUp from the first option to the last one (FR-12)', () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[0].focus();

      const event: KeyboardEvent = pressKey(items[0], 'ArrowUp');

      expect(event.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(items[2]);
    });

    it('focuses the first option with Home and the last one with End (FR-12)', () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[1].focus();

      const end: KeyboardEvent = pressKey(items[1], 'End');
      expect(end.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(items[2]);

      const home: KeyboardEvent = pressKey(items[2], 'Home');
      expect(home.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(items[0]);
    });

    it('moves from the option that received the key, not from the focused element (FR-12)', () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[0].focus();

      pressKey(items[1], 'ArrowDown');

      expect(document.activeElement).toBe(items[2]);
    });

    it('focuses the first option with ArrowDown on the menu container (FR-12)', () => {
      const container: HTMLElement | null = menu();
      container?.focus();
      expect(document.activeElement).toBe(container);

      if (container) pressKey(container, 'ArrowDown');

      expect(document.activeElement).toBe(menuButtons()[0]);
    });

    it('focuses the last option with ArrowUp on the menu container (FR-12)', () => {
      const container: HTMLElement | null = menu();
      container?.focus();
      expect(document.activeElement).toBe(container);

      if (container) pressKey(container, 'ArrowUp');

      expect(document.activeElement).toBe(menuButtons()[2]);
    });

    it('closes the menu with Tab on an option without cancelling the key (FR-14)', async () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[1].focus();

      const event: KeyboardEvent = pressKey(items[1], 'Tab');
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(false);
      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });

    it('closes the menu with Shift+Tab on an option, cancels the key and focuses the arrow (FR-16)', async () => {
      const items: HTMLButtonElement[] = menuButtons();
      items[1].focus();

      const event: KeyboardEvent = pressKey(items[1], 'Tab', true);
      await fixture.whenStable();

      expect(event.defaultPrevented).toBe(true);
      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });
  });

  describe('menu items emptied while the menu is open', () => {
    const otherItems: MenuItem[] = [
      { id: 'copy', title: 'Save a copy', icon: { name: 'file', size: 16 } },
      { id: 'publish', title: 'Save and publish', icon: { name: 'file', size: 16 } },
    ];

    const menu = (): HTMLElement | null => host.querySelector<HTMLElement>('[role="menu"]');

    const mainSegment = (): HTMLButtonElement | null => host.querySelector<HTMLButtonElement>('sui-button-group button');

    beforeEach(async () => {
      await openMenu();
    });

    it('closes the menu and focuses the arrow when the focus was on an option (FR-15)', async () => {
      menuButtons()[1].focus();

      fixture.componentRef.setInput('menuItems', []);
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(trigger());
    });

    it('closes the menu and keeps the focus on the main segment when it had the focus (FR-15)', async () => {
      mainSegment()?.focus();
      expect(document.activeElement).toBe(mainSegment());

      fixture.componentRef.setInput('menuItems', []);
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(mainSegment());
    });

    it('keeps the menu open when the list changes to another non-empty list (FR-15)', async () => {
      fixture.componentRef.setInput('menuItems', otherItems);
      await fixture.whenStable();

      expect(menu()).not.toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('true');
      expect(menuButtons().map((item) => item.textContent?.trim())).toEqual(['Save a copy', 'Save and publish']);
    });

    it('does not reopen the menu when options come back after being emptied (FR-15)', async () => {
      fixture.componentRef.setInput('menuItems', []);
      await fixture.whenStable();

      fixture.componentRef.setInput('menuItems', otherItems);
      await fixture.whenStable();

      expect(menu()).toBeNull();
      expect(trigger().getAttribute('aria-expanded')).toBe('false');
    });
  });
});
