import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiThemeToggleComponent } from './sui-theme-toggle.component';

describe('SuiThemeToggleComponent', () => {
  let component: SuiThemeToggleComponent;
  let fixture: ComponentFixture<SuiThemeToggleComponent>;

  beforeEach(async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));

    await TestBed.configureTestingModule({
      imports: [SuiThemeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiThemeToggleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('names the button after the theme it switches to', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme');

    button.click();
    await fixture.whenStable();

    expect(button.getAttribute('aria-label')).toBe('Switch to light theme');
  });
});
