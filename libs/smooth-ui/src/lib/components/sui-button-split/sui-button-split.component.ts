import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButton } from '../../interfaces/sui-button.interface';
import { SUI_SHAPE } from '../../types/sui-shape.type';
import { SUI_SIZE } from '../../types/sui-size.type';
import { SuiButtonGroupComponent } from '../sui-button-group/sui-button-group.component';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_BUTTON_SPLIT_MODE } from './type/sui-button-split-mode.type';
import { SUI_BUTTON_SPLIT_PLACEMENT } from './type/sui-button-split-placement.type';
import { SUI_BUTTON_SPLIT_VARIANT } from './type/sui-button-split-variant.type';

@Component({
  selector: 'sui-button-split',
  imports: [SuiButtonGroupComponent, SuiIconComponent],
  templateUrl: './sui-button-split.component.html',
  styleUrl: './sui-button-split.component.scss',
  host: { '(document:pointerdown)': 'onOutsidePointerDown($event)', '(keydown.escape)': 'closeMenu()' },
})
export class SuiButtonSplitComponent {
  private readonly _injector: Injector = inject(Injector);
  private readonly _hostEl: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _menuElement: Signal<ElementRef<HTMLElement> | undefined> = viewChild('menu');

  public icon: InputSignal<string> = input<string>('');
  public name: InputSignal<string> = input<string>('');
  public menuItems: InputSignal<MenuItem[]> = input<MenuItem[]>([]);
  public mode: InputSignal<SUI_BUTTON_SPLIT_MODE> = input<SUI_BUTTON_SPLIT_MODE>('default');
  public shape: InputSignal<SUI_SHAPE> = input<SUI_SHAPE>('flat');
  public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');
  public variant: InputSignal<SUI_BUTTON_SPLIT_VARIANT> = input<SUI_BUTTON_SPLIT_VARIANT>('ghost');

  public itemSelected: OutputEmitterRef<MenuItem> = output<MenuItem>();
  public trigger: OutputEmitterRef<void> = output<void>();

  protected readonly menuOpen: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly placement: WritableSignal<SUI_BUTTON_SPLIT_PLACEMENT> = signal<SUI_BUTTON_SPLIT_PLACEMENT>('bottom');

  protected readonly buttonSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: this.name(), callback: () => this.trigger.emit() },
    { name: '', icon: 'chevron-down', label: 'More options', expanded: this.menuOpen(), callback: () => this.toggleMenu() },
  ]);

  protected readonly iconSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: '', icon: this.icon(), label: this.name(), callback: () => this.trigger.emit() },
    { name: '', icon: 'chevron-down', label: 'More options', expanded: this.menuOpen(), callback: () => this.toggleMenu() },
  ]);

  private _focusTrigger(): void {
    const buttons: NodeListOf<HTMLButtonElement> = this._hostEl.nativeElement.querySelectorAll<HTMLButtonElement>('sui-button-group button');
    buttons[buttons.length - 1]?.focus();
  }

  private _menuButtons(): HTMLButtonElement[] {
    return Array.from(this._menuElement()?.nativeElement.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
  }

  private _resolvePlacement(): void {
    const trigger: DOMRect = this._hostEl.nativeElement.getBoundingClientRect();
    const menuHeight: number = this._menuElement()?.nativeElement.offsetHeight ?? 0;
    const spaceBelow: number = window.innerHeight - trigger.bottom;
    this.placement.set(spaceBelow < menuHeight && trigger.top > spaceBelow ? 'top' : 'bottom');
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) return;

    this.menuOpen.set(false);
    this._focusTrigger();
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const items: HTMLButtonElement[] = this._menuButtons();
    const current: number = items.indexOf(document.activeElement as HTMLButtonElement);
    let next: number;

    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % items.length;
        break;
      case 'ArrowUp':
        next = (current - 1 + items.length) % items.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      case 'Tab':
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
    const willOpen: boolean = !this.menuOpen();
    this.menuOpen.set(willOpen);
    if (willOpen) {
      afterNextRender(
        () => {
          this._resolvePlacement();
          this._menuButtons()[0]?.focus();
        },
        { injector: this._injector },
      );
    }
  }

  protected selectItem(menuItem: MenuItem): void {
    this.itemSelected.emit(menuItem);
    this.closeMenu();
  }
}
