import { Injectable } from '@angular/core';
import { Client } from '../Models/client';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  clientRef!: AngularFireObject<any>;
  clientsRef!: AngularFireList<any>; 

  constructor(
    private db: AngularFireDatabase,
  ) { }

  AddClient(client: Client) {
    this.clientsRef.push({
      Name: client.Name,
      Address: client.Address,
      Id: client.Id,
    });
  }
  // Fetch Single Question Object
  GetClient(id: string) {
    this.clientRef = this.db.object('clients/' + id);
    return this.clientRef;
  }
  // Fetch Questions List
  GetClientList() {
    this.clientsRef = this.db.list('clients');
    return this.clientsRef;
  }
  // Update Question Object
  UpdateClient(client: Client) {
    this.clientRef.update({
      Name: client.Name,
      Address: client.Address,
      Id: client.Id,
    });
  }
  // Delete Question Object
  DeleteClient(id: string) {
    this.clientRef = this.db.object('clients/' + id);
    this.clientRef.remove();
  }
}
