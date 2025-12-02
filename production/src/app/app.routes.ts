import { Routes } from '@angular/router';
import { Account } from './pages/not-logged/account/account';
import { HomePage } from './pages/logged/home-page/home-page';
import { KanbanComponent } from './pages/logged/kanban/kanban';
import { Dashboard } from './pages/logged/dashboard/dashboard';
export const routes: Routes = [{
    path: '', component: Account
}, {
    path: 'home', component: HomePage
}, { 
    path: 'project/:id', component: KanbanComponent
}, {
    path: 'project/:id/dashboard', component: Dashboard
}];
