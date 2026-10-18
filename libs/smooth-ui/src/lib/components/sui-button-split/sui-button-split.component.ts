import {
  afterNextRender,
  Component,
  computed,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  linkedSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  untracked,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButton } from '../../interfaces/sui-button.interface';
import { SUI_SHAPE } from '../../types/sui-shape.type';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SuiButtonGroupComponent } from '../sui-button-group/sui-button-group.component';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_ICON_NAME } from '../sui-icon/type/sui-icon-name.type';
import { SUI_BUTTON_SPLIT_MODE } from './type/sui-button-split-mode.type';
import { SUI_BUTTON_SPLIT_PLACEMENT } from './type/sui-button-split-placement.type';
import { SUI_BUTTON_SPLIT_VARIANT } from './type/sui-button-split-variant.type';

@Component({
  selector: 'sui-button-split',
  imports: [SuiButtonGroupComponent, SuiIconComponent],
  templateUrl: './sui-button-split.component.html',
  styleUrl: './sui-button-split.component.scss',
  host: {
    '(document:pointerdown)': 'onOutsidePointerDown($event)',
    '(keydown.escape)': 'closeMenu()',
    '(keydown.arrowdown)': 'onArrowKeydown($event, "first")',
    '(keydown.arrowup)': 'onArrowKeydown($event, "last")',
  },
})
export class SuiButtonSplitComponent {
  private readonly _document: Document = inject(DOCUMENT);
  private readonly _injector: Injector = inject(Injector);
  private readonly _hostEl: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _menuElement: Signal<ElementRef<HTMLElement> | undefined> = viewChild('menu');

  public name: InputSignal<string> = input.required<string>();
  public icon: InputSignal<SUI_ICON_NAME> = input<SUI_ICON_NAME>('');
  public menuItems: InputSignal<MenuItem[]> = input<MenuItem[]>([]);
  public arrowLabel: InputSignal<string> = input<string>('More options');
  public menuFallbackLabel: InputSignal<string> = input<string>('Options');
  public mode: InputSignal<SUI_BUTTON_SPLIT_MODE> = input<SUI_BUTTON_SPLIT_MODE>('default');
  public shape: InputSignal<SUI_SHAPE> = input<SUI_SHAPE>('flat');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public variant: InputSignal<SUI_BUTTON_SPLIT_VARIANT> = input<SUI_BUTTON_SPLIT_VARIANT>('ghost');

  public itemSelected: OutputEmitterRef<MenuItem> = output<MenuItem>();
  public trigger: OutputEmitterRef<void> = output<void>();

  protected readonly hasItems: Signal<boolean> = computed<boolean>(() => this.menuItems().length > 0);
  protected readonly menuOpen: WritableSignal<boolean> = linkedSignal<boolean, boolean>({ source: this.hasItems, computation: () => false });
  protected readonly placement: WritableSignal<SUI_BUTTON_SPLIT_PLACEMENT> = signal<SUI_BUTTON_SPLIT_PLACEMENT>('bottom');

  protected readonly menuName: Signal<string> = computed<string>(() => (this.name() === '' ? this.menuFallbackLabel() : this.name()));

  protected readonly buttonSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: this.name(), callback: () => this.trigger.emit() },
    { name: '', icon: 'chevron-down', label: this.arrowLabel(), expanded: this.menuOpen(), callback: () => this.toggleMenu() },
  ]);

  protected readonly iconSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: '', icon: this.icon(), label: this.name(), callback: () => this.trigger.emit() },
    { name: '', icon: 'chevron-down', label: this.arrowLabel(), expanded: this.menuOpen(), callback: () => this.toggleMenu() },
  ]);

  constructor() {
    effect(() => {
      if (this.hasItems()) return;

      const menu: HTMLElement | undefined = untracked(this._menuElement)?.nativeElement;
      if (menu?.contains(this._document.activeElement)) {
        this._focusArrow();
      }
    });
  }

  private _arrowElement(): HTMLButtonElement | null {
    const buttons: NodeListOf<HTMLButtonElement> = this._hostEl.nativeElement.querySelectorAll<HTMLButtonElement>('sui-button-group button');
    return buttons[buttons.length - 1] ?? null;
  }

  private _focusArrow(): void {
    this._arrowElement()?.focus();
  }

  private _focusItem(focus: 'first' | 'last'): void {
    const items: HTMLButtonElement[] = this._menuButtons();
    items[focus === 'first' ? 0 : items.length - 1]?.focus();
  }

  private _menuButtons(): HTMLButtonElement[] {
    return Array.from(this._menuElement()?.nativeElement.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
  }

  private _openMenu(focus: 'first' | 'last'): void {
    if (this.menuOpen()) {
      this._focusItem(focus);
      return;
    }

    this.menuOpen.set(true);
    afterNextRender(
      () => {
        this._resolvePlacement();
        this._focusItem(focus);
      },
      { injector: this._injector },
    );
  }

  private _resolvePlacement(): void {
    const trigger: DOMRect = this._hostEl.nativeElement.getBoundingClientRect();
    const menuHeight: number = this._menuElement()?.nativeElement.offsetHeight ?? 0;
    const spaceBelow: number = (this._document.defaultView?.innerHeight ?? 0) - trigger.bottom;
    this.placement.set(spaceBelow < menuHeight && trigger.top > spaceBelow ? 'top' : 'bottom');
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) return;

    this.menuOpen.set(false);
    this._focusArrow();
  }

  protected onArrowKeydown(event: Event, focus: 'first' | 'last'): void {
    if (event.target !== this._arrowElement()) return;

    event.preventDefault();
    if (this.hasItems()) {
      this._openMenu(focus);
    }
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const items: HTMLButtonElement[] = this._menuButtons();
    const current: number = items.findIndex((item: HTMLButtonElement) => item === event.target);
    let next: number;

    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % items.length;
        break;
      case 'ArrowUp':
        next = current === -1 ? items.length - 1 : (current - 1 + items.length) % items.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      case 'Tab':
        if (event.shiftKey) {
          event.preventDefault();
          this.closeMenu();
          return;
        }

        this.menuOpen.set(false);
        return;
      default:
        return;
    }

    event.preventDefault();
    items[next]?.focus();
  }

  protected onOutsidePointerDown(event: PointerEvent): void {
    if (this.menuOpen() && !this._hostEl.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  protected toggleMenu(): void {
    if (!this.menuOpen() && !this.hasItems()) return;

    if (this.menuOpen()) {
      this.menuOpen.set(false);
      return;
    }

    this._openMenu('first');
  }

  protected selectItem(menuItem: MenuItem): void {
    this.itemSelected.emit(menuItem);
    this.closeMenu();
  }
}
