import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotToastModule } from '@ngneat/hot-toast';
import { TranslocoModule } from '@ngneat/transloco';
import { SnackBarService } from './services/snack-bar/snack-bar.service';

@NgModule({
  imports: [CommonModule, HotToastModule, TranslocoModule],
  providers: [SnackBarService]
})
export class XevlabsSnackbarModule {}
