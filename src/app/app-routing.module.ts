import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './view/booking/booking.component';
import { ClientComponent } from './view/client/client.component';
import { HomeComponent } from './view/home/home.component';
import { PlaneTicketComponent } from './view/plane-ticket/plane-ticket.component';
import { FactureComponent } from './view/Facture/facture.component';

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path: 'Clients', component: ClientComponent},
  {path: 'Reservation', component: BookingComponent},
  {path: 'home', component: HomeComponent},
  {path: 'Voitures', component: PlaneTicketComponent},
  {path: 'Facture/:key', component: FactureComponent},
  {path: 'Facture', component: FactureComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
