import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { BuscadorComponent } from './Componentes/buscador/buscador.component';
import { HomeComponent } from './Paginas/home/home.component';
import { CarroselComponent } from './Componentes/carrosel/carrosel.component';
import { AnimeComponent } from './Paginas/anime/anime.component';
import { FilmeComponent } from './Paginas/filme/filme.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { FooterComponent } from './Componentes/footer/footer.component';
import { CarroselCardsComponent } from './Componentes/carrosel-cards/carrosel-cards.component';
import { TruncatePipe } from './Pipes/truncate.pipe';
import { CardListSelectorComponent } from './Componentes/card-list-selector/card-list-selector.component';
import { FormsModule } from '@angular/forms';
import { TransicaoComponent } from './Componentes/transicao/transicao.component'; // Adicione esta importação

@NgModule({
  declarations: [
    AppComponent,
    BuscadorComponent,
    HomeComponent,
    CarroselComponent,
    AnimeComponent,
    FilmeComponent,
    NavbarComponent,
    FooterComponent,
    CarroselCardsComponent,
    TruncatePipe,
    CardListSelectorComponent,
    TransicaoComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
