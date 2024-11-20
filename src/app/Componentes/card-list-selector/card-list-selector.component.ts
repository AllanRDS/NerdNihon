import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { of, timer } from 'rxjs';
import { delay, catchError, finalize, switchMap, retryWhen, take } from 'rxjs/operators';

@Component({
  selector: 'cardSelector',
  templateUrl: './card-list-selector.component.html',
  styleUrl: './card-list-selector.component.css'
})
export class CardListSelectorComponent implements OnInit {
  animes: any[] = [];
  movies: any[] = [];
  filteredList: any[] = [];
  currentCategory: 'animes' | 'filmes' | 'outra' = 'animes';

  isLoading: boolean = false;
  loadError: string | null = null;

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.loadInitialContent();
  }

  loadInitialContent() {
    this.isLoading = true;
    this.loadError = null;

    of(null).pipe(
      delay(0),
      finalize(() => this.loadAnimes())
    ).subscribe();
  }

  loadAnimes() {
    this.isLoading = true;
    this.animeService.getTopAnime().pipe(
      delay(1000),
      catchError(err => {
        this.loadError = 'Erro ao carregar animes';
        console.error('Erro ao carregar animes', err);
        return of(null);
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(2000), // Delay de 2 segundos antes de tentar novamente
          take(3) // Tenta até 3 vezes
        )
      ),
      finalize(() => {
        this.loadMovies();
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          this.animes = response.data.slice(0, 18);
          if (this.currentCategory === 'animes') {
            this.filteredList = this.animes;
          }
        }
      }
    });
  }

  loadMovies() {
    this.animeService.getTopMovie().pipe(
      delay(1000),
      catchError(err => {
        this.loadError = 'Erro ao carregar filmes';
        console.error('Erro ao carregar filmes', err);
        return of(null);
      }),
      retryWhen(errors =>
        errors.pipe(
          delay(2000), // Delay de 2 segundos antes de tentar novamente
          take(3) // Tenta até 3 vezes
        )
      ),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          this.movies = response.data.slice(0, 18);
        }
      }
    });
  }

  selectCategory(category: 'animes' | 'filmes' | 'outra') {
    this.currentCategory = category;

    switch(category) {
      case 'animes':
        this.filteredList = this.animes;
        break;
      case 'filmes':
        this.filteredList = this.movies;
        break;
      case 'outra':
        this.filteredList = []; // Adicione lógica para outra categoria se necessário
        break;
    }
  }
}