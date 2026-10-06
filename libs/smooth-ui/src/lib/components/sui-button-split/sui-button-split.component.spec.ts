import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButtonSplitComponent } from './sui-button-split.component';

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
});
