import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskRequest, TaskSummary, TaskStatus } from '../models/task.model';
import { environment } from '../core/config/environment';

/**
 * Central place for all HTTP calls to the backend Task API.
 * Components never call HttpClient directly -- they go through this service,
 * keeping API knowledge (URLs, payload shapes) in one spot.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // private readonly baseUrl = 'http://localhost:8080/api/tasks';
private baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  createTask(request: TaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, request);
  }

  updateStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  getSummary(): Observable<TaskSummary> {
    return this.http.get<TaskSummary>(`${this.baseUrl}/summary`);
  }
}
