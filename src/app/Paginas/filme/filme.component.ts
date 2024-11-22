import { Component, OnInit } from '@angular/core';
import { MoviefilterService } from '../../Services/moviefilter.service';

@Component({
  selector: 'app-filme',
  templateUrl: './filme.component.html',
  styleUrls: ['./filme.component.css']
})
export class FilmeComponent implements OnInit {
  filmes: any[] = [];
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

  constructor(private moviefilterService: MoviefilterService) {}

  ngOnInit() {
    this.moviefilterService.loadGenreMapping().subscribe({
      next: () => {
        this.loadGenres();
        this.loadYears();
        this.loadInitialFilmes();
      },
      error: (error) => {
        console.error('Erro ao carregar mapeamento de gêneros', error);
        this.loadGenres();
        this.loadYears();
        this.loadInitialFilmes();
      }
    });
  }

  // Método para extrair o ano do filme
  extractYear(filme: any): string {
    // Primeiro, tenta pegar o ano de aired.prop.from
    if (filme.aired?.prop?.from?.year) {
      return filme.aired.prop.from.year.toString();
    }

    // Se não existir, tenta o atributo year
    if (filme.year) {
      return filme.year.toString();
    }

    // Se nada funcionar, retorna 'N/A'
    return 'N/A';
  }

  loadGenres() {
    this.moviefilterService.getAnimeGenres().subscribe({
      next: (response) => {
        this.genres = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar gêneros', error);
      }
    });
  }

  loadYears() {
    this.years = this.moviefilterService.getFilmesYears();
  }

  loadInitialFilmes() {
    this.isLoading = true;
    this.isInitialLoad = true;
    this.moviefilterService.getInitialFilmes(this.currentPage).subscribe({
      next: (response) => {
        this.filmes = response.data;
        this.totalPages = response.pagination.last_visible_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar filmes iniciais', error);
        this.isLoading = false;
      }
    });
  }

  searchFilmes() {
    this.isLoading = true;
    this.isInitialLoad = false;

    this.moviefilterService.getFilteredFilmes(
      this.searchTerm,
      this.currentPage,
      this.selectedGenre,
      this.selectedYear
    ).subscribe({
      next: (response) => {
        this.filmes = response.data;
        this.totalPages = response.pagination.last_visible_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar filmes', error);
        this.filmes = [];
        this.totalPages = 1;
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchFilmes();
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
      this.loadInitialFilmes();
    } else {
      this.searchFilmes();
    }
  }

  onSearchEnter() {
    this.currentPage = 1;
    this.searchFilmes();
  }
}