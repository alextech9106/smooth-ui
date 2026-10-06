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
    fixture.componentRef.setInput('name', 'check');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the decorative svg from assistive technology', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
  });
});
