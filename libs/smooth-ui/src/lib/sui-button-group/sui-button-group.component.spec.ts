import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiButtonGroupComponent } from './sui-button-group.component';

describe('SuiButtonGroupComponent', () => {
  let component: SuiButtonGroupComponent;
  let fixture: ComponentFixture<SuiButtonGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonGroupComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
