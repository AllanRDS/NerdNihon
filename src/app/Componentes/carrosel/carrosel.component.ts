import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrls: ['./carrosel.component.css']
})
export class CarroselComponent implements OnInit, OnDestroy {
  currentSlide: number = 0; // Slide atual
  limitedAnimeList: any[] = []; // Lista limitada de animes a serem exibidos
  slideInterval: any; // Intervalo para mudança automática de slides

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.getCurrentSeason(); // Carrega os animes da temporada atual
    this.startSlideShow(); // Inicia a apresentação de slides automática
  }

  ngOnDestroy() {
    this.stopSlideShow(); // Para a apresentação de slides automática ao destruir o componente
  }

  getCurrentSeason() {
    this.animeService.getCurrentAnimeSeason().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.limitedAnimeList = response.data.slice(0, 5); // Limitar a quantidade de animes a serem exibidos (exibindo no máximo 5)
          this.currentSlide = 0; // Reseta o slide atual após carregar os dados
        } else {
          console.error('Resposta inválida:', response);
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar a temporada atual:', error);
        alert("Erro ao carregar a lista da temporada atual");
      }
    });
  }

  // Inicia a apresentação de slides automática
  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000); // Muda o slide a cada 20 segundos
  }

  // Para a apresentação de slides automática
  stopSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  // Função para avançar o slide
  nextSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.limitedAnimeList.length;
    }
  }

  // Função para voltar o slide
  prevSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.limitedAnimeList.length) % this.limitedAnimeList.length;
    }
  }
}