import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router ,ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { voitureService } from 'src/app/control/voiture.service';
import { voiture} from 'src/app/Models/voiture';



export interface DialogData {
  $key: string;
  new: boolean;
}
@Component({
  selector: 'app-voiture',
  templateUrl: './voiture.component.html',
  styleUrls: ['./voiture.component.css']
})
export class voitureComponent implements OnInit {
  displayedColumns: string[] = ['type', 'marque', 'modele','puissance', 'prix_location','Categorie','Edit', 'Delete'];
  dataSource!: MatTableDataSource<voiture>;
  voitures: voiture[]=[];
  voiture!: voiture;



  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private voitureService: voitureService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  
  ) {
    this.dataSource = new MatTableDataSource(this.voitures);

   }

  ngOnInit(): void {
    this.voitureService.GetvoitureList().snapshotChanges().subscribe(data => {
      this.voitures = [];
      data.forEach(item => { 
        this.voiture = item.payload.toJSON() as voiture;
        this.voiture.$key = item.key!;
        this.voitures.push(this.voiture);
      })
      this.dataSource.data = this.voitures;
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

  deletevoiture(voiture: voiture){
    this.voitureService.Deletevoiture(this.voiture.$key);
  }

  openDialog(): void {
    this.onDialog({new: true});
  }

  editDialog(key: string): void {
    let q = this.voitures.find(item => item.$key === key) as voiture;
    this.onDialog({$key: q.$key, new: false});
  }

  onDialog(data: any): void {
    const dialogRef = this.dialog.open(NewvoitureComponent, {
      width: '20rem',height: '30rem',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');     
    });
  }
  
}
@Component({
  selector: 'form-voiture',
  templateUrl: 'form-voiture.component.html',
  styleUrls: ['./voiture.component.css'],
})
export class NewvoitureComponent {
  public voitureForm!: FormGroup;
  categories: string []= ['essence' , 'diesel']  ; 
  types: string []= ['sedan' , 'hatchback','supercar' , 'coupe','pickup' , 'cabriolet']  ; 
  voiture!: voiture;

  constructor(
    public dialogRef: MatDialogRef<NewvoitureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private voitureService: voitureService,
    public fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if(!this.data.new){
      this.voitureService.Getvoiture(this.data.$key).valueChanges().subscribe(item => this.voitureForm.setValue(item));
       
    }
    this.voitureService.GetvoitureList();
    this.onvoitureForm();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void{
    if(this.data.new){
      this.onAddChoix();
      this.ResetForm();
    }else{
      this.voitureService.Updatevoiture(this.voitureForm.value);
      this.onNoClick();
    }
  }
  onAddChoix(): void {
    console.log(this.voitureForm.value);
    this.voitureService.Addvoiture(this.voitureForm.value);
  }
  onvoitureForm() {
    this.voitureForm = this.fb.group({
      type: [''],
      marque: [''],
      modele: [''],
      puissance:[''],
      prix_location:[''],
      Categorie:[''],
      
    });
  }
  ResetForm() {
    this.voitureForm.reset();
  }

 

  
  
}
