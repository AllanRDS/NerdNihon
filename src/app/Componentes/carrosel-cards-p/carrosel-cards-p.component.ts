import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { Observable, Subject, of } from 'rxjs';
import {
  takeUntil,
  catchError,
  finalize,
  tap,
  delay,
  retryWhen,
  mergeMap
} from 'rxjs/operators';

interface Character {
  mal_id: number;
  name: string;
  images: {
    jpg: {
      image_url: string;
    }
  };
  nicknames?: string[];
  favorites?: number;
}

@Component({
  selector: 'app-carrosel-cards-p',
  templateUrl: './carrosel-cards-p.component.html',
  styleUrls: ['./carrosel-cards-p.component.css']
})
export class CarroselCardsPComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  charactersList: Character[] = [];
  isLoading = false;
  loadError: string | null = null;

  // Configurações de retry
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 2000; // 2 segundos

  // Propriedades de arrasto
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  // Gerenciamento de assinaturas
  private destroy$ = new Subject<void>();

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    // Carrega personagens com pequeno atraso
    setTimeout(() => this.loadCharacters(), 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCharacters(forceReload = false) {
    // Previne múltiplos carregamentos
    if (this.isLoading && !forceReload) return;

    this.isLoading = true;
    this.loadError = null;

    this.animeService.getTopCharacters().pipe(
      // Estratégia de retry personalizada
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            // Limita número de tentativas
            if (index < this.MAX_RETRIES) {
              console.warn(`Tentativa ${index + 1} de carregar personagens falhou. Tentando novamente...`);

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
      // Pequeno atraso para melhor UX
      delay(500),
      // Processamento dos dados
      tap(response => {
        if (response?.data) {
          // Filtra e limita personagens
          this.charactersList = this.processCharacters(response.data);

          // Pré-carrega imagens
          this.preloadCharacterImages(this.charactersList);

          // Reseta erro se sucesso
          this.loadError = null;
        }
      }),
      // Tratamento de erros
      catchError(error => {
        console.error('Erro ao carregar personagens:', error);
        this.loadError = this.getErrorMessage(error);
        return of(null);
      }),
      // Finalização
      finalize(() => {
        this.isLoading = false;
      }),
      // Gerenciamento de subscrição
      takeUntil(this.destroy$)
    ).subscribe();
  }

  // Processa e filtra personagens
  private processCharacters(characters: any[]): Character[] {
    return characters
      .filter(char =>
        char.images?.jpg?.image_url &&
        char.name
      )
      .slice(0, 20)
      .map(char => ({
        mal_id: char.mal_id,
        name: char.name,
        images: char.images,
        nicknames: char.nicknames || [],
        favorites: char.favorites || 0
      }));
  }

  // Pré-carrega imagens dos personagens
  private preloadCharacterImages(characters: Character[]) {
    characters.forEach((character, index) => {
      if (character.images?.jpg?.image_url) {
        const img = new Image();
        img.src = character.images.jpg.image_url;

        img.onload = () => {
          console.log(`Imagem do personagem ${character.name} carregada`);
        };

        img.onerror = () => {
          console.warn(`Falha ao carregar imagem do personagem ${character.name}`);
        };
      }
    });
  }

  // Método para obter mensagem de erro personalizada
  private getErrorMessage(error: any): string {
    if (error.status === 404) return 'Personagens não encontrados';
    if (error.status === 500) return 'Erro interno do servidor';
    return 'Falha ao carregar personagens. Verifique sua conexão.';
  }

  // Métodos de arrasto do carrossel
  startDrag(event: MouseEvent | TouchEvent) {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = true;
    this.startX = this.getClientX(event) - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.carousel.nativeElement.style.cursor = 'grabbing';

    // Previne comportamento padrão para touch
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }
  }

  endDrag() {
    if (!this.carousel?.nativeElement) return;

    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

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

  // Método para obter coordenada X de forma genérica
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.pageX
      : event.touches[0].pageX;
  }

  // Método para tentar recarregar manualmente
  retryLoadCharacters() {
    this.loadCharacters(true);
  }

  // Método para prevenir arrasto padrão
  preventDrag(event: DragEvent) {
    event.preventDefault();
  }
}