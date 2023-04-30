
import { RoomType } from "./room-type";

export interface HotelBooking {
    $key: string;
    Name:string;
    voiture: string;
    matricule:string;
    Start: Date;
    End: Date;
    nujours: number;
    Prix: number;
}
