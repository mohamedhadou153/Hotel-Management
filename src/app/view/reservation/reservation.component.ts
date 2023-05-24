import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { reservationService } from 'src/app/control/reservation.service';
import { reservation } from 'src/app/Models/reservation';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ClientService } from 'src/app/control/client.service'; 
import { Client } from 'src/app/Models/client';
import { voiture } from 'src/app/Models/voiture';
import { voitureService } from 'src/app/control/voiture.service';



export interface DialogData {
  $key: string;
  new: boolean;
  clients: Client[];
  voitures: voiture[];
}

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class reservationComponent implements OnInit {

  displayedColumns: string[] = ['Name','voiture','prixj', 'Start', 'End','nujours','Prix','Edit', 'Delete','Facture'];
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
    private route: ActivatedRoute,
    public dialog: MatDialog,
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
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("applyFilter is");
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  deletereservation(reservation: reservation){
    this.reservationService.Deletereservation(reservation.$key);
  }

  openDialog(): void {
    this.onDialog({clients: this.clients,voitures :this.voitures, new: true});
    console.log(this.clients);
    
  }

  editDialog(key: string): void {
    let q = this.reservations.find(item => item.$key === key) as reservation;
    this.onDialog({$key: q.$key, clients: this.clients,voitures: this.voitures, new: false});
  }

  onDialog(data: any): void {
    const dialogRef = this.dialog.open(NewreservationComponent, {
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
    return this.voitures.find(c => c.$key === key)?.marque+' ' + this.voitures.find(c => c.$key === key)?.modele;
  }
  getprixj(key: string) : number | undefined{
    return this.voitures.find(c => c.$key === key)?.prix_location;
  }
  getprix(key: string ,prixj:number) : number | undefined{
    let a  = this.voitures.find(c => c.$key === key)?.prix_location||0; 
    return (a * prixj);
  }
}
@Component({
  selector: 'form-reservation',
  templateUrl: 'form-reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class NewreservationComponent {
  public reservationForm!: FormGroup;
  clients: Client[] = [];
  voitures: voiture[] = [];
  reservation!: reservation;


  constructor(
    public dialogRef: MatDialogRef<NewreservationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private reservationService: reservationService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.reservationService.Getreservation(this.data.$key).valueChanges().subscribe(item => {
        this.reservation = item as reservation;
        let test = {Name: this.reservation.Name,
                    Start: this.reservation.Start,
                    End: this.reservation.End,
                    voiture: this.reservation.voiture,


                      };
        this.reservationForm.setValue(test);
      });
    }
    this.clients = this.data.clients;
    console.log('client' + this.data.clients);
    this.reservationService.GetreservationList();
    this.onreservationForm();
    this.voitures = this.data.voitures;
    console.log('planticket' + this.data.voitures);

    
    this.reservationService.GetreservationList();
    this.onreservationForm();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void{
    if(this.data.new){
      this.onAddChoix();
      this.ResetForm();
    }else{
      this.Updatereservation();
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    this.reservation = this.reservationForm.value;
    console.log(this.reservation);
    this.reservation.nujours = this.nbNuits(this.reservation.Start, this.reservation.End);
    console.log(this.reservation);


    

    this.reservationService.Addreservation(this.reservation);
  }
  Updatereservation(): void {
    this.reservation = this.reservationForm.value;
    console.log(this.reservation);
    this.reservation.nujours = this.nbNuits(this.reservation.Start, this.reservation.End);
    console.log(this.reservation);

    this.reservationService.Updatereservation(this.reservation);
  }
  onreservationForm() {
    this.reservationForm = this.fb.group({
      Name: [''],
      Start: [''],
      End: [''],
      voiture:[''],
      prixj:[''],
      nujours:[''],

    });
  }
  ResetForm() {
    this.reservationForm.reset();
  }

  nbNuits(start: Date, end: Date) {
    return (new Date(end).getTime() - new Date(start).getTime())/(1000 * 60 * 60 * 24);
  }

  
 
}