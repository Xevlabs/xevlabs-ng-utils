import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslocoService } from '@ngneat/transloco';
import { SnackBarTypeEnum } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private toast: HotToastService, private transloco: TranslocoService) {
  }

  showSnackBar(type: SnackBarTypeEnum, titleKey: string, messageKeys?: string[]) {
    let HtmlContent = `
          <h4 class='bold no-margin'>${this.transloco.translate(titleKey)}</h4>
        `;
    if (messageKeys) {
        messageKeys.forEach((messageKey) => {
            HtmlContent += `<p class='no-margin-bottom'>${this.transloco.translate(messageKey)}</p>`;
        })
    }
    switch (type) {
      case SnackBarTypeEnum.SUCCESS:
        return this.toast.success(HtmlContent, {
          className: 'xevlabs-ng-utils-snackbar ' + type,
          dismissible: true,
        });
      case SnackBarTypeEnum.ERROR:
        return this.toast.error(HtmlContent, { className: 'xevlabs-ng-utils-snackbar ' + type, dismissible: true });
      case SnackBarTypeEnum.WARNING:
        return this.toast.warning(HtmlContent, { className: 'xevlabs-ng-utils-snackbar ' + type, dismissible: true });
    }
  }

  getObservableSnackbar(loadingKey: string, successKey: string, errorKey: string) {
      return this.toast.observe({
      loading:
        {
          content: `<h4 class='bold no-margin'>${this.transloco.translate(loadingKey + '.TITLE')}</h4>
                    <p class='no-margin-bottom'>${this.transloco.translate(loadingKey+ '.MESSAGE')}</p>`,
          className: 'xevlabs-ng-utils-snackbar LOADING',
        },
      success: {
        content: `<h4 class='bold no-margin'>${this.transloco.translate(successKey + '.TITLE')}</h4>
                  <p class='no-margin-bottom'>${this.transloco.translate(successKey+ '.MESSAGE')}</p>`,
        className: 'xevlabs-ng-utils-snackbar SUCCESS',
        dismissible: true
      },
      error: {
        content: `<h4 class='bold no-margin'>${this.transloco.translate(errorKey + '.TITLE')}</h4>
                  <p class='no-margin-bottom'>${this.transloco.translate(errorKey+ '.MESSAGE')}</p>`,
        className: 'xevlabs-ng-utils-snackbar ERROR',
        dismissible: true
      }
    })
  }
}
