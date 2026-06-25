import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskRequest } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  name = '';
  description = '';
  errorMessage = '';

  @Output() taskCreated = new EventEmitter<TaskRequest>();

  /**
   * Basic client-side validation: task name is mandatory.
   * The backend re-validates regardless, so this is purely for fast,
   * friendly feedback before a network call is made.
   */
  onSubmit(): void {
    const trimmedName = this.name.trim();

    if (!trimmedName) {
      this.errorMessage = 'Task name is mandatory.';
      return;
    }

    this.errorMessage = '';
    this.taskCreated.emit({
      name: trimmedName,
      description: this.description.trim()
    });

    this.name = '';
    this.description = '';
  }
}
