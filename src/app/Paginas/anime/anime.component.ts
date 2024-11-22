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
  totalPages: number = 1;

  genres: any[] = [];
  years: string[] = [];

  // Flag para identificar se é uma busca inicial ou filtrada
  private isInitialLoad: boolean = true;

  constructor(private animeFilterService: AnimefilterService) {}

  ngOnInit() {
    this.animeFilterService.loadGenreMapping().subscribe({
      next: () => {
        this.loadGenres();
        this.loadYears();
        this.loadInitialAnimes();
      },
      error: (error) => {
        console.error('Erro ao carregar mapeamento de gêneros', error);
        this.loadGenres();
        this.loadYears();
        this.loadInitialAnimes();
      }
    });
  }

  loadGenres() {
    this.animeFilterService.getAnimeGenres().subscribe({
      next: (response) => {
        this.genres = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar gêneros', error);
      }
    });
  }

  loadYears() {
    this.years = this.animeFilterService.getAnimeYears();
  }

  loadInitialAnimes() {
    this.isLoading = true;
    this.isInitialLoad = true;
    this.animeFilterService.getInitialAnimes(this.currentPage).subscribe({
      next: (response) => {
        this.animes = response.data;
        this.totalPages = response.pagination.last_visible_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar animes iniciais', error);
        this.isLoading = false;
      }
    });
  }

  searchAnimes() {
    this.isLoading = true;
    this.isInitialLoad = false;

    this.animeFilterService.getFilteredAnimes(
      this.searchTerm,
      this.currentPage,
      this.selectedGenre,
      this.selectedYear
    ).subscribe({
      next: (response) => {
        this.animes = response.data;
        this.totalPages = response.pagination.last_visible_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar animes', error);
        this.animes = [];
        this.totalPages = 1;
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchAnimes();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPage();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPage();
    }
  }

  loadPage() {
    if (this.isInitialLoad) {
      this.loadInitialAnimes();
    } else {
      this.searchAnimes();
    }
  }

  onSearchEnter() {
    this.currentPage = 1;
    this.searchAnimes();
  }
}