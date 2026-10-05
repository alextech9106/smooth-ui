import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextFieldComponent } from './sui-text-field.component';

describe('SuiTextFieldComponent', () => {
  let component: SuiTextFieldComponent<string | number | null>;
  let fixture: ComponentFixture<SuiTextFieldComponent<string | number | null>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiTextFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Label');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
