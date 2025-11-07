import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectModal } from './add-project-modal';

describe('AddProjectModal', () => {
  let component: AddProjectModal;
  let fixture: ComponentFixture<AddProjectModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProjectModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
