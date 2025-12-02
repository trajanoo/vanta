import { Component, Output, EventEmitter, NgModule } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-add-folder-modal',
  templateUrl: './add-folder-modal.html'
})
export class AddFolderModal {
  @Output() close = new EventEmitter();
  @Output() created = new EventEmitter<string>();

  name = '';

  constructor(private supabase: Supabase) {}

  async create() {
    const folder = await this.supabase.createFolder(this.name);
    this.created.emit(folder.name);
    this.close.emit();
  }
}
