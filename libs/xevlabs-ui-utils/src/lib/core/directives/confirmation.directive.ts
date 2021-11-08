import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component'

@Directive({
  selector: '[xevlabsNgUtilsConfirmation]'
})
export class ConfirmationDirective {
  @Input() content!: string;
  @Input() translationContent!: string;
  @Input() isActive = true;
  @Output() confirmation = new EventEmitter();

  constructor(private matDialog: MatDialog) {
  }

  @HostListener('click', ['$event']) onClick($event: Event) {
    $event.stopPropagation();
    if (this.isActive) {
      this.matDialog.open(ConfirmationModalComponent, {
        panelClass: ['confirmation-modal', 'no-size-modal'],
        data: {
          content: this.content,
          translationContent: this.translationContent
        }
      }).afterClosed()
        .subscribe((confirmation) => {
          if (confirmation) {
            this.confirmation.emit();
          }
        })
    } else {
      this.confirmation.emit();
    }
  }

}
