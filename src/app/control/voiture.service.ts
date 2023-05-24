import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { voiture } from '../Models/voiture';




@Injectable({
  providedIn: 'root'
})
export class voitureService {

  voitureRef!: AngularFireObject<any>;
  voituresRef!: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase,

  ) { }

  Addvoiture(voiture: voiture) {
    this.voituresRef.push({
      type: voiture.type,
      marque:voiture.marque,
      modele: voiture.modele,
      puissance: voiture.puissance,
      prix_location: voiture.prix_location,
      Categorie: voiture.Categorie,
    });
  }
  // Fetch Single Question Object
  Getvoiture(id: string) {
    this.voitureRef = this.db.object('Voitures/' + id);
    return this.voitureRef;
  }
  // Fetch Questions List
  GetvoitureList() {
    this.voituresRef = this.db.list('Voitures');
    return this.voituresRef;
  }
  // Update Question Object
  Updatevoiture(voiture: voiture) {
    this.voitureRef.update({
      type: voiture.type,
      marque:voiture.marque,
      modele: voiture.modele,
      puissance: voiture.puissance,
      prix_location: voiture.prix_location,
      Categorie: voiture.Categorie,
    });
  }
  // Delete Question Object
  Deletevoiture(id: string) {
    this.voitureRef = this.db.object('Voitures/' + id);
    this.voitureRef.remove();
  }

}
