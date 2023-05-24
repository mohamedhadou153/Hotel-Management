import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { reservation } from '../Models/reservation';


@Injectable({
  providedIn: 'root'
})
export class reservationService {
  reservationRef!: AngularFireObject<any>;
  reservationsRef!: AngularFireList<any>; 
  constructor(
    private db: AngularFireDatabase,

  ) { }

  Addreservation(reservation: reservation) {
    this.reservationsRef.push({
      Name: reservation.Name,
      voiture: reservation.voiture,
      Start: reservation.Start,
      End: reservation.End,
      nujours: reservation.nujours,

    });
  }
  // Fetch Single Question Object
  Getreservation(id: string) {
    this.reservationRef = this.db.object('Reservations/' + id);
    return this.reservationRef;
  }
  // Fetch Questions List
  GetreservationList() {
    this.reservationsRef = this.db.list('Reservations');
    return this.reservationsRef;
  }
  // Update Question Object
  Updatereservation(reservation: reservation) {
    this.reservationRef.update({
      Name: reservation.Name,
      voiture: reservation.voiture,
      Start: reservation.Start,
      End: reservation.End,
      nujours: reservation.nujours,
    });
  }
  // Delete Question Object
  Deletereservation(id: string) {
    this.reservationRef = this.db.object('Reservations/' + id);
    this.reservationRef.remove();
  }

}
