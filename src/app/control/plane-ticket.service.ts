import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { PlaneTicket } from '../Models/plane-ticket';




@Injectable({
  providedIn: 'root'
})
export class PlaneTicketService {

  planeTicketRef!: AngularFireObject<any>;
  planeTicketsRef!: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,

  ) { }

  AddPlaneTicket(planeTicket: PlaneTicket) {
    this.planeTicketsRef.push({
      Name: planeTicket.Name,
      Depart:planeTicket.Depart,
      Arrivee: planeTicket.Arrivee,
      Start: planeTicket.Start,
      End: planeTicket.End,
      Prix: planeTicket.Prix,
      Categorie: planeTicket.Categorie,
    });
  }
  // Fetch Single Question Object
  GetPlaneTicket(id: string) {
    this.planeTicketRef = this.db.object('planeTickets/' + id);
    return this.planeTicketRef;
  }
  // Fetch Questions List
  GetPlaneTicketList() {
    this.planeTicketsRef = this.db.list('planeTickets');
    return this.planeTicketsRef;
  }
  // Update Question Object
  UpdatePlaneTicket(planeTicket: PlaneTicket) {
    this.planeTicketRef.update({
      Name: planeTicket.Name,
      Depart:planeTicket.Depart,
      Arrivee: planeTicket.Arrivee,
      Start: planeTicket.Start,
      End: planeTicket.End,
      Prix: planeTicket.Prix,
      Categorie: planeTicket.Categorie,
    });
  }
  // Delete Question Object
  DeletePlaneTicket(id: string) {
    this.planeTicketRef = this.db.object('planeTickets/' + id);
    this.planeTicketRef.remove();
  }

}
