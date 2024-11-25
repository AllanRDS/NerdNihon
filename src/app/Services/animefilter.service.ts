import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimefilterService {
  apiLink = "https://api.jikan.moe/v4";

  // Armazenar mapeamento de gêneros
  private genreMap: { [key: string]: number } = {};

  constructor(private http: HttpClient) { }

  // Método para carregar mapeamento de gêneros
  loadGenreMapping(): Observable<void> {
    return this.http.get<any>(`${this.apiLink}/genres/anime`).pipe(
      map(response => {
        // Criar mapeamento de nome para ID
        this.genreMap = response.data.reduce((acc: any, genre: any) => {
          acc[genre.name] = genre.mal_id;
          return acc;
        }, {});
      })
    );
  }

  // Método de filtro com parâmetros opcionais
  getFilteredAnimes(
    searchTerm: string = '',
    page: number = 1,
    genre: string = '',
    year: string = ''
  ): Observable<any> {
    // Criar HttpParams para construir URL
    let params = new HttpParams()
      .set('sfw', 'true')
      .set('type', 'tv')
      .set('page', page.toString());

    // Adiciona termo de busca se existir
    if (searchTerm) {
      params = params.set('q', searchTerm);
    }

    // Adiciona gênero se existir (usando ID do mapeamento)
    if (genre && this.genreMap[genre]) {
      params = params.set('genres', this.genreMap[genre].toString());
    }

    // Adiciona ano se existir
    if (year) {
      params = params.set('start_date', `${year}-01-01`)
                      .set('end_date', `${year}-12-31`);
    }

    return this.http.get<any>(`${this.apiLink}/anime`, { params });
  }

  // Lista de gêneros para o dropdown
  getAnimeGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/genres/anime`);
  }

  // Anos para o dropdown
  getAnimeYears(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      {length: 10},
      (_, i) => (currentYear - i).toString()
    );
  }

  getInitialAnimes(page: number) {
    return this.http.get<any>(`${this.apiLink}/anime?type=tv&page=${page}&order_by=popularity`);
  }
}