import { Directive, ElementRef, Renderer2, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[hoverZoomList]'
})
export class HoverZoomListDirective implements OnDestroy {
  private resizeListener: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.resizeListener = this.onResize.bind(this);
    window.addEventListener('resize', this.resizeListener);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.applyHoverEffects();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resetHoverEffects();
  }

  private applyHoverEffects() {
    const content = this.el.nativeElement.querySelector('.card-content');
    const starIcon = this.el.nativeElement.querySelector('ion-icon');

    if (window.innerWidth >= 768) {
      if (content) {
        this.renderer.setStyle(content, 'opacity', '1');
      }
      if (starIcon) {
        this.renderer.setStyle(starIcon, 'opacity', '1');
      }
    }

    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)');
  }

  private resetHoverEffects() {
    const content = this.el.nativeElement.querySelector('.card-content');
    const starIcon = this.el.nativeElement.querySelector('ion-icon');

    if (window.innerWidth >= 768) {
      if (content) {
        this.renderer.setStyle(content, 'opacity', '0');
      }
      if (starIcon) {
        this.renderer.setStyle(starIcon, 'opacity', '0');
      }
    }
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
  }

  private onResize() {
    if (window.innerWidth < 768) {
      const content = this.el.nativeElement.querySelector('.card-content');
      const starIcon = this.el.nativeElement.querySelector('ion-icon');

      if (content) {
        this.renderer.setStyle(content, 'opacity', '1');
      }
      if (starIcon) {
        this.renderer.setStyle(starIcon, 'opacity', '1');
      }
    }
    else if (window.innerWidth > 768) {
      const content = this.el.nativeElement.querySelector('.card-content');
      const starIcon = this.el.nativeElement.querySelector('ion-icon');

      if (content) {
        this.renderer.setStyle(content, 'opacity', '0');
      }
      if (starIcon) {
        this.renderer.setStyle(starIcon, 'opacity', '0');
      }
    }
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }
}