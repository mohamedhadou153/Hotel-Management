import { Client } from "./client";
import { HotelBooking } from "./hotel-booking";
import { PlaneTicket } from "./plane-ticket";

export interface Stay {
    Start: Date;
    End: Date;
    Client: Client;
    Hotel: HotelBooking;
    PlaneTicket: PlaneTicket;
}
