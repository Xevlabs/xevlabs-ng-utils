import { TestBed } from '@angular/core/testing';

import { ErrorHttpInterceptorService } from './error-http-interceptor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {TranslocoTestingModule} from "@ngneat/transloco";

describe('ErrorHttpInterceptorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            HttpClientTestingModule,
            RouterTestingModule,
            TranslocoTestingModule
        ],
    }));

    it('should be created', () => {
        const service: ErrorHttpInterceptorService = TestBed.get(ErrorHttpInterceptorService);
        expect(service).toBeTruthy();
    });
});
