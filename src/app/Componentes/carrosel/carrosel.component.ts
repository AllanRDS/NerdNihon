import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../Services/anime.service'; // Serviço para obter dados dos animes

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrls: ['./carrosel.component.css']
})
export class CarroselComponent implements OnInit {
  currentSlide: number = 0; // Slide atual
  currentSeasonList: any[] = []; // Lista de animes da temporada atual
  limitedAnimeList: any[] = []; // Lista limitada de animes a serem exibidos (max 5)
  loading: boolean = true;

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.getCurrentSeason(); // Carrega os animes da temporada atual
  }

  getCurrentSeason() {
    this.animeService.getCurrentAnimeSeason().subscribe({
      next: (response: any) => {
        this.currentSeasonList = response.data;
        // Limitar a quantidade de animes a serem exibidos (exibindo no máximo 5)
        this.limitedAnimeList = this.currentSeasonList.slice(0, 5);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar a temporada atual:', error);
        alert("Erro ao carregar a lista da temporada atual");
        this.loading = false;
      }
    });
  }

  // Função para avançar o slide
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.limitedAnimeList.length;
  }

  // Função para voltar o slide
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.limitedAnimeList.length) % this.limitedAnimeList.length;
  }
}
