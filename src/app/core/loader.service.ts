import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Hard ceiling: if a request hasn't called hide() within this window,
 *  force the spinner off so the UI never appears permanently stuck. */
const MAX_LOADING_MS = 15000;

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private requestCount = 0;
  private safetyTimer: ReturnType<typeof setTimeout> | null = null;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(private zone: NgZone) {}

  show(): void {
    this.requestCount++;
    this.loadingSubject.next(true);

    // (Re)arm the failsafe outside Angular's zone so it doesn't itself
    // trigger change detection while just sitting idle.
    if (!this.safetyTimer) {
      this.zone.runOutsideAngular(() => {
        this.safetyTimer = setTimeout(() => {
          this.zone.run(() => this.forceHide());
        }, MAX_LOADING_MS);
      });
    }
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
      this.clearSafetyTimer();
    }
  }

  /** Escape hatch: resets state and hides the overlay no matter what. */
  private forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    this.clearSafetyTimer();
  }

  private clearSafetyTimer(): void {
    if (this.safetyTimer) {
      clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
  }
}