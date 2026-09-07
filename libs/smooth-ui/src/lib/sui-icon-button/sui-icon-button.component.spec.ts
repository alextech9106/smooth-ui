import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiIconButtonComponent } from './sui-icon-button.component';

describe('SuiIconButtonComponent', () => {
  let component: SuiIconButtonComponent;
  let fixture: ComponentFixture<SuiIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiIconButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiIconButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
