import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiThemeToggleComponent } from './sui-theme-toggle.component';

describe('SuiThemeToggleComponent', () => {
  let component: SuiThemeToggleComponent;
  let fixture: ComponentFixture<SuiThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiThemeToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiThemeToggleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
