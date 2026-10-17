import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButtonSplitComponent } from './sui-button-split.component';
import { SUI_BUTTON_SPLIT_MODE } from './type/sui-button-split-mode.type';

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
});
