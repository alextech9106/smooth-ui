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
});
