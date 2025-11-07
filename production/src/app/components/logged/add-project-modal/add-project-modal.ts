import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-project-modal',
  imports: [],
  templateUrl: './add-project-modal.html',
  styleUrl: './add-project-modal.css',
})
export class AddProjectModal {
  @Input() showProjectModal!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  toggleProjectModal() {
    this.closeModal.emit();
  }
}
