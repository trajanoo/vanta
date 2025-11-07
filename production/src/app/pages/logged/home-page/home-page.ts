import { Component } from '@angular/core';
import { SideBar } from '../../../components/logged/side-bar/side-bar';
import { AddProjectModal } from '../../../components/logged/add-project-modal/add-project-modal';

@Component({
  selector: 'app-home-page',
  imports: [SideBar, AddProjectModal],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  showProjectModal: boolean = false;

  toggleProjectModal() {
    this.showProjectModal = !this.showProjectModal;
  }
}
