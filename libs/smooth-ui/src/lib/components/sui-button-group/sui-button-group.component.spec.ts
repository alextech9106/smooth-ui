import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockInstance } from 'vitest';
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

  describe('text entries', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('names an entry after a label that does not contain its name, reporting nothing', async () => {
      const error: MockInstance<typeof console.error> = vi.spyOn(console, 'error');
      const warn: MockInstance<typeof console.warn> = vi.spyOn(console, 'warn');

      fixture.componentRef.setInput('buttons', [{ name: 'Bold', label: 'Italic' }]);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Italic');
      expect(button.textContent?.trim()).toBe('Bold');
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
    });

    it('names an icon entry with a blank name after its label', async () => {
      fixture.componentRef.setInput('buttons', [{ name: '', icon: 'check', label: 'Bold' }]);
      await fixture.whenStable();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('aria-label')).toBe('Bold');
    });
  });
});
