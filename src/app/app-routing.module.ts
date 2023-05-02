import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './view/booking/booking.component';
import { ClientComponent } from './view/client/client.component';
import { HomeComponent } from './view/home/home.component';
import { PlaneTicketComponent } from './view/plane/plane-ticket.component';

const routes: Routes = [
  {path: '', redirectTo:'/home', pathMatch: 'full'},
  {path: 'client', component: ClientComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'home', component: HomeComponent},
  {path: 'planeTicket', component: PlaneTicketComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
