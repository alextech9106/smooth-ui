import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiTextareaComponent } from './sui-textarea.component';

describe('SuiTextareaComponent', () => {
  let component: SuiTextareaComponent;
  let fixture: ComponentFixture<SuiTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiTextareaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
