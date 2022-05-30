import { Destination } from "./destination";

export interface PlaneTicket {
    $key:string,
    Name:string,
    Depart: Destination,
    Arrivee: Destination,
    Start: Date,
    End: Date,
    Prix: number,
    Categorie: 'Economie' | 'Business',

    
}

export enum Ville {
    Agadir = 50,
    Marrakesh = 30,
    Casablanca = 10,
    Rabat = 10,
    Tanger = 20, 
}