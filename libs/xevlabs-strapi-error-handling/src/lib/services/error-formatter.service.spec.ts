import { TestBed } from '@angular/core/testing';
import { ErrorFormatterService } from './error-formatter.service';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {TranslocoTestingModule} from "@ngneat/transloco";


describe('ErrorFormatterService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            BrowserTestingModule,
            HttpClientTestingModule,
            TranslocoTestingModule,
        ],
        providers: [ErrorFormatterService],

    }));

    it('should be created', () => {
        const service: ErrorFormatterService = TestBed.get(ErrorFormatterService);
        expect(service).toBeTruthy();
    });
});
