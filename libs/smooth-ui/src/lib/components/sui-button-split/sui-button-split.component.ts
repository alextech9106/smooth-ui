import { NgClass } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  signal,
  Signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { SuiButton } from '../../interfaces/sui-button.interface';
import { SUI_BUTTON_SHAPE } from '../../types/sui-button-shape.type';
import { SUI_BUTTON_SIZE } from '../../types/sui-button-size.type';
import { SuiButtonGroupComponent } from '../sui-button-group/sui-button-group.component';
import { SuiIconComponent } from '../sui-icon/sui-icon.component';
import { SUI_BUTTON_SPLIT_MODE } from './type/sui-button-split-mode.type';
import { SUI_BUTTON_SPLIT_PLACEMENT } from './type/sui-button-split-placement.type';
import { SUI_BUTTON_SPLIT_VARIANT } from './type/sui-button-split-variant.type';

@Component({
  selector: 'sui-button-split',
  imports: [SuiButtonGroupComponent, SuiIconComponent, NgClass],
  templateUrl: './sui-button-split.component.html',
  styleUrl: './sui-button-split.component.scss',
  host: { '(document:pointerdown)': 'onOutsidePointerDown($event)' },
})
export class SuiButtonSplitComponent {
  private readonly _injector: Injector = inject(Injector);
  private readonly _hostEl: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _menuElement: Signal<ElementRef<HTMLElement> | undefined> = viewChild('menu');

  public icon: InputSignal<string> = input<string>('');
  public name: InputSignal<string> = input<string>('');
  public menuItems: InputSignal<MenuItem[]> = input<MenuItem[]>([]);
  public mode: InputSignal<SUI_BUTTON_SPLIT_MODE> = input<SUI_BUTTON_SPLIT_MODE>('default');
  public shape: InputSignal<SUI_BUTTON_SHAPE> = input<SUI_BUTTON_SHAPE>('flat');
  public size: InputSignal<SUI_BUTTON_SIZE> = input<SUI_BUTTON_SIZE>('md');
  public variant: InputSignal<SUI_BUTTON_SPLIT_VARIANT> = input<SUI_BUTTON_SPLIT_VARIANT>('ghost');

  protected readonly menuOpen: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly placement: WritableSignal<SUI_BUTTON_SPLIT_PLACEMENT> = signal<SUI_BUTTON_SPLIT_PLACEMENT>('bottom');

  protected readonly buttonSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: this.name() },
    { name: '', icon: 'chevron-down', callback: () => this.toggleMenu() },
  ]);

  protected readonly iconSplit: Signal<SuiButton[]> = computed<SuiButton[]>(() => [
    { name: '', icon: this.icon() },
    { name: '', icon: 'chevron-down', callback: () => this.toggleMenu() },
  ]);

  private _resolvePlacement(): void {
    const trigger: DOMRect = this._hostEl.nativeElement.getBoundingClientRect();
    const menuHeight: number = this._menuElement()?.nativeElement.offsetHeight ?? 0;
    const spaceBelow: number = window.innerHeight - trigger.bottom;
    this.placement.set(spaceBelow < menuHeight && trigger.top > spaceBelow ? 'top' : 'bottom');
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
      afterNextRender(() => this._resolvePlacement(), { injector: this._injector });
    }
  }
}
