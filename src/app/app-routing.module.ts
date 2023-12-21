import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { TierComponent } from './pages/tier/tier.component';

const routes: Routes = [
  {path:'', component: HomeComponent },
  {path:'Sidebar', component: SidebarComponent },
  {path:'Workplace', component: WorkplaceComponent },
  {path:'Create', component: CreateComponent },
  {path:'Tier', component: TierComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
