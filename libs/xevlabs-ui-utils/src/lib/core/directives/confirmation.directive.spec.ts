import { ConfirmationDirective } from './confirmation.directive';
import { MatDialog } from '@angular/material/dialog';

describe('ConfirmationDirective', () => {
  it('should create an instance', () => {
    const directive = new ConfirmationDirective(MatDialog.prototype);
    expect(directive).toBeTruthy();
  });
});
