import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[hoverZoomList]'
})
export class HoverZoomListDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.applyHoverEffects();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resetHoverEffects();
  }

  private applyHoverEffects() {
    const content = this.el.nativeElement.querySelector('.card-content');
    const starIcon = this.el.nativeElement.querySelector('ion-icon');

    // Aumentar a opacidade e aplicar efeito de zoom
    if (content) {
      this.renderer.setStyle(content, 'opacity', '1'); // Aumenta a opacidade do texto
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)'); // Aplica o efeito de zoom
    }
    if (starIcon) {
      this.renderer.setStyle(starIcon, 'opacity', '1'); // Aumenta a opacidade do ícone
    }
  }

  private resetHoverEffects() {
    const content = this.el.nativeElement.querySelector('.card-content');
    const starIcon = this.el.nativeElement.querySelector('ion-icon');

    // Reduzir a opacidade e remover o efeito de zoom
    if (content) {
      this.renderer.setStyle(content, 'opacity', '0'); // Reduz a opacidade do texto para 0
      this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)'); // Remove o efeito de zoom
    }
    if (starIcon) {
      this.renderer.setStyle(starIcon, 'opacity', '0'); // Reduz a opacidade do ícone para 0
    }
  }
}