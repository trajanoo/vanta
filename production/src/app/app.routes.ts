import { Routes } from '@angular/router';
import { LoginPage } from './pages/not-logged/login-page/login-page';
import { HomePage } from './pages/logged/home-page/home-page';
import { KanbanComponent } from './pages/logged/kanban/kanban';
export const routes: Routes = [{
    path: '', component: LoginPage
}, {
    path: 'home', component: HomePage
}, { 
    path: 'logged/kanban/:id', component: KanbanComponent
} ];
