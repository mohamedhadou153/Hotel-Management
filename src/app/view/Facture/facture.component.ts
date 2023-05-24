import { Component, OnInit,Inject,ViewChild,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router ,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { reservationService } from 'src/app/control/reservation.service';
import { reservation } from 'src/app/Models/reservation';
import { ClientService } from 'src/app/control/client.service'; 
import { Client } from 'src/app/Models/client';
import { voiture } from 'src/app/Models/voiture';
import { voitureService } from 'src/app/control/voiture.service';
import {jsPDF} from 'jspdf';



  
  @Component({
    selector: 'Facture',
    templateUrl: './facture.component.html',
    styleUrls: ['./facture.component.css']
  })
export class FactureComponent implements OnInit {
  @ViewChild('content',{static: false}) el!:ElementRef;
  makepdf(){
    let pdf =new jsPDF('p','pt','a4');
    pdf.html(this.el.nativeElement,{
      callback: (pdf)=>{ 
        pdf.save("facture.pdf");
      }
    })
  }

  key: any;
  
  dataSource!: MatTableDataSource<reservation>;

  reservations: reservation[]=[];
  reservation!: reservation;
 


  clients: Client[] = [];
  client!: Client;
  
  voitures: voiture[] = [];
  voiture!: voiture;

  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
 

  constructor(private reservationService: reservationService,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private voitureService: voitureService,
  ) {
    this.dataSource = new MatTableDataSource(this.reservations);
  }

    ngOnInit(): void {
      this.reservationService.GetreservationList().snapshotChanges().subscribe(data => {
        this.reservations = [];
        data.forEach(item => { 
          this.reservation = item.payload.toJSON() as reservation;
          this.reservation.$key = item.key!;
          this.reservations.push(this.reservation);
        })
        this.dataSource.data = this.reservations;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
     
      this.clientService.GetClientList().snapshotChanges().subscribe(data => {
        this.clients = [];
        data.forEach(item => { 
          this.client = item.payload.toJSON() as Client;
          this.client.$key = item.key!;
          this.clients.push(this.client);
        })
      })
      this.voitureService.GetvoitureList().snapshotChanges().subscribe(data => {
        this.voitures = [];
        data.forEach(item => { 
          this.voiture = item.payload.toJSON() as voiture;
          this.voiture.$key = item.key!;
          this.voitures.push(this.voiture);
        })
      })

      this.key = this.activatedRoute.snapshot.paramMap.get('key');
      this.reservationService.Getreservation(this.key).valueChanges().subscribe(item => {
        this.reservation = item as reservation;
       
    })
  }


      getClient(key: string) : string | undefined{
        return this.clients.find(c => c.$key === key)?.Name;
      }
      getClienta(key: string) : string | undefined{
        return this.clients.find(c => c.$key === key)?.Address;
      }
      getClientp(key: string) : number | undefined{
        return this.clients.find(c => c.$key === key)?.phone;
      }
      getClienti(key: string) : string | undefined{
        return this.clients.find(c => c.$key === key)?.Id;
      }
      getvoiture(key: string) : string | undefined{
        return this.voitures.find(c => c.$key === key)?.marque+' ' + this.voitures.find(c => c.$key === key)?.modele;
      }
      getvoiturep(key: string) : number | undefined{
        return  this.voitures.find(c => c.$key === key)?.puissance;
      }
      getvoiturec(key: string) : string | undefined{
        return this.voitures.find(c => c.$key === key)?.Categorie;
      }
      getvoituret(key: string) : string | undefined{
        return this.voitures.find(c => c.$key === key)?.type;
      }
      getprixj(key: string) : number | undefined{
        return this.voitures.find(c => c.$key === key)?.prix_location;
      }
      getprix(key: string ,prixj:number) : number | undefined{
        let a  = this.voitures.find(c => c.$key === key)?.prix_location||0; 
        return (a * prixj);
      }
      getDate(){
        return new Date();
      }
    }

