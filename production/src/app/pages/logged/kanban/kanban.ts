import { Component, HostListener, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Supabase } from '../../../services/supabase';
import { CommonModule, NgClass, TitleCasePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, timestamp } from 'rxjs';

interface Task {
  id: string;
  project_id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  column: string;
}

@Component({
  selector: 'app-kanban',
  imports: [CommonModule, TitleCasePipe, DragDropModule, NgClass, FormsModule],
  standalone: true,
  templateUrl: './kanban.html',
  styleUrls: ['./kanban.css']
})
export class KanbanComponent implements OnInit {
  columns = ['to-do', 'in-progress', 'done', 'pendent'];
  connectedDropLists = this.columns
  tasks: Record<string, Task[]> = {
    'to-do': [],
    'in-progress': [],
    'done': [],
    'pendent': []
  };

  modalVisible = false;
  modalTitle = 'Nova Tarefa';
  taskTitle = '';
  taskPriority: 'low' | 'medium' | 'high' = 'low';
  taskDate = '';
  currentColumn = 'to-do';
  projectName: string | null = null;
  editingTask: Task | null = null;
  projectId: string | null = null;
  searchText: string = '';
  historyOpen = false;
  history: any[] = [];
  contextMenuOpenFor: string | null = null
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private supabase: Supabase, private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.queryParamMap.get('projectName')

    if (!this.projectId) {
      console.error('Nenhum projeto selecionado!');
      return;
    }

    if (name) {
      this.projectName = name
    } else {
      const { data, error } = await this.supabase.supabase
        .from('projects')
        .select('name')
        .eq('id', this.projectId)
        .single()
    }

    console.log('Projeto atual:', this.projectId, this.projectName);
    await this.loadTasks();
  }

  async loadTasks() {
    const { data, error } = await this.supabase.supabase
      .from('tasks')
      .select('*')
      .eq('project_id', this.projectId);

    if (error) {
      console.error('Erro ao carregar tasks:', error);
      return;
    }

    console.log('Tarefas carregadas:', data);

    this.columns.forEach(col => {
      this.tasks[col] = data.filter((t: Task) => t.column === col);
    });
  }

  async openHistory() {
    this.historyOpen = true;

    const { data, error } = await this.supabase.supabase.from("history").select("*").eq("project_id", this.projectId)
    if (!error) {
      this.history = data
    }
  }

  closeHistory() {
    this.historyOpen = false
  }

  openModal(column: string, task?: Task) {
    this.currentColumn = column;
    this.modalVisible = true;
    if (task) {
      this.modalTitle = 'Editar Tarefa';
      this.editingTask = task;
      this.taskTitle = task.title;
      this.taskPriority = task.priority;
      this.taskDate = task.date;
    } else {
      this.modalTitle = 'Nova Tarefa';
      this.taskTitle = '';
      this.taskPriority = 'low';
      this.taskDate = '';
      this.editingTask = null;
    }
  }

  openContextMenu(e: MouseEvent, taskId: string) {
    e.stopPropagation();
    this.contextMenuOpenFor = taskId

    this.contextMenuPosition = {
      x: e.clientX,
      y: e.clientY
    }
  }

  closeContextMenu() {
    this.contextMenuOpenFor = null
  }

  @HostListener('document:click', ['$event'])
  onClickOutside() {
    this.closeContextMenu()
  }

  get filteredTasks() {
    if (!this.searchText.trim()) return this.tasks

    const lower = this.searchText.toLowerCase();

    const filtered: Record<string, Task[]> = {
      'to-do': [],
      'in-progress': [],
      'done': [],
      'pendent': []
    };

    this.columns.forEach(col => {
      filtered[col] = this.tasks[col].filter(task =>
        task.title.toLowerCase().includes(lower)
      );
    });

    return filtered
  }

  closeModal() {
    this.modalVisible = false;
  }

  async saveTask() {
    if (!this.taskTitle || !this.taskDate) return alert('Preencha todos os campos');
    if (!this.projectId) return console.error('Sem projectId, impossível salvar.');

    const newTask = {
      project_id: this.projectId, 
      title: this.taskTitle,
      priority: this.taskPriority,
      date: this.taskDate,
      column: this.currentColumn
    };

    if (this.editingTask) {
      const { error } = await this.supabase.supabase
        .from('tasks')
        .update(newTask)
        .eq('id', this.editingTask.id);

      if (error) return console.error(error);
      Object.assign(this.editingTask, newTask);
    } else {
      const { data, error } = await this.supabase.supabase
        .from('tasks')
        .insert([newTask])
        .select();

      if (error) return console.error(error);
      this.tasks[this.currentColumn].push(data[0]);
    }

    await this.supabase.supabase.from("history").insert([{
      project_id: this.projectId,
      action: this.editingTask ? 'Editou task' : 'Criou task',
      task_title: this.taskTitle
    }])

    this.closeModal();
  }

  async deleteTask(id: string) {
    await this.supabase.supabase.from('tasks').delete().eq('id', id);
    this.columns.forEach(col => {
      this.tasks[col] = this.tasks[col].filter(t => t.id !== id);
    });
  }

  goToHomePage() {
    this.router.navigate(['/home'])
  }

  async drop(event: CdkDragDrop<Task[]>, targetColumn: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.column = targetColumn;

      const { error } = await this.supabase.supabase
        .from('tasks')
        .update({ column: targetColumn })
        .eq('id', task.id);

      if (error) console.error(error);

      await this.supabase.supabase.from("history").insert([{
        project_id: this.projectId,
        action: `Moveu task para coluna ${targetColumn}`,
        task_title: task.title
      }])

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
