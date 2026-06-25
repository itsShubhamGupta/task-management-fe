import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { loaderInterceptor } from './core/loader.interceptor';

/**
 * Standalone Angular 17 app configuration.
 * provideHttpClient() registers HttpClient app-wide so TaskService
 * can be injected and make REST calls without any NgModule.
 */
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([
        loaderInterceptor
      ])), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })]
};
