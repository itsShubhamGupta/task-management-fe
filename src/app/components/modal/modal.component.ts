import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Generic modal/popup shell. Content is projected in via <ng-content>,
 * so it can wrap any form (here, the Add Task form) without coupling
 * the modal itself to task-specific logic.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title = '';
  @Output() close = new EventEmitter<void>();

  onBackdropClick(): void {
    this.close.emit();
  }

  onCloseClick(): void {
    this.close.emit();
  }
}
