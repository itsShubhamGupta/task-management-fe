import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export type StatusFilter = 'ALL' | 'PENDING' | 'COMPLETED';

export interface TaskFilters {
  search: string;
  status: StatusFilter;
}

/**
 * Search + status filter bar.
 * Filtering happens entirely client-side against the already-loaded
 * task list (no backend round-trip), so results update instantly
 * as the user types or changes the dropdown.
 */
@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.css'
})
export class TaskFiltersComponent {
  search = '';
  status: StatusFilter = 'ALL';

  @Output() filtersChanged = new EventEmitter<TaskFilters>();

  onChange(): void {
    this.filtersChanged.emit({ search: this.search.trim().toLowerCase(), status: this.status });
  }

  clearSearch(): void {
    this.search = '';
    this.onChange();
  }
}
