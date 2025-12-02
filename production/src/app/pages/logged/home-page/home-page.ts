import { Component, OnInit } from '@angular/core';
import { SideBar } from '../../../components/logged/side-bar/side-bar';
import { AddProjectModal } from '../../../components/logged/add-project-modal/add-project-modal';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import Project from '../../../models/project';
import { Supabase } from '../../../services/supabase';
import { NgIf, NgForOf, AsyncPipe, NgStyle } from '@angular/common';
import { AddFolderModal } from '../../../components/logged/add-folder-modal/add-folder-modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBar, AddProjectModal, NgForOf, NgIf, AsyncPipe, AddFolderModal, NgStyle],
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css'],
})
export class HomePage implements OnInit {
  currentFolder = 'Acadêmico';
  defaultFolders = ['Acadêmico', 'Pessoal', 'Profissional'];
  folders: any[] = []
  projects$!: Observable<Project[]>;
  numberOfProjects = 0
  showFolderModal = false;

  form = { name: '', description: '', folder: 'Acadêmico' }

  constructor(private supabase: Supabase, private router: Router) { }


  ngOnInit(): void {
    this.supabase.foldersObservable$.subscribe(folders => {
      if (folders.length > 0) {
        this.setFolder(folders[0].name);
      }
    });

    this.supabase.ensureDefaultFolders();
    this.supabase.loadFolders();
  }

  setFolder(folder: string) {
    this.currentFolder = folder;
    this.form.folder = folder;
    this.projects$ = this.supabase.getProjectsByFolder(folder);

    this.projects$.subscribe(projects => {
      this.numberOfProjects = projects.length
    })
  }

  openFolderModal() {
    this.showFolderModal = true;
  }

  
  isDefaultFolder(name: string): boolean {
    return this.defaultFolders.includes(name)
  }

  getColorForFolder(name: string): string {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 45%)`;
  }

  goToProject(project: Project) {
    this.router.navigate([`/project/${project.id}`], { queryParams: { projectName: project.name } });
  }

  showProjectModal: boolean = false;
  toggleProjectModal() {
    this.showProjectModal = !this.showProjectModal;
  }

  async onProjectCreated(project: Project) {

    console.log('Projeto criado:', project);
    await this.supabase.loadAllProjects();
    this.projects$ = this.supabase.getProjectsByFolder(this.currentFolder);
  }
}
