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

  constructor(private moviefilterService: MoviefilterService) {}

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoading = true;

    // Carregar mapeamento de gêneros
    this.moviefilterService.loadGenreMapping().subscribe({
      next: () => {
        // Carregar filmes iniciais
        this.getInitialFilmes();

        // Carregar gêneros
        this.loadGenres();

        // Carregar anos
        this.loadYears();
      },
      error: (error) => {
        console.error('Erro ao carregar mapeamento de gêneros', error);
        this.isLoading = false;
      }
    });
  }

  getInitialFilmes() {
    this.isLoading = true;
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

  searchFilmes() {
    this.isLoading = true;
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
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.currentPage = 1;
    this.searchFilmes();
  }

  // Método para extrair o ano do filme
  extractYear(filme: any): string {

    if (filme.aired?.from) {
      return new Date(filme.aired.from).getFullYear().toString();
    }

    return 'N/A';
  }

  // Métodos de paginação
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchFilmes();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchFilmes();
      this.scrollToTop();

    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.searchFilmes();
    }
  }
  scrollToTop() {
    // Método 1: Usando window.scrollTo
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


}