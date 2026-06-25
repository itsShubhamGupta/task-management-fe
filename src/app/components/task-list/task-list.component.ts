import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  GetRowIdParams,
  ICellRendererParams,
  ValueFormatterParams
} from 'ag-grid-community';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private _tasks: Task[] = [];
  private gridApi?: GridApi<Task>;

  @Input()
  set tasks(value: Task[]) {
    this._tasks = value ?? [];
    // Push straight into the grid the moment new data arrives —
    // this fires on create, complete, AND delete.
    this.gridApi?.setGridOption('rowData', this._tasks);
  }
  get tasks(): Task[] {
    return this._tasks;
  }

  @Output() completeTask = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  // Stable row identity by task.id — required for ag-Grid to correctly
  // diff add/remove operations instead of matching by row index.
  getRowId = (params: GetRowIdParams<Task>): string => String(params.data.id);

  colDefs: ColDef<Task>[] = [
    { field: 'name', headerName: 'Task Name', flex: 2, minWidth: 160, cellClass: 'task-name-cell' },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
      minWidth: 180,
      valueFormatter: (params: ValueFormatterParams<Task>) => params.value || '—'
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      cellRenderer: (params: ICellRendererParams<Task>) => {
        const isCompleted = params.value === 'COMPLETED';
        const span = document.createElement('span');
        span.className = `status-badge ${isCompleted ? 'status-completed' : 'status-pending'}`;
        span.textContent = isCompleted ? 'Completed' : 'Pending';
        return span;
      }
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 2,
      minWidth: 170,
      valueFormatter: (params: ValueFormatterParams<Task>) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: 'Actions',
      flex: 2,
      minWidth: 190,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<Task>) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'actions-cell';
        const task = params.data as Task;

        if (task.status === 'PENDING') {
          const completeBtn = document.createElement('button');
          completeBtn.className = 'btn-complete';
          completeBtn.textContent = 'Mark Completed';
          completeBtn.addEventListener('click', () => this.completeTask.emit(task));
          wrapper.appendChild(completeBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => this.deleteTask.emit(task));
        wrapper.appendChild(deleteBtn);

        return wrapper;
      }
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: true
  };

  onGridReady(event: GridReadyEvent<Task>): void {
    this.gridApi = event.api;
    this.gridApi.setGridOption('rowData', this._tasks);
  }
  
  removeRow(task: Task): void {
  this.gridApi?.applyTransaction({
    remove: [task]
  });
      // this.gridApi.setGridOption('rowData', this._tasks);

}
private onCompleteClick(task: Task): void {
  const updatedTask: Task = { ...task, status: 'COMPLETED' };
  this.gridApi?.applyTransaction({ update: [updatedTask] });
  this.completeTask.emit(task);
}

 onUpdate(task:any): void {
  // const updatedTask: Task = { ...task, status: 'COMPLETED' };
  // this.gridApi?.applyTransaction({ update: [updatedTask] });
  // this.completeTask.emit(task);
      this.gridApi?.setGridOption('rowData', task);

}

// ngOnChanges(changes: SimpleChanges): void {
//   console.log('Tasks changed', this.tasks.length);

//   if (changes['tasks'] && this.gridApi) {
//     this.gridApi.setGridOption('rowData', [...this.tasks]);
//   }
// }
}