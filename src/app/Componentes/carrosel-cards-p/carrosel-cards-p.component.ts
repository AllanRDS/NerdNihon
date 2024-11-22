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
    setTimeout(() => this.loadCharacters(), 1000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCharacters() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.loadError = null;

    this.animeService.getTopCharacters().pipe(
      delay(500),
      tap(response => {
        if (response?.data) {
          this.charactersList = response.data.slice(0, 20);
          this.preloadCharacterImages(this.charactersList);
        }
      }),
      catchError(error => {
        console.error('Erro ao carregar personagens:', error);
        this.loadError = 'Falha ao carregar personagens';
        return [];
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private preloadCharacterImages(characters: any[]) {
    characters.forEach((character, index) => {
      if (character.images?.jpg?.image_url) {
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

  // Método para obter coordenada X de forma genérica
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.pageX
      : event.touches[0].pageX;
  }

  // Métodos de arrasto do carrossel
  startDrag(event: MouseEvent | TouchEvent) {
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
    this.isDragging = false;
    this.carousel.nativeElement.style.cursor = 'grab';
  }

  drag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    const clientX = this.getClientX(event);
    const x = clientX - this.carousel.nativeElement.offsetLeft;
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