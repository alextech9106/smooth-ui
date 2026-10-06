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
    fixture.componentRef.setInput('buttons', []);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('names icon buttons after the button name', async () => {
    fixture.componentRef.setInput('type', 'icon');
    fixture.componentRef.setInput('buttons', [
      { name: 'Bold', icon: 'check' },
      { name: 'Italic', icon: 'x' },
    ]);
    await fixture.whenStable();

    const labels: (string | null)[] = Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['Bold', 'Italic']);
  });
});
