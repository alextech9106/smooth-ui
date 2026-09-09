import { SuiIconButtonComponent } from '@alextech9106/smooth-ui';
import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'sui-theme-toggle',
  imports: [SuiIconButtonComponent],
  templateUrl: './sui-theme-toggle.component.html',
  styleUrl: './sui-theme-toggle.component.scss',
})
export class SuiThemeToggleComponent {
  protected readonly theme: ThemeService = inject(ThemeService);
}
