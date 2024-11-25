import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HoverZoomListDirective } from './hover-zoom-list.directive';
import { Component, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  template: `
    <div hoverZoomList>
      <div class="card-item">Card 1</div>
      <div class="card-item">Card 2</div>
    </div>
  `,
})
class TestComponent {}

describe('HoverZoomListDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HoverZoomListDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const elementRef = new ElementRef(fixture.nativeElement.querySelector('div[hoverZoomList]'));
    const renderer = TestBed.inject(Renderer2); // Obtém o Renderer2 do TestBed
    const directive = new HoverZoomListDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });

  it('should apply hover effects on mouse enter', () => {
    const div = fixture.nativeElement.querySelector('div[hoverZoomList]');
    const cardItems = div.children;

    // Simula o evento mouseenter
    div.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();

    // Verifica se o estilo foi aplicado
    for (let i = 0; i < cardItems.length; i++) {
      expect(cardItems[i].style.transform).toBe('scale(1.03)');
      expect(cardItems[i].style.transition).toBe('transform 0.4s ease');
    }
  });

  it('should remove hover effects on mouse leave', () => {
    const div = fixture.nativeElement.querySelector('div[hoverZoomList]');
    const cardItems = div.children;

    // Simula o evento mouseleave
    div.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();

    // Verifica se o estilo foi removido
    for (let i = 0; i < cardItems.length; i++) {
      expect(cardItems[i].style.transform).toBe('scale(1)');
    }
  });
});