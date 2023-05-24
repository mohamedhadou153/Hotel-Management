import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { reservationComponent } from './view/reservation/reservation.component';
import { ClientComponent } from './view/client/client.component';
import { HomeComponent } from './view/home/home.component';
import { voitureComponent } from './view/voiture/voiture.component';
import { FactureComponent } from './view/Facture/facture.component';

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path: 'Clients', component: ClientComponent},
  {path: 'Reservation', component: reservationComponent},
  {path: 'home', component: HomeComponent},
  {path: 'Voitures', component: voitureComponent},
  {path: 'Facture/:key', component: FactureComponent},
  {path: 'Facture', component: FactureComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
