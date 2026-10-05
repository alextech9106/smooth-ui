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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
