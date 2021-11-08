import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'xevlabs-ng-utils-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  public content!: string;
  public translationContent!: string;
  constructor( @Inject(MAT_DIALOG_DATA) public data: {
                 content: string;
                 translationContent: string
               },
               private dialogRef: MatDialogRef<ConfirmationModalComponent>) {

  }

  ngOnInit(): void {
    if (this.data) {
      this.content = this.data.content;
      this.translationContent = this.data.translationContent;
      console.log(this.translationContent)
    }
  }

  close() {
    this.dialogRef.close();
  }
}
