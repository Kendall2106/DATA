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
import { AlbumInfoPageComponent } from './pages/album-info-page/album-info-page.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guard/auth.guard';

const routes: Routes = [
  {path:'', component: DiscoverPageComponent, canActivate: [authGuard] },
  {path:'Sidebar', component: SidebarComponent, canActivate: [authGuard] },
  {path:'Workplace', component: WorkplaceComponent, canActivate: [authGuard] },
  {path:'Settings', component: CreateComponent, canActivate: [authGuard] },
  {path:'Tier', component: TierComponent, canActivate: [authGuard] },
  {path:'Tier/:uid', component: TierComponent, canActivate: [authGuard] },
  {path:'PendingList', component: PendingListComponent, canActivate: [authGuard] },
  {path:'Profile', component: ProfilePageComponent, canActivate: [authGuard] },
  {path:'Profile/:uid', component: ProfilePageComponent, canActivate: [authGuard] },
  {path:'Graphics', component: GraphicsPageComponent, canActivate: [authGuard] },
  {path:'Collections', component: CollectionsComponent, canActivate: [authGuard] },
  {
  path: 'AlbumInfo/:idAlbum',
  component: AlbumInfoPageComponent,
  canActivate: [authGuard]
},
  {path:'Login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true}), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
