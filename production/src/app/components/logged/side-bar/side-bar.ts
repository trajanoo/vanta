import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-side-bar',
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  folders: any[] = [];
  defaultFolders = ['Acadêmico', 'Pessoal', 'Profissional'];
  openFolder: string | null = null;
  @Output() folderChange = new EventEmitter<string>();
  @Output() createFolderRequest = new EventEmitter<void>();

  constructor(private supabase: Supabase) {}

  ngOnInit() {
    this.supabase.foldersObservable$.subscribe(folders => {
      this.folders = folders;
    });

    this.supabase.loadFolders();
  }

  toggleFolderDropdown(folder: string) {
    this.openFolder = this.openFolder === folder ? null : folder;
  }

  openFolderSettings(folder: any) {
    console.log('configs da pasta: ' + folder)
  }

  isDefaultFolder(name: string): boolean {
    return this.defaultFolders.includes(name)
  }

  selectFolder(folder: string) {
    this.folderChange.emit(folder);
  }

  getColorForFolder(name: string): string {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 60%, 45%)`;
}

  openFolderModal() {
    this.createFolderRequest.emit();
  }
}
