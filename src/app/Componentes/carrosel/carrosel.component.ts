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
  delay,
  retryWhen,
  mergeMap
} from 'rxjs/operators';

interface Anime {
  mal_id: number;
  title: string;
  trailer: {
    images: {
      maximum_image_url: string;
    }
  };
  genres: any[];
  images?: {
    jpg?: {
      large_image_url?: string;
    }
  };
}

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrls: ['./carrosel.component.css']
})
export class CarroselComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  limitedAnimeList: Anime[] = [];
  slideInterval: any;

  isLoading = false;
  loadError: string | null = null;

  // Configurações de retry
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 segundos

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
      .subscribe({
        error: (err) => {
          console.error('Erro na fila de carregamento:', err);
          this.loadError = this.getErrorMessage(err);
        }
      });

    // Iniciar carregamento com um pequeno atraso
    setTimeout(() => this.requestAnimeLoad(), 500);
  }

  ngOnDestroy() {
    this.stopSlideShow();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método seguro para carregar animes com retry
  private safeLoadAnimes(): Observable<any> {
    // Previne múltiplas requisições simultâneas
    if (this.isLoading) {
      return of(null);
    }

    this.isLoading = true;
    this.loadError = null;

    return this.animeService.getCurrentAnimeSeason().pipe(
      // Estratégia de retry personalizada
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            // Limita número de tentativas
            if (index < this.MAX_RETRIES) {
              console.warn(`Tentativa ${index + 1} de carregar animes falhou. Tentando novamente...`);

              // Notifica erro
              this.loadError = `Falha ao carregar. Tentativa ${index + 1} de ${this.MAX_RETRIES}`;

              // Delay exponencial
              return of(error).pipe(delay(this.RETRY_DELAY * (index + 1)));
            }

            // Se exceder máximo de tentativas, lança erro
            throw error;
          })
        )
      ),

      // Adiciona um pequeno atraso para evitar contenção
      delay(300),

      // Filtra e processa os dados
      tap(response => {
        if (response?.data?.length) {
          // Filtra animes válidos
          const validAnimes = this.processAnimes(response.data);

          // Atualiza lista de animes
          this.limitedAnimeList = validAnimes;

          // Reseta o slide
          this.currentSlide = 0;

          // Inicia o slideshow
          this.startSlideShow();

          // Pré-carrega imagens
          this.preloadAnimeImages(validAnimes);
        } else {
          throw new Error('Sem dados válidos');
        }
      }),

      // Tratamento de erros
      catchError(error => {
        console.error('Erro no carrossel:', error);
        this.loadError = this.getErrorMessage(error);
        return throwError(() => error);
      }),

      // Finaliza o estado de carregamento
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  // Processa e filtra animes
  private processAnimes(animes: any[]): Anime[] {
    return animes
      .filter(anime =>
        (anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url) &&
        anime.genres?.length > 0
      )
      .slice(0, 5)
      .map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title,
        trailer: anime.trailer,
        genres: anime.genres,
        images: anime.images
      }));
  }

  // Pré-carrega imagens dos animes
  private preloadAnimeImages(animes: Anime[]) {
    animes.forEach(anime => {
      const imageUrl = anime.trailer?.images?.maximum_image_url || anime.images?.jpg?.large_image_url;

      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          console.log(`Imagem do anime ${anime.title} carregada`);
        };

        img.onerror = () => {
          console.warn(`Falha ao carregar imagem do anime ${anime.title}`);
        };
      }
    });
  }

  // Método para obter mensagem de erro personalizada
  private getErrorMessage(error: any): string {
    if (error.status === 404) return 'Animes não encontrados';
    if (error.status === 500) return 'Erro interno do servidor';
    return 'Falha ao carregar animes. Verifique sua conexão.';
  }

  // Método para solicitar carregamento
  requestAnimeLoad() {
    // Adiciona à fila de carregamento
    this.loadingQueue$.next();
  }

  // Métodos de navegação de slide
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