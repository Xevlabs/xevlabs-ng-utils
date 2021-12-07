import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { NgStrapiTableLibModule, StrapiTableService } from '@xevlabs-ng-utils/xevlabs-strapi-table';
import { UiUtilsModule } from 'libs/mlc-web-utils/src/lib/ui-utils/ui-utils.module';
import { MaterialModule } from 'libs/xevlabs-ng-utils/libs/xevlabs-ui-utils/src/lib/material/material.module';
import { ListService } from '../../core/services/list/list.service';
import { CardListComponent } from './card-list.component';

describe('CardListComponent', () => {
    let component: CardListComponent;
    let fixture: ComponentFixture<CardListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardListComponent],
            imports: [
                HttpClientModule,
                NgStrapiTableLibModule.forRoot({ baseUrl: 'https://mock.data' }),
                UiUtilsModule,
                MaterialModule,
                RouterTestingModule,
                TranslocoTestingModule
            ],
            providers: [
                StrapiTableService,
                ListService
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CardListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
