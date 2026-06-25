import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { Task } from './models/task.model';

const sampleTasks: Task[] = [
  { id: 1, name: 'Buy groceries', description: 'Milk and eggs', status: 'PENDING', createdDate: '2026-06-01T10:00:00' },
  { id: 2, name: 'Finish report', description: 'Q2 summary', status: 'COMPLETED', createdDate: '2026-06-02T10:00:00' }
];

describe('AppComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function flushInitialLoad(tasks: Task[] = sampleTasks) {
    httpMock.expectOne('http://localhost:8080/api/tasks').flush(tasks);
    httpMock.expectOne('http://localhost:8080/api/tasks/summary').flush({
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.status === 'PENDING').length,
      completedTasks: tasks.filter((t) => t.status === 'COMPLETED').length
    });
  }

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    flushInitialLoad();
  });

  it('should render the dashboard heading', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushInitialLoad();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Task Management');
  });

  it('should load tasks into filteredTasks on init', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushInitialLoad();

    expect(fixture.componentInstance.filteredTasks.length).toBe(2);
  });

  it('should filter tasks by status', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushInitialLoad();

    fixture.componentInstance.onFiltersChanged({ search: '', status: 'COMPLETED' });

    expect(fixture.componentInstance.filteredTasks.length).toBe(1);
    expect(fixture.componentInstance.filteredTasks[0].name).toBe('Finish report');
  });

  it('should filter tasks by search term across name and description', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushInitialLoad();

    fixture.componentInstance.onFiltersChanged({ search: 'milk', status: 'ALL' });

    expect(fixture.componentInstance.filteredTasks.length).toBe(1);
    expect(fixture.componentInstance.filteredTasks[0].name).toBe('Buy groceries');
  });

  it('should open and close the Add Task modal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    flushInitialLoad();

    expect(fixture.componentInstance.showAddTaskModal).toBe(false);

    fixture.componentInstance.openAddTaskModal();
    expect(fixture.componentInstance.showAddTaskModal).toBe(true);

    fixture.componentInstance.closeAddTaskModal();
    expect(fixture.componentInstance.showAddTaskModal).toBe(false);
  });
});
