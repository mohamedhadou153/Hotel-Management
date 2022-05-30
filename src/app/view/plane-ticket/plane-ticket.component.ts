import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PlaneTicketService } from 'src/app/control/plane-ticket.service';
import { PlaneTicket, Ville } from 'src/app/Models/plane-ticket';
import { Client } from 'src/app/Models/client';
import { ClientService } from 'src/app/control/client.service';
import { Destination } from 'src/app/Models/destination';
import { RoomType } from 'src/app/Models/room-type';


export interface DialogData {
  $key: string;
  new: boolean;
  clients: Client[];
}
@Component({
  selector: 'app-plane-ticket',
  templateUrl: './plane-ticket.component.html',
  styleUrls: ['./plane-ticket.component.css']
})
export class PlaneTicketComponent implements OnInit {


  displayedColumns: string[] = ['Name', 'Depart', 'Arrivee','Start', 'End','Categorie','Prix','Edit', 'Delete'];
  dataSource!: MatTableDataSource<PlaneTicket>;

  planeTickets: PlaneTicket[]=[];
  planeTicket!: PlaneTicket;

  clients: Client[] = [];
  client!: Client;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private planeTicketService: PlaneTicketService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private clientService: ClientService,
  ) {
    this.dataSource = new MatTableDataSource(this.planeTickets);

   }

  ngOnInit(): void {
    this.planeTicketService.GetPlaneTicketList().snapshotChanges().subscribe(data => {
      this.planeTickets = [];
      data.forEach(item => { 
        this.planeTicket = item.payload.toJSON() as PlaneTicket;
        this.planeTicket.$key = item.key!;
        this.planeTickets.push(this.planeTicket);
      })
      this.dataSource.data = this.planeTickets;
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("applyFilter is");
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deletePlaneTicket(planeTicket: PlaneTicket){
    this.planeTicketService.DeletePlaneTicket(this.planeTicket.$key);
  }

  openDialog(): void {
    this.onDialog({clients: this.clients, new: true});
    console.log(this.clients);
  }

  editDialog(key: string): void {
    let q = this.planeTickets.find(item => item.$key === key) as PlaneTicket;
    this.onDialog({$key: q.$key, clients: this.clients, new: false});
  }

  onDialog(data: any): void {
    const dialogRef = this.dialog.open(NewPlaneTicketComponent, {
      width: '20rem',height: '30rem',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');     
    });
  }
  getClient(key: string) : string | undefined{
    return this.clients.find(c => c.$key === key)?.Name;
  }
}
@Component({
  selector: 'form-plane-Ticket',
  templateUrl: 'form-plane-Ticket.component.html',
  styleUrls: ['./plane-ticket.component.css'],
})
export class NewPlaneTicketComponent {
  public planeTicketForm!: FormGroup;
  categories: string []= ['Economie' , 'Business']  ; 
  clients: Client[] = [];
  planeTicket!: PlaneTicket;
  destinations: Destination[]= ['Agadir' , 'Marrakesh' , 'Tanger' ,'Casablanca' ,'Rabat'] ;

  constructor(
    public dialogRef: MatDialogRef<NewPlaneTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private planeTicketService: PlaneTicketService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.planeTicketService.GetPlaneTicket(this.data.$key).valueChanges().subscribe(item => {
        this.planeTicket = item as PlaneTicket;
        let test = {Name: this.planeTicket.Name,
                    Start: this.planeTicket.Start,
                    End: this.planeTicket.End,
                    Depart: this.planeTicket.Depart,
                    Arrivee: this.planeTicket.Arrivee,
                    Categorie: this.planeTicket.Categorie,
                    };
        this.planeTicketForm.setValue(test);
      });
    }
    this.clients = this.data.clients;
    console.log('client' + this.data.clients);
    this.planeTicketService.GetPlaneTicketList();
    this.onPlaneTicketForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void{
    if(this.data.new){
      this.onAddChoix();
      this.ResetForm();
    }else{
      this.UpdatePlaneTicket();
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    this.planeTicket = this.planeTicketForm.value;
    
    this.planeTicket.Prix = this.calculerPrix(this.planeTicket.Depart, this.planeTicket.Arrivee, this.planeTicket.Categorie);
    console.log(this.planeTicket.End);
    this.planeTicket.Prix *= this.planeTicket.End.toString() ===  ""? 1 : 1.5;

    this.planeTicketService.AddPlaneTicket(this.planeTicket);
  }
  UpdatePlaneTicket(): void {
    this.planeTicket = this.planeTicketForm.value;
    this.planeTicket.Prix = this.calculerPrix(this.planeTicket.Depart, this.planeTicket.Arrivee, this.planeTicket.Categorie);
    console.log(this.planeTicket.Prix);
    this.planeTicket.Prix *= this.planeTicket.End.toString() ===  ""? 1 : 1.5;
    console.log(this.planeTicket);

    this.planeTicketService.UpdatePlaneTicket(this.planeTicket);
  }
  onPlaneTicketForm() {
    this.planeTicketForm = this.fb.group({
      Name: [''],
      Start: [''],
      End: [''],
      Arrivee:[''],
      Depart:[''],
      Categorie:[''],
      
    });
  }
  ResetForm() {
    this.planeTicketForm.reset();
  }

 

  calculerPrix( depart: string, arivee: string, categorie: string) {
    let prix: number;
    let coefD: number = Object.entries(Ville).find(([k,v]) => k == depart)?.[1] as number;
    let coefA: number = Object.entries(Ville).find(([k,v]) => k == arivee)?.[1] as number;
    let cat: number = categorie == 'Economie'? 10 : 20;
    prix = (coefA + coefD) * cat;
    return prix;
  }
  
}
