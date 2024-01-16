import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { TierComponent } from './pages/tier/tier.component';
import { ListNextComponent } from './pages/list-next/list-next.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {path:'', component: HomeComponent },
  {path:'Sidebar', component: SidebarComponent },
  {path:'Workplace', component: WorkplaceComponent },
  {path:'Create', component: CreateComponent },
  {path:'Tier', component: TierComponent },
  {path:'ListNext', component: ListNextComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true}), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
