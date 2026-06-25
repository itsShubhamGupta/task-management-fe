import { bootstrapApplication } from '@angular/platform-browser';
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// ag-Grid v31+ is modular: register the modules we actually use.
// ClientSideRowModelModule covers a standard in-browser table (our case,
// since all tasks are already loaded from the REST API into memory).
ModuleRegistry.registerModules([ClientSideRowModelModule]);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
