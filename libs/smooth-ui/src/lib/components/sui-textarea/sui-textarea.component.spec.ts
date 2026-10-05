import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextareaComponent } from './sui-textarea.component';

describe('SuiTextareaComponent', () => {
  let component: SuiTextareaComponent<string>;
  let fixture: ComponentFixture<SuiTextareaComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent<SuiTextareaComponent<string>>(SuiTextareaComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Label');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
