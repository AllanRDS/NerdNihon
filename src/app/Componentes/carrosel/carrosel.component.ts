import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import {
  Subject,
  Observable,
  of,
  throwError
} from 'rxjs';
import {
  takeUntil,
  catchError,
  finalize,
  tap,
  switchMap,
  delay
} from 'rxjs/operators';

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrls: ['./carrosel.component.css']
})
export class CarroselComponent implements OnInit, OnDestroy {
  currentSlide: number = 0;
  limitedAnimeList: any[] = [];
  slideInterval: any;

  isLoading: boolean = false;
  loadError: string | null = null;

  // Controle de concorrência
  private destroy$ = new Subject<void>();
  private loadingQueue$ = new Subject<void>();

  constructor(
    private animeService: AnimeService
  ) {}

  ngOnInit() {
    // Fila de carregamento para evitar sobrecarga
    this.loadingQueue$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.safeLoadAnimes())
      )
      .subscribe();

    // Iniciar carregamento com um pequeno atraso
    setTimeout(() => this.requestAnimeLoad(), 500);
  }

  ngOnDestroy() {
    this.stopSlideShow();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método seguro para carregar animes
  private safeLoadAnimes(): Observable<any> {
    // Previne múltiplas requisições simultâneas
    if (this.isLoading) {
      return of(null);
    }

    this.isLoading = true;
    this.loadError = null;

    return this.animeService.getCurrentAnimeSeason().pipe(
      // Adiciona um pequeno atraso para evitar contenção
      delay(300),

      // Filtra e processa os dados
      tap(response => {
        if (response?.data?.length) {
          // Filtro rigoroso
          const validAnimes = response.data.filter((anime: any) =>
            anime.trailer?.images?.maximum_image_url &&
            anime.genres?.length > 0
          );

          // Limita a quantidade de animes
          this.limitedAnimeList = validAnimes.slice(0, 5);

          // Reseta o slide
          this.currentSlide = 0;

          // Inicia o slideshow
          this.startSlideShow();
        } else {
          throw new Error('Sem dados válidos');
        }
      }),

      // Tratamento de erros
      catchError(error => {
        console.error('Erro no carrossel:', error);
        this.loadError = 'Falha ao carregar animes';
        return throwError(() => error);
      }),

      // Finaliza o estado de carregamento
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  // Método para solicitar carregamento
  requestAnimeLoad() {
    // Adiciona à fila de carregamento
    this.loadingQueue$.next();
  }

  // Métodos de navegação de slide (mantidos igual)
  startSlideShow() {
    this.stopSlideShow();
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  stopSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.limitedAnimeList.length;
    }
  }

  prevSlide() {
    if (this.limitedAnimeList.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.limitedAnimeList.length) % this.limitedAnimeList.length;
    }
  }

  // Método para recarregar manualmente
  reloadAnimes() {
    this.requestAnimeLoad();
  }
}