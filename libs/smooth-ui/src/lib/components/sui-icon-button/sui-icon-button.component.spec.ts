import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiIconButtonComponent } from './sui-icon-button.component';

describe('SuiIconButtonComponent', () => {
  let component: SuiIconButtonComponent;
  let fixture: ComponentFixture<SuiIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiIconButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiIconButtonComponent);
    fixture.componentRef.setInput('icon', 'check');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the label as accessible name', async () => {
    fixture.componentRef.setInput('label', 'Toggle theme');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Toggle theme');
  });

  it('falls back to the icon name when no label is given', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('check');
  });

  it('disables the native button and stops emitting trigger', async () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(button.disabled).toBe(true);
    expect(emitted).toBe(0);
  });
});
