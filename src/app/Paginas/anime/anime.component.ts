import { Component, OnInit } from '@angular/core';
import { AnimefilterService } from '../../Services/animefilter.service';

@Component({
  selector: 'app-anime',
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.css']
})
export class AnimeComponent implements OnInit {
  animes: any[] = [];
  searchTerm: string = '';
  selectedGenre: string = '';
  selectedYear: string = '';
  isLoading: boolean = false;
  currentPage: number = 1;

  genres: any[] = [];
  years: string[] = [];

  constructor(private animeFilterService: AnimefilterService) {}

  ngOnInit() {
    this.loadGenres();
    this.loadYears();
    this.searchAnimes();
  }

  loadGenres() {
    this.animeFilterService.getAnimeGenres().subscribe({
      next: (response) => {
        this.genres = response.data.map((genre: any) => genre.name);
      },
      error: (error) => {
        console.error('Erro ao carregar gêneros', error);
      }
    });
  }

  loadYears() {
    this.years = this.animeFilterService.getAnimeYears();
  }

  searchAnimes() {
    this.currentPage = 1; // Adicionando esta linha
    this.isLoading = true;
    this.animeFilterService.getFilteredAnimes(
      this.searchTerm,
      this.currentPage,
      this.selectedGenre,
      this.selectedYear
    ).subscribe({
      next: (response) => {
        this.animes = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar animes', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchAnimes();
  }

  nextPage() {
    this.currentPage++;
    this.searchAnimes();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchAnimes();
    }
  }
}