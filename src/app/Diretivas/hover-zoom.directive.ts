import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverZoom]'
})
export class HoverZoomDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.applyHoverEffects();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHoverEffects();
  }

  private applyHoverEffects() {
    // Aplica o efeito de zoom a todos os elementos filhos
    const children = this.el.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      this.renderer.setStyle(children[i], 'transform', 'scale(1.05)');
      this.renderer.setStyle(children[i], 'transition', 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)');
    }
  }

  private removeHoverEffects() {
    // Retorna ao estado original
    const children = this.el.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      this.renderer.setStyle(children[i], 'transform', 'scale(1)');
    }
  }
}