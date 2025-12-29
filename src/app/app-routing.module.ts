import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { CreateComponent } from './pages/create/create.component';
import { TierComponent } from './pages/tier/tier.component';
import { FormsModule } from '@angular/forms';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';
import { PendingListComponent } from './pages/pending-list/pending-list.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { GraphicsPageComponent } from './pages/graphics-page/graphics-page.component';
import { CollectionsComponent } from './pages/collections/collections.component';

const routes: Routes = [
  {path:'', component: DiscoverPageComponent },
  {path:'Sidebar', component: SidebarComponent },
  {path:'Workplace', component: WorkplaceComponent },
  {path:'Create', component: CreateComponent },
  {path:'Tier', component: TierComponent },
  {path:'PendingList', component: PendingListComponent },
  {path:'Profile', component: ProfilePageComponent },
  {path:'Graphics', component: GraphicsPageComponent },
  {path:'Collections', component: CollectionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true}), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
