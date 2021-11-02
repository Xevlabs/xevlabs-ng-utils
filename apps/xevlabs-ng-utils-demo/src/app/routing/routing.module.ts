import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteWrapperComponent } from '../auto-complete-wrapper/auto-complete-wrapper.component';
import { TestNavComponent } from '../test-nav/test-nav.component';

const routes: Routes = [
    {
        path: '',
        component: TestNavComponent
    },
    {
        path: 'auto-complete',
        component: AutoCompleteWrapperComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule { }
