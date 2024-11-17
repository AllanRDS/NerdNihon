import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 // Variável para controlar a visibilidade do menu
  isMenuVisible: boolean = false;

  // Função para alternar o estado de visibilidade do menu
  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
