import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiIconComponent } from './sui-icon.component';

function drawingsCopies(): Element[] {
  return Array.from(document.body.children).filter((element: Element) => element.querySelector('symbol') !== null);
}

function removeDrawingsCopies(): void {
  drawingsCopies().forEach((copy: Element) => copy.remove());
}

async function createIcon(name: string, size?: number): Promise<ComponentFixture<SuiIconComponent>> {
  const iconFixture: ComponentFixture<SuiIconComponent> = TestBed.createComponent(SuiIconComponent);
  iconFixture.componentRef.setInput('name', name);
  if (size !== undefined) iconFixture.componentRef.setInput('size', size);
  await iconFixture.whenStable();

  return iconFixture;
}

describe('SuiIconComponent', () => {
  let component: SuiIconComponent;
  let fixture: ComponentFixture<SuiIconComponent>;

  beforeEach(async () => {
    removeDrawingsCopies();

    await TestBed.configureTestingModule({
      imports: [SuiIconComponent],
    }).compileComponents();

    fixture = await createIcon('check');
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('hides the decorative svg from assistive technology', () => {
    const svg: SVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
  });

  it('keeps the icon out of the keyboard focus order', () => {
    const host: HTMLElement = fixture.nativeElement;

    expect(host.hasAttribute('tabindex')).toBe(false);
    expect(host.querySelectorAll('[tabindex]')).toHaveLength(0);
  });

  describe('name of the built-in set', () => {
    it('points at the drawing with that name', () => {
      const use: SVGUseElement = fixture.nativeElement.querySelector('use');

      expect(use.getAttribute('href')).toBe('#check');
    });

    it('finds that drawing on the page', () => {
      const drawings: NodeListOf<Element> = document.querySelectorAll('[id="check"]');

      expect(drawings).toHaveLength(1);
      expect(drawings[0].tagName.toLowerCase()).toBe('symbol');
    });

    it('draws every icon in the colour of the surrounding text', () => {
      const drawings: Element[] = Array.from(document.querySelectorAll('symbol'));
      const coloured: Element[] = drawings.filter(
        (drawing: Element) => drawing.getAttribute('stroke') === 'currentColor' || drawing.getAttribute('fill') === 'currentColor',
      );

      expect(drawings.length).toBeGreaterThan(0);
      expect(coloured).toHaveLength(drawings.length);
    });
  });

  describe('name that is not in the built-in set', () => {
    const names: string[] = ['does-not-exist', '', 'Check', ' check'];

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it.each(names)('raises no error and writes nothing to the console for "%s"', async (name: string) => {
      const error = vi.spyOn(console, 'error');
      const warn = vi.spyOn(console, 'warn');
      const log = vi.spyOn(console, 'log');

      await expect(createIcon(name)).resolves.toBeInstanceOf(ComponentFixture);
      expect(error).not.toHaveBeenCalled();
      expect(warn).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
    });

    it.each(names)('keeps the requested size for "%s"', async (name: string) => {
      const iconFixture: ComponentFixture<SuiIconComponent> = await createIcon(name, 32);
      const svg: SVGElement = iconFixture.nativeElement.querySelector('svg');

      expect(svg.getAttribute('width')).toBe('32');
      expect(svg.getAttribute('height')).toBe('32');
    });

    it.each(names)('finds no element with the identifier "%s" on the page', async (name: string) => {
      await createIcon(name);

      expect(document.querySelectorAll(`[id="${name}"]`)).toHaveLength(0);
    });
  });

  describe('size', () => {
    it('uses a size of 20 when no size is given', () => {
      const svg: SVGElement = fixture.nativeElement.querySelector('svg');

      expect(svg.getAttribute('width')).toBe('20');
      expect(svg.getAttribute('height')).toBe('20');
    });

    it('draws the icon in a square of the given size', async () => {
      const iconFixture: ComponentFixture<SuiIconComponent> = await createIcon('check', 32);
      const svg: SVGElement = iconFixture.nativeElement.querySelector('svg');

      expect(svg.getAttribute('width')).toBe('32');
      expect(svg.getAttribute('height')).toBe('32');
    });
  });

  describe('changes to a displayed icon', () => {
    it('points at the new drawing when the name changes', async () => {
      fixture.componentRef.setInput('name', 'x');
      await fixture.whenStable();
      const use: SVGUseElement = fixture.nativeElement.querySelector('use');

      expect(use.getAttribute('href')).toBe('#x');
    });

    it('takes the new size when the size changes', async () => {
      fixture.componentRef.setInput('size', 48);
      await fixture.whenStable();
      const svg: SVGElement = fixture.nativeElement.querySelector('svg');

      expect(svg.getAttribute('width')).toBe('48');
      expect(svg.getAttribute('height')).toBe('48');
    });
  });

  describe('copy of the drawings', () => {
    it('adds exactly one copy when the application displays its first icon', () => {
      expect(drawingsCopies()).toHaveLength(1);
    });

    it('adds no copy for a second icon in the same application', async () => {
      await createIcon('x');

      expect(drawingsCopies()).toHaveLength(1);
    });

    it('removes no copy when an icon is destroyed', () => {
      fixture.destroy();

      expect(drawingsCopies()).toHaveLength(1);
    });

    it('adds a second copy for a second application', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [SuiIconComponent],
      }).compileComponents();
      await createIcon('check');

      expect(drawingsCopies()).toHaveLength(2);
    });
  });

  describe('page rendered outside a browser', () => {
    beforeEach(async () => {
      TestBed.resetTestingModule();
      removeDrawingsCopies();

      await TestBed.configureTestingModule({
        imports: [SuiIconComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      }).compileComponents();
    });

    it('raises no error when an icon is created', async () => {
      await expect(createIcon('check')).resolves.toBeInstanceOf(ComponentFixture);
    });

    it('adds no copy of the drawings', async () => {
      await createIcon('check');

      expect(drawingsCopies()).toHaveLength(0);
    });
  });
});
