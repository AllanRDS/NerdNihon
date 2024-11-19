import { Component } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';

@Component({
  selector: 'app-cards-horizontal',
  templateUrl: './cards-horizontal.component.html',
  styleUrl: './cards-horizontal.component.css'
})
export class CardsHorizontalComponent {
  constructor(private animeService : AnimeService){}

  seasonUpcomingList: any[] = [];

  ngOnInit()
  {
    this.getUpcomingSeason()
  }

  getUpcomingSeason()
  {
    this.animeService.getSeasonUpcoming().subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.seasonUpcomingList = response.data.slice(0, 5); // Limitar a quantidade de animes a serem exibidos (exibindo no máximo 5)
          console.log(this.seasonUpcomingList)
        } else {
          console.error('Resposta inválida:', response);
        }
      },
      error: (error: any) => {
        console.error('Erro ao carregar a lista de animes para lançar:', error);
        alert("Erro ao carregar a lista da temporada seguinte");
      }
    })
  }






}
