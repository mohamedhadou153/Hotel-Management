import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ClientService } from 'src/app/control/client.service'; 
import { Client } from 'src/app/Models/client';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder,FormGroup } from '@angular/forms';

export interface DialogData {
  $key: string;
  new: boolean;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Address', 'Id','phone','Edit', 'Delete'];
  dataSource!: MatTableDataSource<Client>;
  clients: Client[] = [];
  client!: Client;


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.dataSource = new MatTableDataSource(this.clients);
   }
  

  ngOnInit(): void {
    this.clientService.GetClientList().snapshotChanges().subscribe(data => {
      this.clients = [];
      data.forEach(item => { 
        this.client = item.payload.toJSON() as Client;
        this.client.$key = item.key!;
        this.clients.push(this.client);
      })
      this.dataSource.data = this.clients;
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

  deleteClient(client: Client){
    this.clientService.DeleteClient(client.$key);
  }

  openDialog(): void {
    this.onDialog({new: true});
  }

  editDialog(key: string): void {
    let q = this.clients.find(item => item.$key === key) as Client;
    this.onDialog({$key: q.$key, new: false});
  }

  onDialog(data: any): void {
    const dialogRef = this.dialog.open(NewClientComponent, {
      width: '20rem',height: '25rem',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');     
    });
  }
}

@Component({
  selector: 'form-client',
  templateUrl: 'form-client.component.html',
})
export class NewClientComponent {
  public clientForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NewClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clientService: ClientService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.clientService.GetClient(this.data.$key).valueChanges().subscribe(item => this.clientForm.setValue(item));
      //console.log(this.clientForm.value);
    }
    this.clientService.GetClientList();
    this.onClientForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void{
    if(this.data.new){
      this.onAddChoix();
      this.ResetForm();
    }else{
      this.clientService.UpdateClient(this.clientForm.value);
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    console.log(this.clientForm.value);
    this.clientService.AddClient(this.clientForm.value);
  }
  onClientForm() {
    this.clientForm = this.fb.group({
      Name: [''],
      Address: [''],
      Id: [''],
      phone: [''],
    });
  }
  ResetForm() {
    this.clientForm.reset();
  }
}