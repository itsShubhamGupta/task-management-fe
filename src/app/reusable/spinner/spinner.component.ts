import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../core/loader.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {


  @Input() show = false;
  @Input() size = 48;
  loading$ = this.loaderService.loading$
    .pipe(distinctUntilChanged());

  constructor(private loaderService: LoaderService) {}
}