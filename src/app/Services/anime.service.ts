import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  apiLink = "https://api.jikan.moe/v4";

  constructor(private http: HttpClient) { }

  getAnimes(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/anime?q=${searchTerm}&sfw&type=tv`)
  }

  getMovies(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/anime?q=${searchTerm}&sfw&type=movie`)
  }

  getAnimesMovies(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/anime?q=${searchTerm}`)
  }

  getSeasonUpcoming(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/seasons/upcoming?sfw`)
  }

  getTopAnime(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/top/anime?type=tv&sfw&filter=bypopularity`)
  }

  getTopMusic(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/top/anime?type=music&sfw&filter=bypopularity`)
  }

  getTopMovie(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/top/anime?type=movie&sfw&filter=bypopularity`)
  }

  getTopCharacters(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/top/characters`)
  }

  getCurrentAnimeSeason(): Observable<any> {
    return this.http.get<any>(`${this.apiLink}/seasons/now?sfw`)
  }
}
