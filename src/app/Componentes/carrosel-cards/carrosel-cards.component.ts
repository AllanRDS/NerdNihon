import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';

@Component({
  selector: 'carrosel-cards',
  templateUrl: './carrosel-cards.component.html',
  styleUrls: ['./carrosel-cards.component.css'] // Corrigido 'styleUrl' para 'styleUrls'
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
          this.seasonUpcomingList = response.data.slice(0, 10); // Limitar a quantidade de animes a serem exibidos
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

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft; // Mudei para pegar a posição de rolagem atual
    this.carousel.nativeElement.style.cursor = 'grabbing';
  }

  endDrag() {
    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  drag(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Aumenta a velocidade do deslizamento
    let newScrollLeft = this.scrollLeft - walk; // Calcular nova posição de rolagem

    // Limita o deslizar para não passar do primeiro e do último card
    const maxScrollLeft = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;

    if (newScrollLeft < 0) {
      newScrollLeft = 0; // Limite para não passar do primeiro card
    } else if (newScrollLeft > maxScrollLeft) {
      newScrollLeft = maxScrollLeft; // Limite para não passar do último card
    }

    this.carousel.nativeElement.scrollLeft = newScrollLeft; // Atualiza a posição de rolagem
  }

  preventDrag(event: DragEvent) {
    event.preventDefault(); // Previne o comportamento padrão de arrastar
  }
}