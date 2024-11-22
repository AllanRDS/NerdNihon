import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';

@Component({
  selector: 'carrosel-cards',
  templateUrl: './carrosel-cards.component.html',
  styleUrls: ['./carrosel-cards.component.css']
})
export class CarroselCardsComponent {
  @ViewChild('carousel') carousel!: ElementRef;

  seasonUpcomingList: any[] = [];
  isDragging = false;
  startX: number = 0;
  scrollLeft: number = 0;

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.getUpcomingSeason();
  }

  getUpcomingSeason() {
    this.animeService.getSeasonUpcoming().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.seasonUpcomingList = response.data.slice(0, 20);
          console.log(this.seasonUpcomingList);
        } else {
          console.error('Resposta inválida:', response);
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar a lista de animes para lançar:', error);
        alert("Erro ao carregar a lista da temporada seguinte");
      }
    });
  }

  // Método para iniciar arrasto com mouse
  startDrag(event: MouseEvent) {
    this.initDrag(this.getClientX(event));
  }

  // Método para iniciar arrasto com touch
  startTouch(event: TouchEvent) {
    this.initDrag(this.getClientX(event));
    event.preventDefault(); // Previne scroll padrão
  }

  // Método genérico para iniciar arrasto
  private initDrag(clientX: number) {
    this.isDragging = true;
    this.startX = clientX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.carousel.nativeElement.style.cursor = 'grabbing';
  }

  // Método de arrasto
  drag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    const clientX = this.getClientX(event);
    const x = clientX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;

    let newScrollLeft = this.scrollLeft - walk;
    const maxScrollLeft = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;

    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    } else if (newScrollLeft > maxScrollLeft) {
      newScrollLeft = maxScrollLeft;
    }

    this.carousel.nativeElement.scrollLeft = newScrollLeft;
  }

  // Método para finalizar arrasto
  endDrag() {
    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  // Método para obter coordenada X de forma genérica
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.clientX
      : event.touches[0].clientX;
  }

  // Prevenir comportamento padrão de arrasto
  preventDrag(event: DragEvent) {
    event.preventDefault();
  }
}