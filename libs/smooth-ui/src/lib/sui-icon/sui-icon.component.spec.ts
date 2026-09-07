import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiIconComponent } from './sui-icon.component';

describe('SuiIconComponent', () => {
  let component: SuiIconComponent;
  let fixture: ComponentFixture<SuiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiIconComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
