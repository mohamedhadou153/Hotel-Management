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
      type: planeTicket.type,
      marque:planeTicket.marque,
      modele: planeTicket.modele,
      puissance: planeTicket.puissance,
      prix_location: planeTicket.prix_location,
      Categorie: planeTicket.Categorie,
    });
  }
  // Fetch Single Question Object
  GetPlaneTicket(id: string) {
    this.planeTicketRef = this.db.object('Voitures/' + id);
    return this.planeTicketRef;
  }
  // Fetch Questions List
  GetPlaneTicketList() {
    this.planeTicketsRef = this.db.list('Voitures');
    return this.planeTicketsRef;
  }
  // Update Question Object
  UpdatePlaneTicket(planeTicket: PlaneTicket) {
    this.planeTicketRef.update({
      type: planeTicket.type,
      marque:planeTicket.marque,
      modele: planeTicket.modele,
      puissance: planeTicket.puissance,
      prix_location: planeTicket.prix_location,
      Categorie: planeTicket.Categorie,
    });
  }
  // Delete Question Object
  DeletePlaneTicket(id: string) {
    this.planeTicketRef = this.db.object('Voitures/' + id);
    this.planeTicketRef.remove();
  }

}
