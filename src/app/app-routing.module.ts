import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { LibraryComponent } from './pages/library/library.component';
import { CreateComponent } from './pages/create/create.component';
import { TierComponent } from './pages/tier/tier.component';
import { ListNextComponent } from './pages/list-next/list-next.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';

const routes: Routes = [
  {path:'', component: HomeComponent },
  {path:'library', component: LibraryComponent },
  {path:'Sidebar', component: SidebarComponent },
  {path:'Workplace', component: WorkplaceComponent },
  {path:'Create', component: CreateComponent },
  {path:'Tier', component: TierComponent },
  {path:'ListNext', component: ListNextComponent },
  {path:'DiscoverPage', component: DiscoverPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true}), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
