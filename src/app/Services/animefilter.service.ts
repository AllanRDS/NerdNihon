import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimefilterService {
  apiLink = "https://api.jikan.moe/v4";

  constructor(private http: HttpClient) { }

  // Método de filtro com parâmetros opcionais
  getFilteredAnimes(
    searchTerm: string = '',
    page: number = 1,
    genre: string = '',
    year: string = ''
  ): Observable<any> {
    let url = `${this.apiLink}/anime?`;

    // Parâmetros base
    const params = new URLSearchParams();
    params.append('sfw', 'true');
    params.append('page', page.toString());

    // Adiciona termo de busca se existir
    if (searchTerm) {
      params.append('q', searchTerm);
    }

    // Adiciona gênero se existir
    if (genre) {
      params.append('genres', genre);
    }

    // Adiciona ano se existir
    if (year) {
      params.append('start_date', `${year}-01-01`);
      params.append('end_date', `${year}-12-31`);
    }

    return this.http.get<any>(`${url}${params.toString()}`);
  }

  // Lista de gêneros para o select
  getAnimeGenres(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/genres/anime`);
  }

  // Anos para o select (pode ser gerado dinamicamente)
  getAnimeYears(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from(
      {length: 10},
      (_, i) => (currentYear - i).toString()
    );
  }
}