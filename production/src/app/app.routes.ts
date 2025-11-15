import { Routes } from '@angular/router';
import { Account } from './pages/not-logged/account/account';
import { HomePage } from './pages/logged/home-page/home-page';
import { KanbanComponent } from './pages/logged/kanban/kanban';
export const routes: Routes = [{
    path: '', component: Account
}, {
    path: 'home', component: HomePage
}, { 
    path: 'logged/kanban/:id', component: KanbanComponent
} ];
