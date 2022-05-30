import { Destination } from "./destination";
import { RoomType } from "./room-type";

export interface HotelBooking {
    $key: string;
    Name:string;
    RoomNumber: number;
    Start: Date;
    End: Date;
    NuNight: number;
    Rec: string;
    Destination: Destination;
    Smoking: boolean;
    Navette: boolean;
    Prix: number;
}
