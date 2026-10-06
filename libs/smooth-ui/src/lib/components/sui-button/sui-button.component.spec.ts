import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiButtonComponent } from './sui-button.component';

describe('SuiButtonComponent', () => {
  let component: SuiButtonComponent;
  let fixture: ComponentFixture<SuiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonComponent);
    fixture.componentRef.setInput('name', 'Test');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits trigger when clicked', () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);

    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(1);
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

  it('keeps its accessible name and blocks clicks while loading', async () => {
    let emitted: number = 0;
    component.trigger.subscribe(() => emitted++);
    fixture.componentRef.setInput('loading', true);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(button.getAttribute('aria-label')).toBe('Test');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(emitted).toBe(0);
  });

  it('prefers the label as accessible name and exposes the expanded state', async () => {
    fixture.componentRef.setInput('label', 'More options');
    fixture.componentRef.setInput('expanded', false);
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('More options');
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('uses the icon as accessible name when there is no text', async () => {
    fixture.componentRef.setInput('name', '');
    fixture.componentRef.setInput('icon', 'check');
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('check');
  });
});
