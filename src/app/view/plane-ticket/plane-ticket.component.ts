import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router ,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PlaneTicketService } from 'src/app/control/plane-ticket.service';
import { PlaneTicket} from 'src/app/Models/plane-ticket';



export interface DialogData {
  $key: string;
  new: boolean;
}
@Component({
  selector: 'app-plane-ticket',
  templateUrl: './plane-ticket.component.html',
  styleUrls: ['./plane-ticket.component.css']
})
export class PlaneTicketComponent implements OnInit {
  displayedColumns: string[] = ['type', 'marque', 'modele','puissance', 'prix_location','Categorie','Edit', 'Delete'];
  dataSource!: MatTableDataSource<PlaneTicket>;
  planeTickets: PlaneTicket[]=[];
  planeTicket!: PlaneTicket;



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private planeTicketService: PlaneTicketService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  
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
    this.onDialog({new: true});
  }

  editDialog(key: string): void {
    let q = this.planeTickets.find(item => item.$key === key) as PlaneTicket;
    this.onDialog({$key: q.$key, new: false});
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
  
}
@Component({
  selector: 'form-plane-Ticket',
  templateUrl: 'form-plane-Ticket.component.html',
  styleUrls: ['./plane-ticket.component.css'],
})
export class NewPlaneTicketComponent {
  public planeTicketForm!: FormGroup;
  categories: string []= ['essence' , 'diesel']  ; 
  types: string []= ['sedan' , 'hatchback','supercar' , 'coupe','pickup' , 'cabriolet']  ; 
  planeTicket!: PlaneTicket;

  constructor(
    public dialogRef: MatDialogRef<NewPlaneTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private planeTicketService: PlaneTicketService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.planeTicketService.GetPlaneTicket(this.data.$key).valueChanges().subscribe(item => this.planeTicketForm.setValue(item));
       
    }
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
      this.planeTicketService.UpdatePlaneTicket(this.planeTicketForm.value);
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    console.log(this.planeTicketForm.value);
    this.planeTicketService.AddPlaneTicket(this.planeTicketForm.value);
  }
  onPlaneTicketForm() {
    this.planeTicketForm = this.fb.group({
      type: [''],
      marque: [''],
      modele: [''],
      puissance:[''],
      prix_location:[''],
      Categorie:[''],
      
    });
  }
  ResetForm() {
    this.planeTicketForm.reset();
  }

 

  
  
}
