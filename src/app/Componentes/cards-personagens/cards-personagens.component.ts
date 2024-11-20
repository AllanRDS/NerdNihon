import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, catchError, finalize, tap, retryWhen, take } from 'rxjs/operators';
import { AnimeService } from '../../Services/anime.service';

interface CacheItem {
  data: any[];
  timestamp: number;
}

@Component({
  selector: 'cards-personagens',
  templateUrl: './cards-personagens.component.html',
  styleUrl: './cards-personagens.component.css'
})
export class CardsPersonagensComponent implements OnInit {

// Configurações de cache
private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

characters: any[] = [];
isLoading: boolean = false;
loadError: string | null = null;

constructor(private animeService: AnimeService) {}

ngOnInit() {
  this.loadCharacters();
}

// Método para recuperar cache do localStorage
private getCachedData(key: string): CacheItem | null {
  try {
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      const parsedItem: CacheItem = JSON.parse(cachedItem);

      // Verifica se o cache ainda é válido
      if (Date.now() - parsedItem.timestamp < this.CACHE_DURATION) {
        return parsedItem;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao recuperar cache', error);
    return null;
  }
}

// Método para salvar cache no localStorage
private saveToCache(key: string, data: any[]) {
  try {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Erro ao salvar cache', error);
  }
}

// Método genérico para carregar dados com cache
private loadDataWithCache(
  key: string,
  serviceMethod: () => Observable<any>,
  setCacheMethod: (data: any[]) => void
): Observable<any> {
  // Tentar recuperar do localStorage primeiro
  const cachedData = this.getCachedData(key);

  // Se o cache for válido, retorna dados do cache
  if (cachedData) {
    setCacheMethod(cachedData.data);
    return of({ data: cachedData.data });
  }

  // Se não, faz a requisição
  return serviceMethod().pipe(
    delay(500), // Mantive um pequeno delay para sensação de carregamento
    catchError(err => {
      this.loadError = 'Erro ao carregar personagens';
      console.error('Erro ao carregar conteúdo', err);
      return of(null);
    }),
    retryWhen(errors =>
      errors.pipe(
        delay(2000),
        take(3)
      )
    ),
    tap(response => {
      if (response?.data) {
        // Limitar quantidade de itens e salvar no cache
        const limitedData = response.data.slice(0, 18);
        this.saveToCache(key, limitedData);
        setCacheMethod(limitedData);
      }
    })
  );
}

loadCharacters() {
  this.isLoading = true;

  this.loadDataWithCache(
    'characters',
    () => this.animeService.getTopCharacters(),
    (data) => {
      this.characters = data;
      this.preloadImages(this.characters);
    }
  ).pipe(
    finalize(() => {
      this.isLoading = false;
    })
  ).subscribe();
}

// Método para pré-carregar imagens
private preloadImages(items: any[]) {
  items.forEach(item => {
    if (item.images?.jpg?.image_url) {
      const img = new Image();
      img.src = item.images.jpg.image_url;
    }
  });
}

// Método para limpar cache
clearCache() {
  localStorage.removeItem('characters');
}
}
