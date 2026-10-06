import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiErrorComponent } from './sui-error.component';

describe('SuiErrorComponent', () => {
  let component: SuiErrorComponent;
  let fixture: ComponentFixture<SuiErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the error message', async () => {
    fixture.componentRef.setInput('error', 'Required field');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.sui-error').textContent).toBe('Required field');
  });
});
