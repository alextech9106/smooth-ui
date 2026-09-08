import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiButtonSplitComponent } from './sui-button-split.component';

describe('SuiButtonSplitComponent', () => {
  let component: SuiButtonSplitComponent;
  let fixture: ComponentFixture<SuiButtonSplitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiButtonSplitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiButtonSplitComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
