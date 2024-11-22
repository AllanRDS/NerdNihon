import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private apiLink = "https://api.jikan.moe/v4";

  constructor(private http: HttpClient) {}

  getAnimes(searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('sfw', 'true')
      .set('type', 'tv');

    return this.http.get(`${this.apiLink}/anime`, { params }).pipe(
      retry(3)
    );
  }

  getMovies(searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('sfw', 'true')
      .set('type', 'movie');

    return this.http.get(`${this.apiLink}/anime`, { params }).pipe(
      retry(3)
    );
  }

  getTopMovie(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'movie')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  getTopMusic(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'music')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  getAnimesMovies(searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('q', searchTerm)
      .set('sfw', 'true');

    return this.http.get(`${this.apiLink}/anime`, { params }).pipe(
      retry(3)
    );
  }

  getSeasonUpcoming(): Observable<any> {
    return this.http.get(`${this.apiLink}/seasons/upcoming`, {
      params: new HttpParams().set('sfw', 'true')
    }).pipe(retry(3));
  }

  getTopAnime(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'tv')
      .set('sfw', 'true')
      .set('filter', 'bypopularity');

    return this.http.get(`${this.apiLink}/top/anime`, { params }).pipe(
      retry(3)
    );
  }

  getTopCharacters(): Observable<any> {
    return this.http.get(`${this.apiLink}/top/characters`).pipe(
      retry(3)
    );
  }

  getCurrentAnimeSeason(): Observable<any> {
    return this.http.get(`${this.apiLink}/seasons/now`, {
      params: new HttpParams().set('sfw', 'true')
    }).pipe(retry(3));
  }

  // Métodos de Carrossel
  getCarouselAnimes(): Observable<any> {
    const params = new HttpParams()
      .set('type', 'tv')
      .set('sfw', 'true')
      .set('order_by', 'score')
      .set('sort', 'desc')
      .set('limit', '10');

    return this.http.get(`${this.apiLink}/anime`, { params }).pipe(
      retry(3)
    );
  }

  getCarouselCharacters(): Observable<any> {
    const params = new HttpParams()
      .set('sfw', 'true')
      .set('order_by', 'favorites')
      .set('sort', 'desc')
      .set('limit', '10');

    return this.http.get(`${this.apiLink}/characters`, { params }).pipe(
      retry(3)
    );
  }
}