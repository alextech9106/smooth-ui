import {
  MenuItem,
  SuiButton,
  SuiButtonComponent,
  SuiButtonGroupComponent,
  SuiButtonSplitComponent,
  SuiIconButton,
  SuiIconButtonComponent,
  SuiIconComponent,
} from '@alextech9106/smooth-ui';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [
    SuiButtonComponent,
    SuiIconComponent,
    SuiIconButtonComponent,
    SuiButtonGroupComponent,
    SuiButtonSplitComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public icons: string[] = [
    'check',
    'x',
    'chevron-down',
    'chevron-up',
    'chevron-right',
    'chevron-left',
    'arrow-right',
    'arrow-left',
    'plus',
    'minus',
    'search',
    'info',
    'alert-triangle',
    'check-circle',
    'x-circle',
    'star',
    'heart',
    'user',
    'settings',
    'bell',
    'calendar',
    'mail',
    'lock',
    'eye',
    'eye-off',
    'trash',
    'edit',
    'download',
    'upload',
    'more-horizontal',
    'more-vertical',
    'filter',
    'external-link',
    'copy',
    'refresh',
    'sun',
    'moon',
    'menu',
    'home',
    'image',
    'file',
    'grid',
    'clock',
    'help',
  ];

  public buttonsGroup: SuiButton[] = [
    { name: 'Button 1', icon: 'check', selected: true },
    { name: 'Button 2', icon: 'x', selected: false },
    { name: 'Button 3', icon: 'star', selected: false },
  ];

  public iconsGroup: SuiIconButton[] = [
    { icon: 'check', selected: false },
    { icon: 'x', selected: true },
    { icon: 'star', selected: false },
  ];

  public menuItems: MenuItem[] = [
    { title: 'Item 1', icon: { name: 'check', size: 16 } },
    { title: 'Item 2', icon: { name: 'x', size: 16 }, separatorAfter: true },
    { title: 'Item 3', icon: { name: 'star', size: 16 } },
  ];
}
