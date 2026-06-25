import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskRequest, TaskSummary } from './models/task.model';
import { TaskService } from './services/task.service';
import { DashboardSummaryComponent } from './components/dashboard-summary/dashboard-summary.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ModalComponent } from './components/modal/modal.component';
import { TaskFiltersComponent, TaskFilters } from './components/task-filters/task-filters.component';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './reusable/spinner/spinner.component';
import { LoaderService } from './core/loader.service';

const TASKS_CACHE_KEY = 'task-management:cached-tasks';

/**
 * Root component for the Task Management app.
 *
 * Layout: dashboard summary is the landing view at the top of the
 * page, followed by search/filter controls and the task grid.
 * "Add Task" opens a popup modal instead of an always-visible form,
 * keeping the dashboard the primary focus.
 *
 * State & structure approach:
 * - AppComponent owns all shared state (tasks, summary, filters,
 *   modal visibility) and is the single source of truth fetched
 *   from the backend.
 * - Child components (dashboard-summary, task-filters, task-form,
 *   task-list, modal) are presentational: they receive data via
 *   @Input and emit user actions via @Output.
 * - TaskService centralizes all HTTP calls to the Spring Boot backend.
 * - Search + status filtering happen entirely client-side against
 *   the already-loaded task list, so results update instantly.
 * - The last successfully fetched task list is cached to
 *   localStorage so it can still be viewed if the backend becomes
 *   unreachable (offline viewing of previously loaded tasks).
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSummaryComponent,
    TaskFormComponent,
    TaskListComponent,
    ModalComponent,
    TaskFiltersComponent,
    RouterOutlet,
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  summary: TaskSummary = { totalTasks: 0, pendingTasks: 0, completedTasks: 0 };

  loading = false;
  apiError = '';
  isOffline = false;
  showAddTaskModal = false;

  private currentFilters: TaskFilters = { search: '', status: 'ALL' };
  @ViewChild(TaskListComponent)
taskListComponent!: TaskListComponent;

  constructor(private taskService: TaskService,
      private cdr: ChangeDetectorRef,
      public loaderService:LoaderService,
        private zone: NgZone
      

  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    // this.loading = true;
    this.apiError = '';

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isOffline = false;
        this.applyFilters();
        this.cacheTasks(tasks);
          this.taskService.getSummary().subscribe({
      next: (summary) => {
        (this.summary = summary)
           
      },
      error: () => {
        // If the summary call also fails, derive it from cached tasks
        // so the dashboard doesn't show stale/blank numbers.
        if (this.isOffline) {
          this.summary = this.computeSummaryFromTasks(this.tasks);
        }
      }
    });
        // this.loading = false;
      },
      error: () => {
        this.loadFromCacheOrShowError();
        this.loading = false;
      }
    });

  
  }

  private loadFromCacheOrShowError(): void {
    const cached = this.readCachedTasks();
    if (cached && cached.length > 0) {
      this.tasks = cached;
      this.isOffline = true;
      this.apiError = 'Backend unreachable — showing previously loaded tasks (offline mode). Changes will not be saved until the connection is restored.';
      this.applyFilters();
      this.summary = this.computeSummaryFromTasks(cached);
    } else {
      this.apiError = 'Unable to reach the backend. Make sure the Spring Boot server is running on port 8080.';
    }
  }

  private computeSummaryFromTasks(tasks: Task[]): TaskSummary {
    const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
    return {
      totalTasks: tasks.length,
      completedTasks: completed,
      pendingTasks: tasks.length - completed
    };
  }

  private cacheTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TASKS_CACHE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage may be unavailable (e.g. private browsing) -- safe to ignore.
    }
  }

  private readCachedTasks(): Task[] | null {
    try {
      const raw = localStorage.getItem(TASKS_CACHE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : null;
    } catch {
      return null;
    }
  }

  onFiltersChanged(filters: TaskFilters): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    const { search, status } = this.currentFilters;

    this.filteredTasks = this.tasks.filter((task) => {
      const matchesStatus = status === 'ALL' || task.status === status;
      const matchesSearch =
        !search ||
        task.name.toLowerCase().includes(search) ||
        (task.description || '').toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }

  openAddTaskModal(): void {
    this.showAddTaskModal = true;
  }

  closeAddTaskModal(): void {
    this.showAddTaskModal = false;
  }

  onTaskCreated(request: TaskRequest): void {
    this.taskService.createTask(request).subscribe({
      next: () => {
        this.closeAddTaskModal();
        this.refreshAll();
      },
      error: () => (this.apiError = 'Failed to create task. Please check the task name and try again.')
    });
  }

 onCompleteTask(task: Task): void {
  this.taskService.updateStatus(task.id, 'COMPLETED').subscribe({
    next: () => {

      this.zone.run(() => {
          const updatedTask: Task = { ...task, status: 'COMPLETED' };
      this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
      this.cacheTasks(this.tasks);
      this.applyFilters();
      this.refreshSummaryOnly();
      this.taskListComponent.onUpdate(this.tasks);
      this.refreshAll();
      });
    
    },
    error: () => {
      this.apiError = 'Failed to update task status. Restoring the task list.';
      this.refreshAll();
    }
  });
}

private refreshSummaryOnly(): void {
  this.taskService.getSummary().subscribe({
    next: (summary) => (this.summary = summary),
    error: () => (this.summary = this.computeSummaryFromTasks(this.tasks))
  });
}

onDeleteTask(task: Task): void {
  this.taskService.deleteTask(task.id).subscribe({
    next: () => {

       this.zone.run(() => {
        this.taskListComponent.removeRow(task);
        this.refreshAll();
      });


    },
    error: () => {
      this.apiError = 'Failed to delete task. Please try again.';
    }
  });
}

}
