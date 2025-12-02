import { Component, EventEmitter, Input, Output } from '@angular/core';
import Project from '../../../models/project';
import { Supabase } from '../../../services/supabase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-project-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-project-modal.html',
  styleUrls: ['./add-project-modal.css'],
})
export class AddProjectModal {

  @Input() showProjectModal!: boolean;
  @Input() folders: { name: string }[] = [];

  @Output() closeModal = new EventEmitter<void>();
  @Output() createdProject = new EventEmitter<Project>();

  constructor(private supabase: Supabase) {}

  toggleProjectModal() {
    this.closeModal.emit();
  }

  async submit(name: string, description: string, folder: string) {

    if (!name?.trim()) {
      console.warn('nome do projeto é obrigatório');
      return;
    }

    const payload: Partial<Project> = {
      name: name.trim(),
      description: description?.trim() || undefined,
      folder: folder, // agora funciona com qualquer pasta
    };

    try {
      const created = await this.supabase.createProject(payload as Project);
      this.createdProject.emit(created);
      this.toggleProjectModal();
    } catch (err) {
      console.error('Erro ao criar projeto: ', err);
    }
  }
}
