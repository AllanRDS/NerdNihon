import { Component } from '@angular/core';
import { AnimeService } from '../../Services/anime.service';
import { finalize, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms'; // Opcional se estiver no módulo
import { of } from 'rxjs';

interface ImageUrls {
  image_url: string;
  small_image_url: string;
  large_image_url: string; // Adicionado
}

interface AnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: ImageUrls;  // Atualizado para incluir large_image_url
    webp: ImageUrls; // Adicionado suporte para webp
  };
  type: string;
  year?: number;
  score?: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuVisible = false;
  isSearchModalOpen = false;
  searchTerm = '';
  searchResults: AnimeResult[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private animeService: AnimeService) {}

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  openSearchModal(): void {
    this.isSearchModalOpen = true;
    // Opcional: foco no input
    setTimeout(() => {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    });
  }

  closeSearchModal(): void {
    this.isSearchModalOpen = false;
    this.resetSearch();
  }

  resetSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.errorMessage = null;
    this.isLoading = false;
  }

  searchAnimes(): void {
    // Validação mais robusta
    if (!this.searchTerm || this.searchTerm.trim().length < 2) {
      this.errorMessage = 'Por favor, digite pelo menos 2 caracteres';
      return;
    }

    // Reset previous state
    this.searchResults = [];
    this.errorMessage = null;
    this.isLoading = true;

    this.animeService.getAnimes(this.searchTerm.trim())
      .pipe(
        catchError(error => {
          console.error('Erro na pesquisa', error);
          this.errorMessage = 'Não foi possível realizar a busca. Tente novamente.';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.searchResults = response.data.slice(0, 10);

            // Adiciona tratamento caso não encontre resultados
            if (this.searchResults.length === 0) {
              this.errorMessage = `Nenhum anime encontrado para "${this.searchTerm}"`;
            }
          }
        }
      });
  }

  // Método para navegar para detalhes do anime (opcional)
  navigateToAnimeDetails(animeId: number): void {
    // Implemente a navegação para página de detalhes
    console.log(`Navegando para detalhes do anime ${animeId}`);
  }
}