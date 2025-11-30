import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { AfterViewInit } from '@angular/core';
import {
  Chart,
  ArcElement,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  DoughnutControllerChartOptions
} from 'chart.js';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(
  ArcElement,
  BarElement,
  DoughnutController,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface Task {
  id: string;
  project_id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  column: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild('statusChart') statusChart!: ElementRef<HTMLCanvasElement>
  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>

  columns = ['to-do', 'in-progress', 'done', 'pendent'];
  projectId: string | null = null;
  tasks: Record<string, Task[]> = {
    'to-do': [],
    'in-progress': [],
    'done': [],
    'pendent': []
  };

  total = 0;
  todo = 0;
  done = 0;
  inProgress = 0;
  pendent = 0;
  completionRate = 0;

  constructor(private route: ActivatedRoute, private supabase: Supabase, private router: Router) { }

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    await this.loadTasks();
  }

  async loadTasks() {
    const { data, error } = await this.supabase.supabase
      .from('tasks')
      .select('*')
      .eq('project_id', this.projectId);

    if (error) {
      console.error('erro ao carregar tasks:', error);
      return;
    }

    console.log('tarefas carregadas:', data);

    this.columns.forEach(col => {
      this.tasks[col] = data.filter((t: Task) => t.column === col);
    });

    this.updateCounts();
    this.generateCharts();
  }

  updateCounts() {
    this.total = 0;
    this.todo = this.tasks['to-do'].length;
    this.inProgress = this.tasks['in-progress'].length;
    this.done = this.tasks['done'].length;
    this.pendent = this.tasks['pendent'].length;

    this.total = this.todo + this.inProgress + this.done + this.pendent;

    if(this.total > 0) {
      this.completionRate = Math.round((this.done / this.total) * 100);
    } else {
      this.completionRate = 0;
    }
  }

  generateCharts() {
    const ctx1 = this.statusChart.nativeElement.getContext('2d');
    const ctx2 = this.barChart.nativeElement.getContext('2d');

    new Chart(ctx1!, {
      type: 'doughnut',
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            title: {
              display: true,
              text: ' ',   // título vazio
              padding: { bottom: 20 } // espaço entre gráfico e legenda
            }
          }
        }
      },
      data: {
        labels: ['To Do', 'In Progress', 'Done', 'Pendent'],
        datasets: [
          {
            data: [this.todo, this.inProgress, this.done, this.pendent],
            backgroundColor: [
              '#3B82F6',
              '#8B5CF6',
              '#10B981',
              '#EF4444'
            ],
            borderWidth: 2,
            borderColor: '#11111'
          }
        ]
      }
    });

    new Chart(ctx2!, {
      type: 'bar',
      data: {
        labels: ['To Do', 'In Progress', 'Done', 'Pendent'],
        datasets: [
          {
            data: [this.todo, this.inProgress, this.done, this.pendent],
            backgroundColor: [
              '#3B82F6',
              '#8B5CF6',
              '#10B981',
              '#EF4444'
            ],
          }
        ]
      }
    })
  }


  goToHomePage() {
    this.router.navigate(['/home'])
  }

}
