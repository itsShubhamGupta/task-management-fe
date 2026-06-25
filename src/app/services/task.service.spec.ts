import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all tasks via GET /api/tasks', () => {
    const mockTasks: Task[] = [
      { id: 1, name: 'Test task', description: '', status: 'PENDING', createdDate: '2026-06-01T00:00:00' }
    ];

    service.getAllTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should create a task via POST /api/tasks', () => {
    service.createTask({ name: 'New task', description: 'desc' }).subscribe();

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'New task', description: 'desc' });
    req.flush({ id: 1, name: 'New task', description: 'desc', status: 'PENDING', createdDate: '2026-06-01T00:00:00' });
  });

  it('should update status via PATCH /api/tasks/{id}/status', () => {
    service.updateStatus(1, 'COMPLETED').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'COMPLETED' });
    req.flush({ id: 1, name: 'x', description: '', status: 'COMPLETED', createdDate: '2026-06-01T00:00:00' });
  });

  it('should delete a task via DELETE /api/tasks/{id}', () => {
    service.deleteTask(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch the dashboard summary via GET /api/tasks/summary', () => {
    service.getSummary().subscribe((summary) => {
      expect(summary).toEqual({ totalTasks: 3, pendingTasks: 2, completedTasks: 1 });
    });

    const req = httpMock.expectOne(`${baseUrl}/summary`);
    expect(req.request.method).toBe('GET');
    req.flush({ totalTasks: 3, pendingTasks: 2, completedTasks: 1 });
  });
});
