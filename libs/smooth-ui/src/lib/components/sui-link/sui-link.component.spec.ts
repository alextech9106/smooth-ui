import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SuiLinkComponent } from './sui-link.component';

describe('SuiLinkComponent', () => {
  let component: SuiLinkComponent;
  let fixture: ComponentFixture<SuiLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiLinkComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiLinkComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('url', '/');
    fixture.componentRef.setInput('title', 'Link');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the given url', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/');
    expect(link.hasAttribute('aria-disabled')).toBe(false);
  });

  it('removes the href and exposes the disabled state', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('opens external links safely and announces the new tab', async () => {
    fixture.componentRef.setInput('url', 'https://angular.dev/');
    fixture.componentRef.setInput('external', true);
    await fixture.whenStable();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('https://angular.dev/');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.textContent).toContain('(opens in a new tab)');
  });

  it('removes the href of a disabled external link', async () => {
    fixture.componentRef.setInput('url', 'https://angular.dev/');
    fixture.componentRef.setInput('external', true);
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });
});
