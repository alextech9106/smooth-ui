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
});
