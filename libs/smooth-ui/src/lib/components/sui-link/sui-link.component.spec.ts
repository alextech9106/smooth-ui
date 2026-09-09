import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiLinkComponent } from './sui-link.component';

describe('SuiLinkComponent', () => {
  let component: SuiLinkComponent;
  let fixture: ComponentFixture<SuiLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiLinkComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
