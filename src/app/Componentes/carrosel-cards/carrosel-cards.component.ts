import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { Subject, of, throwError } from 'rxjs';
import {
  takeUntil,
  catchError,
  retryWhen,
  mergeMap,
  delay,
  tap,
  finalize
} from 'rxjs/operators';

@Component({
  selector: 'carrosel-cards',
  templateUrl: './carrosel-cards.component.html',
  styleUrls: ['./carrosel-cards.component.css']
})
export class CarroselCardsComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  seasonUpcomingList: any[] = [];
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  // Estado de carregamento e erro
  isLoading = false;
  loadError: string | null = null;

  // Configurações de retry
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 segundos

  // Gerenciamento de assinaturas
  private destroy$ = new Subject<void>();

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.getUpcomingSeason();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUpcomingSeason() {
    // Previne múltiplos carregamentos
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadError = null;

    this.animeService.getSeasonUpcoming().pipe(
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

      // Processa e filtra os dados
      tap(response => {
        if (response && response.data) {
          this.seasonUpcomingList = this.processUpcomingAnimes(response.data);
          this.preloadAnimeImages(this.seasonUpcomingList);
        } else {
          throw new Error('Resposta inválida');
        }
      }),

      // Tratamento de erros
      catchError(error => {
        console.error('Erro ao carregar a lista de animes:', error);
        this.loadError = this.getErrorMessage(error);
        return throwError(() => error);
      }),

      // Finaliza o estado de carregamento
      finalize(() => {
        this.isLoading = false;
      }),

      // Gerencia assinaturas
      takeUntil(this.destroy$)
    ).subscribe({
      error: (err) => {
        console.error('Erro final:', err);
        this.loadError = 'Erro crítico ao carregar animes';
      }
    });
  }

  // Processa e filtra animes
  private processUpcomingAnimes(animes: any[]): any[] {
    return animes
      .filter(anime =>
        anime.images?.jpg?.image_url &&
        anime.genres?.length > 0
      )
      .slice(0, 20)
      .map(anime => ({
        mal_id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        genres: anime.genres,
        trailer: anime.trailer
      }));
  }

  // Pré-carrega imagens dos animes
  private preloadAnimeImages(animes: any[]) {
    animes.forEach(anime => {
      if (anime.images?.jpg?.image_url) {
        const img = new Image();
        img.src = anime.images.jpg.image_url;

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

  // Método para tentar recarregar
  retryLoadAnimes() {
    this.getUpcomingSeason();
  }

  // Método para iniciar arrasto com mouse
  startDrag(event: MouseEvent) {
    this.initDrag(this.getClientX(event));
  }

  // Método para iniciar arrasto com touch
  startTouch(event: TouchEvent) {
    this.initDrag(this.getClientX(event));
    event.preventDefault(); // Previne scroll padrão
  }

  // Método genérico para iniciar arrasto
  private initDrag(clientX: number) {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = true;
    this.startX = clientX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.carousel.nativeElement.style.cursor = 'grabbing';
  }

  // Método de arrasto
  drag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging || !this.carousel?.nativeElement) return;

    event.preventDefault();
    const clientX = this.getClientX(event);
    const x = clientX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;

    let newScrollLeft = this.scrollLeft - walk;
    const maxScrollLeft = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;

    newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
    this.carousel.nativeElement.scrollLeft = newScrollLeft;
  }

  // Método para finalizar arrasto
  endDrag() {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  // Método para obter coordenada X de forma genérica
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.clientX
      : event.touches[0].clientX;
  }

  // Prevenir comportamento padrão de arrasto
  preventDrag(event: DragEvent) {
    event.preventDefault();
  }
}