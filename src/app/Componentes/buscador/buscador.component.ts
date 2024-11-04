import { Component } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { error } from 'console';
AnimeService
@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'] // Corrigido de 'styleUrl' para 'styleUrls'
})
export class BuscadorComponent {
  constructor(private animeService: AnimeService) {}

  anime: any[] = [];
  animeList: any[] = [];

  getAnime(obj: any)
  {
    const searchTerm = obj.target.value;

    this.animeService.getAnimes(searchTerm).subscribe({

      next: (response: any) =>
      {
        this.animeList = response.data;
        console.log(this.animeList);

        this.animeList.forEach(anime => {
          if (anime.genres && Array.isArray(anime.genres)) {
            anime.formattedGenres = anime.genres.map((genre: { name: string }) => genre.name).join(', ');
          } else {
            anime.formattedGenres = 'N/A'; // Valor padrão caso não haja gêneros
          }
        });
        console.log(this.animeList); // Inspecione a lista de animes no console);

      },
      error: (error: any) =>
      {
        if (error.status === 404)
        {
          alert("Esse anime não existe");
        }
      }

    });
  }


}
