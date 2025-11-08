import { Component, OnInit } from '@angular/core';
import { SideBar } from '../../../components/logged/side-bar/side-bar';
import { AddProjectModal } from '../../../components/logged/add-project-modal/add-project-modal';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Project from '../../../models/project';
import { Supabase } from '../../../services/supabase';
import { NgIf, NgForOf, AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBar, AddProjectModal, NgForOf, NgIf, AsyncPipe],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage implements OnInit {
  currentFolder = 'Acadêmico';
  projects$!: Observable<Project[]>;

  form = { name: '', description: '', folder: 'Acadêmico' }

  constructor(private supabase: Supabase, private router: Router) {}

  ngOnInit(): void {
    this.setFolder('Acadêmico')
  }

  setFolder(folder: string) {
    this.currentFolder = folder;
    this.form.folder = folder;
    this.projects$ = this.supabase.getProjectsByFolder(folder);
  }

  goToProject(project: Project) {
    this.router.navigate([`/logged/kanban/${project.id}`]);
  }

  showProjectModal: boolean = false;
  toggleProjectModal() {
    this.showProjectModal = !this.showProjectModal;
  }

    async onProjectCreated(project: Project) {
    // o Supabase já atualiza o BehaviorSubject em createProject,
    // então aqui apenas logamos ou podemos navegar ao projeto criado se desejar:
    console.log('Projeto criado:', project);
    await this.supabase.loadAllProjects();
    this.projects$ = this.supabase.getProjectsByFolder(this.currentFolder);
  }
}
