import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { TaskSummary } from '../../models/task.model';

@Component({
  selector: 'app-dashboard-summary',
    changeDetection: ChangeDetectionStrategy.OnPush,

  standalone: true,
  imports: [],
  templateUrl: './dashboard-summary.component.html',
  styleUrl: './dashboard-summary.component.css'
})
export class DashboardSummaryComponent {
  @Input() summary: TaskSummary = { totalTasks: 0, pendingTasks: 0, completedTasks: 0 };

  ngOnChanges(changes: SimpleChanges) {
    console.log('Dashboard Summary:', changes['summary'].currentValue);
  }
}
