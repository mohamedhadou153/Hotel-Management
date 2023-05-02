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
      Start: booking.Start,
      End: booking.End,
      nujours: booking.nujours,

    });
  }
  // Fetch Single Question Object
  GetBooking(id: string) {
    this.bookingRef = this.db.object('Reservations/' + id);
    return this.bookingRef;
  }
  // Fetch Questions List
  GetBookingList() {
    this.bookingsRef = this.db.list('Reservations');
    return this.bookingsRef;
  }
  // Update Question Object
  UpdateBooking(booking: HotelBooking) {
    this.bookingRef.update({
      Name: booking.Name,
      voiture: booking.voiture,
      Start: booking.Start,
      End: booking.End,
      nujours: booking.nujours,
    });
  }
  // Delete Question Object
  DeleteBooking(id: string) {
    this.bookingRef = this.db.object('Reservations/' + id);
    this.bookingRef.remove();
  }

}
