import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { HotelBookingService } from 'src/app/control/hotel-booking.service';
import { HotelBooking } from 'src/app/Models/hotel-booking';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ClientService } from 'src/app/control/client.service'; 
import { Client } from 'src/app/Models/client';
import { PlaneTicket } from 'src/app/Models/plane-ticket';
import { PlaneTicketService } from 'src/app/control/plane-ticket.service';



export interface DialogData {
  $key: string;
  new: boolean;
  clients: Client[];
  planetickets: PlaneTicket[];
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  displayedColumns: string[] = ['Name','voiture','prixj', 'Start', 'End','nujours','Prix','Edit', 'Delete','Facture'];
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
    private route: ActivatedRoute,
    public dialog: MatDialog,
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
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("applyFilter is");
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  deletebooking(booking: HotelBooking){
    this.bookingService.DeleteBooking(booking.$key);
  }

  openDialog(): void {
    this.onDialog({clients: this.clients,planetickets :this.planetickets, new: true});
    console.log(this.clients);
    
  }

  editDialog(key: string): void {
    let q = this.bookings.find(item => item.$key === key) as HotelBooking;
    this.onDialog({$key: q.$key, clients: this.clients,planetickets: this.planetickets, new: false});
  }

  onDialog(data: any): void {
    const dialogRef = this.dialog.open(NewBookingComponent, {
      width: '20rem',height: '25rem',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');     
    });
  }
  getClient(key: string) : string | undefined{
    return this.clients.find(c => c.$key === key)?.Name;
  }
  getvoiture(key: string) : string | undefined{
    return this.planetickets.find(c => c.$key === key)?.marque+' ' + this.planetickets.find(c => c.$key === key)?.modele;
  }
  getprixj(key: string) : number | undefined{
    return this.planetickets.find(c => c.$key === key)?.prix_location;
  }
  getprix(key: string ,prixj:number) : number | undefined{
    let a  = this.planetickets.find(c => c.$key === key)?.prix_location||0; 
    return (a * prixj);
  }
}
@Component({
  selector: 'form-booking',
  templateUrl: 'form-booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class NewBookingComponent {
  public bookingForm!: FormGroup;
  clients: Client[] = [];
  planetickets: PlaneTicket[] = [];
  booking!: HotelBooking;


  constructor(
    public dialogRef: MatDialogRef<NewBookingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private bookingService: HotelBookingService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.bookingService.GetBooking(this.data.$key).valueChanges().subscribe(item => {
        this.booking = item as HotelBooking;
        let test = {Name: this.booking.Name,
                    Start: this.booking.Start,
                    End: this.booking.End,
                    voiture: this.booking.voiture,


                      };
        this.bookingForm.setValue(test);
      });
    }
    this.clients = this.data.clients;
    console.log('client' + this.data.clients);
    this.bookingService.GetBookingList();
    this.onBookingForm();
    this.planetickets = this.data.planetickets;
    console.log('planticket' + this.data.planetickets);

    
    this.bookingService.GetBookingList();
    this.onBookingForm();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void{
    if(this.data.new){
      this.onAddChoix();
      this.ResetForm();
    }else{
      this.UpdateBooking();
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    this.booking = this.bookingForm.value;
    console.log(this.booking);
    this.booking.nujours = this.nbNuits(this.booking.Start, this.booking.End);
    console.log(this.booking);


    

    this.bookingService.AddBooking(this.booking);
  }
  UpdateBooking(): void {
    this.booking = this.bookingForm.value;
    console.log(this.booking);
    this.booking.nujours = this.nbNuits(this.booking.Start, this.booking.End);
    console.log(this.booking);

    this.bookingService.UpdateBooking(this.booking);
  }
  onBookingForm() {
    this.bookingForm = this.fb.group({
      Name: [''],
      Start: [''],
      End: [''],
      voiture:[''],
      prixj:[''],
      nujours:[''],

    });
  }
  ResetForm() {
    this.bookingForm.reset();
  }

  nbNuits(start: Date, end: Date) {
    return (new Date(end).getTime() - new Date(start).getTime())/(1000 * 60 * 60 * 24);
  }

  
 
}