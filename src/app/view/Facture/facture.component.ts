import { Component, OnInit,Inject,ViewChild,ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router ,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HotelBookingService } from 'src/app/control/hotel-booking.service';
import { HotelBooking } from 'src/app/Models/hotel-booking';
import { ClientService } from 'src/app/control/client.service'; 
import { Client } from 'src/app/Models/client';
import { PlaneTicket } from 'src/app/Models/plane-ticket';
import { PlaneTicketService } from 'src/app/control/plane-ticket.service';
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
  
  dataSource!: MatTableDataSource<HotelBooking>;

  bookings: HotelBooking[]=[];
  booking!: HotelBooking;
 


  clients: Client[] = [];
  client!: Client;
  
  planetickets: PlaneTicket[] = [];
  planeticket!: PlaneTicket;

  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
 

  constructor(private bookingService: HotelBookingService,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private planeTicketService: PlaneTicketService,
  ) {
    this.dataSource = new MatTableDataSource(this.bookings);
  }

    ngOnInit(): void {
      this.bookingService.GetBookingList().snapshotChanges().subscribe(data => {
        this.bookings = [];
        data.forEach(item => { 
          this.booking = item.payload.toJSON() as HotelBooking;
          this.booking.$key = item.key!;
          this.bookings.push(this.booking);
        })
        this.dataSource.data = this.bookings;
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
      this.planeTicketService.GetPlaneTicketList().snapshotChanges().subscribe(data => {
        this.planetickets = [];
        data.forEach(item => { 
          this.planeticket = item.payload.toJSON() as PlaneTicket;
          this.planeticket.$key = item.key!;
          this.planetickets.push(this.planeticket);
        })
      })

      this.key = this.activatedRoute.snapshot.paramMap.get('key');
      this.bookingService.GetBooking(this.key).valueChanges().subscribe(item => {
        this.booking = item as HotelBooking;
       
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
        return this.planetickets.find(c => c.$key === key)?.marque+' ' + this.planetickets.find(c => c.$key === key)?.modele;
      }
      getvoiturep(key: string) : number | undefined{
        return  this.planetickets.find(c => c.$key === key)?.puissance;
      }
      getvoiturec(key: string) : string | undefined{
        return this.planetickets.find(c => c.$key === key)?.Categorie;
      }
      getvoituret(key: string) : string | undefined{
        return this.planetickets.find(c => c.$key === key)?.type;
      }
      getprixj(key: string) : number | undefined{
        return this.planetickets.find(c => c.$key === key)?.prix_location;
      }
      getprix(key: string ,prixj:number) : number | undefined{
        let a  = this.planetickets.find(c => c.$key === key)?.prix_location||0; 
        return (a * prixj);
      }
      getDate(){
        return new Date();
      }
    }

