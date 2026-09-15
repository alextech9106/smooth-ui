import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextFieldComponent } from './sui-text-field.component';

describe('SuiTextFieldComponent', () => {
  let component: SuiTextFieldComponent;
  let fixture: ComponentFixture<SuiTextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiTextFieldComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
