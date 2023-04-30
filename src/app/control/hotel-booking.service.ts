import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { HotelBooking } from '../Models/hotel-booking';


@Injectable({
  providedIn: 'root'
})
export class HotelBookingService {
  bookingRef!: AngularFireObject<any>;
  bookingsRef!: AngularFireList<any>; 
  constructor(
    private db: AngularFireDatabase,

  ) { }

  AddBooking(booking: HotelBooking) {
    this.bookingsRef.push({
      Name: booking.Name,
      voiture: booking.voiture,
      matricule:booking.matricule,
      Start: booking.Start,
      End: booking.End,
      nujours: booking.nujours,
      Prix: booking.Prix,
    });
  }
  // Fetch Single Question Object
  GetBooking(id: string) {
    this.bookingRef = this.db.object('bookings/' + id);
    return this.bookingRef;
  }
  // Fetch Questions List
  GetBookingList() {
    this.bookingsRef = this.db.list('bookings');
    return this.bookingsRef;
  }
  // Update Question Object
  UpdateBooking(booking: HotelBooking) {
    this.bookingRef.update({
      Name: booking.Name,
      voiture: booking.voiture,
      matricule:booking.matricule,
      Start: booking.Start,
      End: booking.End,
      nujours: booking.nujours,
      Prix: booking.Prix,
    });
  }
  // Delete Question Object
  DeleteBooking(id: string) {
    this.bookingRef = this.db.object('bookings/' + id);
    this.bookingRef.remove();
  }

}
