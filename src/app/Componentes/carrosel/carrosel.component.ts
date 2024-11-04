import { Component } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';

@Component({
  selector: 'app-carrosel',
  templateUrl: './carrosel.component.html',
  styleUrl: './carrosel.component.css'
})
export class CarroselComponent {
  constructor(private animeService : AnimeService){}

  currentSeasonList: any[] = []

  ngOnInit()
  {
    this.getCurrentSeason()
  }

  getCurrentSeason()
  {
    this.animeService.getCurrentAnimeSeason().subscribe({
        next: (response: any) => { // Use uma função anônima aqui
            this.currentSeasonList = response.data;
            console.log(this.currentSeasonList);
        },
        error: (error: any) => {
            console.error('Erro ao carregar a temporada atual:', error);
            alert("Erro ao carregar a lista da temporada atual");
        }
    });
  }
}
