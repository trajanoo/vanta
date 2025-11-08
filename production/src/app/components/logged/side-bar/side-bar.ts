import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  imports: [],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  @Output() folderChange = new EventEmitter<string>();

  selectFolder(folder: string) {
    this.folderChange.emit(folder);
  }
}
