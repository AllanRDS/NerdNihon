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
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
