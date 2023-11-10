import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequirementPage } from './requirement.page';
import { RequirementGuard } from 'src/app/guards/requirement.guard';
const routes: Routes = [
  {
    path: '',
    component: RequirementPage,
    canActivate: [RequirementGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementPageRoutingModule {}
