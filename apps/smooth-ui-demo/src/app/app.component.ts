import { Component } from '@angular/core';
import {
  SuiButton,
  SuiButtonComponent,
  SuiButtonGroupComponent,
  SuiIconButtonComponent,
  SuiIconComponent,
} from '@alextech9106/smooth-ui';

@Component({
  selector: 'app-root',
  imports: [SuiButtonComponent, SuiIconComponent, SuiIconButtonComponent, SuiButtonGroupComponent],
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
    { name: 'Button 1', icon: 'check' },
    { name: 'Button 2', icon: 'x' },
    { name: 'Button 3', icon: 'star' },
  ];
}
