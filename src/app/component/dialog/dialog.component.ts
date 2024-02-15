import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  newaccbalance: string;
  newihbbalance: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],

})

export class DialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }
  ngOnInit(): void {

    this.data = {
      newaccbalance: '0',
      newihbbalance: '0'
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}