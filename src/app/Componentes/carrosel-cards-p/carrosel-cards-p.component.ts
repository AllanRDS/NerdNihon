import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError, finalize, tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-carrosel-cards-p',
  templateUrl: './carrosel-cards-p.component.html',
  styleUrl: './carrosel-cards-p.component.css'
})
export class CarroselCardsPComponent implements OnInit, OnDestroy {
  @ViewChild('carousel') carousel!: ElementRef;

  charactersList: any[] = [];
  isLoading: boolean = false;
  loadError: string | null = null;

  // Propriedades de arrasto
  isDragging = false;
  startX: number = 0;
  scrollLeft: number = 0;

  // Gerenciamento de assinaturas
  private destroy$ = new Subject<void>();

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    // Adiciona um pequeno delay antes de carregar
    setTimeout(() => this.loadCharacters(), 1000);
  }

  ngOnDestroy() {
    // Cancela todas as subscrições pendentes
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCharacters() {
    // Evita múltiplas requisições simultâneas
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadError = null;

    this.animeService.getTopCharacters().pipe(
      // Adiciona um pequeno delay para evitar sobrecarga
      delay(500),

      // Limita a quantidade de caracteres
      tap(response => {
        if (response?.data) {
          this.charactersList = response.data.slice(0, 20);
          this.preloadCharacterImages(this.charactersList);
        }
      }),

      // Tratamento de erros
      catchError(error => {
        console.error('Erro ao carregar personagens:', error);
        this.loadError = 'Falha ao carregar personagens';
        return [];
      }),

      // Finaliza o estado de carregamento
      finalize(() => {
        this.isLoading = false;
      }),

      // Cancela a subscrição quando o componente for destruído
      takeUntil(this.destroy$)
    ).subscribe();
  }

  // Método para pré-carregar imagens
  private preloadCharacterImages(characters: any[]) {
    characters.forEach((character, index) => {
      if (character.images?.jpg?.image_url) {
        // Adiciona um pequeno delay entre os pré-carregamentos
        setTimeout(() => {
          const img = new Image();
          img.src = character.images.jpg.image_url;

          img.onload = () => {
            console.log(`Imagem do personagem ${index} carregada`);
          };

          img.onerror = () => {
            console.warn(`Falha ao carregar imagem do personagem ${index}`);
          };
        }, index * 200);
      }
    });
  }

  // Métodos de arrasto do carrossel
  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.pageX - this.carousel.nativeElement.offsetLeft;
    this.scrollLeft = this.carousel.nativeElement.scrollLeft;
    this.carousel.nativeElement.style.cursor = 'grabbing';
  }

  endDrag() {
    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  drag(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    const x = event.pageX - this.carousel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2;
    let newScrollLeft = this.scrollLeft - walk;

    const maxScrollLeft = this.carousel.nativeElement.scrollWidth - this.carousel.nativeElement.clientWidth;

    if (newScrollLeft < 0) {
      newScrollLeft = 0;
    } else if (newScrollLeft > maxScrollLeft) {
      newScrollLeft = maxScrollLeft;
    }

    this.carousel.nativeElement.scrollLeft = newScrollLeft;
  }

  preventDrag(event: DragEvent) {
    event.preventDefault();
  }
}